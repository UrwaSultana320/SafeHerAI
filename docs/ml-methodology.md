# ML methodology

The reproducible Python pipeline validates raw CSVs, sorts within sessions, creates 2-second/100-sample windows at 50% overlap, and never crosses session boundaries. `GroupShuffleSplit` holds out complete session IDs; participant-level splitting should replace this when a multi-participant research dataset exists.

Labels map `normal`, `walking`, and `running` to `normal_activity`; `phone_drop` remains distinct; and only `simulated_fall` maps to `possible_fall`. The 28-value ordered vector contains acceleration/gyroscope magnitude statistics, RMS and energy, jerk, post-impact variance, orientation change, and axis means. Python and TypeScript share a golden vector.

Three models are compared: a documented impact/jerk/stillness rule baseline, scaled class-weighted Logistic Regression, and bounded Random Forest. Reports include accuracy, per-class precision/recall/F1, macro metrics, confusion matrices, and possible-fall false-positive/false-negative rates. Logistic Regression is exported because it is compact, interpretable, and exactly reproducible offline; selection is not based on accuracy alone.

`ai/data/development` is generated with seed 42 solely to prove the software pipeline. Its perfect held-out ML score is a synthetic-data artifact and **not a research result**. Real safe, consented, participant-separated data and physical-device validation remain future work. Never perform dangerous real falls.

Run `python scripts/generate_development_data.py`, `python scripts/train.py`, and `python scripts/validate_export.py` from `ai/`.
