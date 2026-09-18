"""Leakage-safe SafeHer feature, evaluation, and export utilities."""
from __future__ import annotations
import json
from pathlib import Path
import numpy as np
import pandas as pd

SAMPLE_COLUMNS = ["timestamp","acc_x","acc_y","acc_z","gyro_x","gyro_y","gyro_z","activity_label","session_id"]
FEATURE_NAMES = [
    "acc_mag_mean","acc_mag_std","acc_mag_var","acc_mag_min","acc_mag_max","acc_mag_range","acc_mag_peak","acc_mag_rms","acc_mag_energy",
    "gyro_mag_mean","gyro_mag_std","gyro_mag_var","gyro_mag_min","gyro_mag_max","gyro_mag_range","gyro_mag_peak","gyro_mag_rms","gyro_mag_energy",
    "jerk_mean_abs","jerk_max","post_impact_acc_variance","orientation_change","acc_x_mean","acc_y_mean","acc_z_mean","gyro_x_mean","gyro_y_mean","gyro_z_mean",
]
LABEL_MAP = {"phone_drop":"phone_drop", "simulated_fall":"possible_fall"}

def load_raw(paths: list[Path]) -> pd.DataFrame:
    frames = [pd.read_csv(path) for path in paths]
    if not frames: raise ValueError("No CSV files supplied")
    frame = pd.concat(frames, ignore_index=True)
    missing = sorted(set(SAMPLE_COLUMNS) - set(frame.columns))
    if missing: raise ValueError(f"Missing columns: {missing}")
    frame[SAMPLE_COLUMNS[0:7]] = frame[SAMPLE_COLUMNS[0:7]].apply(pd.to_numeric, errors="raise")
    if frame[SAMPLE_COLUMNS].isnull().any().any(): raise ValueError("Null sensor values are not allowed")
    if not np.isfinite(frame[SAMPLE_COLUMNS[0:7]].to_numpy()).all(): raise ValueError("Non-finite sensor values are not allowed")
    if (frame.groupby("session_id")["activity_label"].nunique() > 1).any(): raise ValueError("A session cannot contain multiple labels")
    return frame.sort_values(["session_id","timestamp"]).reset_index(drop=True)

def _stats(values: np.ndarray) -> list[float]:
    return [float(values.mean()),float(values.std()),float(values.var()),float(values.min()),float(values.max()),float(np.ptp(values)),float(np.max(np.abs(values))),float(np.sqrt(np.mean(values**2))),float(np.mean(values**2))]

def extract_features(window: pd.DataFrame, sample_rate: int = 50) -> np.ndarray:
    acc = window[["acc_x","acc_y","acc_z"]].to_numpy(float); gyro = window[["gyro_x","gyro_y","gyro_z"]].to_numpy(float)
    acc_mag=np.linalg.norm(acc,axis=1); gyro_mag=np.linalg.norm(gyro,axis=1); jerk=np.abs(np.diff(acc_mag))*sample_rate
    impact=int(np.argmax(acc_mag)); tail=acc_mag[impact+1:impact+1+sample_rate]
    if len(tail)==0: tail=np.array([acc_mag[-1]])
    a=acc[0]; b=acc[-1]; denominator=max(float(np.linalg.norm(a)*np.linalg.norm(b)),1e-9)
    angle=float(np.arccos(np.clip(float(np.dot(a,b))/denominator,-1,1)))
    values=_stats(acc_mag)+_stats(gyro_mag)+[float(jerk.mean()) if len(jerk) else 0.0,float(jerk.max()) if len(jerk) else 0.0,float(tail.var()),angle,*acc.mean(axis=0).astype(float),*gyro.mean(axis=0).astype(float)]
    return np.asarray(values,dtype=float)

def window_sessions(frame: pd.DataFrame, window_size: int = 100, step: int = 50) -> tuple[pd.DataFrame,np.ndarray,np.ndarray]:
    features=[]; labels=[]; groups=[]
    for session_id, session in frame.groupby("session_id", sort=False):
        if len(session)<window_size: continue
        for start in range(0,len(session)-window_size+1,step):
            features.append(extract_features(session.iloc[start:start+window_size])); labels.append(LABEL_MAP.get(str(session.iloc[0].activity_label),"normal_activity")); groups.append(str(session_id))
    if not features: raise ValueError("No complete windows available")
    return pd.DataFrame(features,columns=FEATURE_NAMES),np.asarray(labels),np.asarray(groups)

def rule_predict(features: pd.DataFrame) -> np.ndarray:
    fall=(features.acc_mag_max>20)&(features.jerk_max>150)&(features.post_impact_acc_variance<2.5); drop=(features.acc_mag_max>17)&~fall
    return np.where(fall,"possible_fall",np.where(drop,"phone_drop","normal_activity"))

def export_logistic(path: Path, pipeline, threshold: float = .55) -> None:
    scaler=pipeline.named_steps["scaler"]; model=pipeline.named_steps["model"]
    payload={"model_type":"multinomial_logistic_regression","model_version":"safeher-lr-1","feature_names":FEATURE_NAMES,"scaler_mean":scaler.mean_.tolist(),"scaler_scale":scaler.scale_.tolist(),"coefficients":model.coef_.tolist(),"intercepts":model.intercept_.tolist(),"class_order":model.classes_.tolist(),"possible_fall_threshold":threshold}
    path.parent.mkdir(parents=True,exist_ok=True); path.write_text(json.dumps(payload,indent=2),encoding="utf-8")
