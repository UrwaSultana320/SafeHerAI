from pathlib import Path
import json
from safeher_ml import FEATURE_NAMES
ROOT=Path(__file__).resolve().parents[1]
model=json.loads((ROOT/"models"/"safeher_logistic_v1.json").read_text())
assert model["feature_names"]==FEATURE_NAMES
n=len(FEATURE_NAMES); assert len(model["scaler_mean"])==n==len(model["scaler_scale"])
assert len(model["coefficients"])==len(model["class_order"])
assert all(len(row)==n for row in model["coefficients"])
print(f"Valid model {model['model_version']}: {n} features, classes={model['class_order']}")
