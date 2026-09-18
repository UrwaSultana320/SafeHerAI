from pathlib import Path
import json, sys
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, precision_recall_fscore_support
from sklearn.model_selection import GroupShuffleSplit
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
sys.path.insert(0,str(Path(__file__).parent))
from safeher_ml import load_raw, window_sessions, rule_predict, export_logistic, extract_features, FEATURE_NAMES
ROOT=Path(__file__).resolve().parents[1]; DATA=ROOT/"data"/"development"/"synthetic_sensor_sessions.csv"; EVAL=ROOT/"evaluation"; MODEL=ROOT/"models"/"safeher_logistic_v1.json"
def metrics(y,pred):
    classes=["normal_activity","phone_drop","possible_fall"]; precision,recall,f1,support=precision_recall_fscore_support(y,pred,labels=classes,zero_division=0); cm=confusion_matrix(y,pred,labels=classes); fall=classes.index("possible_fall"); negatives=cm.sum()-cm[fall].sum(); fp=cm[:,fall].sum()-cm[fall,fall]; fn=cm[fall,:].sum()-cm[fall,fall]
    return {"accuracy":accuracy_score(y,pred),"macro_precision":float(precision.mean()),"macro_recall":float(recall.mean()),"macro_f1":float(f1.mean()),"possible_fall_fpr":float(fp/negatives if negatives else 0),"possible_fall_fnr":float(fn/cm[fall,:].sum() if cm[fall,:].sum() else 0),"per_class":{c:{"precision":precision[i],"recall":recall[i],"f1":f1[i],"support":int(support[i])} for i,c in enumerate(classes)},"confusion_matrix":cm.tolist(),"class_order":classes}
def main():
    if not DATA.exists(): raise SystemExit("Run generate_development_data.py first")
    raw=load_raw([DATA]); X,y,groups=window_sessions(raw); split=GroupShuffleSplit(n_splits=1,test_size=.25,random_state=42); train,test=next(split.split(X,y,groups)); assert not(set(groups[train])&set(groups[test]))
    logistic=Pipeline([("scaler",StandardScaler()),("model",LogisticRegression(max_iter=1500,class_weight="balanced",random_state=42))]); forest=RandomForestClassifier(n_estimators=200,max_depth=10,min_samples_leaf=2,class_weight="balanced",random_state=42,n_jobs=-1)
    logistic.fit(X.iloc[train],y[train]); forest.fit(X.iloc[train],y[train]); results={"warning":"SYNTHETIC DEVELOPMENT DATA — NOT RESEARCH RESULTS","split":"session-level GroupShuffleSplit","seed":42,"train_sessions":len(set(groups[train])),"test_sessions":len(set(groups[test])),"rule_baseline":metrics(y[test],rule_predict(X.iloc[test])),"logistic_regression":metrics(y[test],logistic.predict(X.iloc[test])),"random_forest":metrics(y[test],forest.predict(X.iloc[test])),"selected_model":"logistic_regression","selection_reason":"Portable, interpretable on-device model; selection considers fall recall/FNR and false-positive rate, not accuracy alone."}
    EVAL.mkdir(exist_ok=True); (EVAL/"development_metrics.json").write_text(json.dumps(results,indent=2,default=float),encoding="utf-8"); export_logistic(MODEL,logistic)
    golden=raw[raw.session_id==raw.session_id.iloc[0]].iloc[:100]; (MODEL.parent/"golden_vector.json").write_text(json.dumps({"sample_rate":50,"samples":golden[["acc_x","acc_y","acc_z","gyro_x","gyro_y","gyro_z"]].to_dict("records"),"feature_names":FEATURE_NAMES,"expected_features":extract_features(golden).tolist()},indent=2),encoding="utf-8")
    print(json.dumps(results,indent=2,default=float))
if __name__=="__main__": main()
