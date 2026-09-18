"""Create clearly synthetic data for software validation, never research claims."""
from pathlib import Path
import numpy as np
import pandas as pd
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/"data"/"development"/"synthetic_sensor_sessions.csv"
def main() -> None:
    rng=np.random.default_rng(42); rows=[]; labels=["normal","walking","running","phone_drop","simulated_fall"]
    for label in labels:
      for session_num in range(8):
        n=200; t=np.arange(n)/50; acc=np.column_stack([rng.normal(0,.12,n),rng.normal(0,.12,n),rng.normal(9.81,.15,n)]); gyro=rng.normal(0,.025,(n,3))
        if label=="walking": acc[:,2]+=1.8*np.sin(2*np.pi*2*t); acc[:,0]+=.7*np.sin(2*np.pi*2*t); gyro[:,1]+=.5*np.sin(2*np.pi*2*t)
        elif label=="running": acc[:,2]+=4*np.sin(2*np.pi*3*t); acc[:,0]+=2*np.sin(2*np.pi*3*t); gyro[:,1]+=1.2*np.sin(2*np.pi*3*t)
        elif label=="phone_drop":
          impact=75+rng.integers(-5,6); acc[impact-5:impact]=rng.normal(0,.08,(5,3)); acc[impact]=[rng.normal(18,1),0,rng.normal(10,1)]; acc[impact+1:]+=rng.normal([0,0,9.81],[.4,.4,.4],(n-impact-1,3)); gyro[impact-4:impact+4]+=rng.normal(0,2,(8,3))
        elif label=="simulated_fall":
          impact=75+rng.integers(-5,6); acc[impact-4:impact]=rng.normal(0,.12,(4,3)); acc[impact]=[rng.normal(24,1),rng.normal(4,1),rng.normal(8,1)]; acc[impact+1:]=rng.normal([0,9.81,0],[.12,.12,.12],(n-impact-1,3)); gyro[impact-10:impact+10]+=rng.normal(0,3,(20,3))
        session=f"dev-{label}-{session_num:02d}"
        for i in range(n): rows.append([int(i*20),*acc[i],*gyro[i],label,session,f"synthetic-{session_num%4}"])
    OUT.parent.mkdir(parents=True,exist_ok=True); pd.DataFrame(rows,columns=["timestamp","acc_x","acc_y","acc_z","gyro_x","gyro_y","gyro_z","activity_label","session_id","participant_id"]).to_csv(OUT,index=False)
    print(f"Wrote {len(rows)} synthetic development rows to {OUT}")
if __name__=="__main__": main()
