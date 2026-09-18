import modelJson from './assets/safeher_logistic_v1.json';

export interface ImuPoint { acc_x:number;acc_y:number;acc_z:number;gyro_x:number;gyro_y:number;gyro_z:number }
export const FEATURE_NAMES = ["acc_mag_mean","acc_mag_std","acc_mag_var","acc_mag_min","acc_mag_max","acc_mag_range","acc_mag_peak","acc_mag_rms","acc_mag_energy","gyro_mag_mean","gyro_mag_std","gyro_mag_var","gyro_mag_min","gyro_mag_max","gyro_mag_range","gyro_mag_peak","gyro_mag_rms","gyro_mag_energy","jerk_mean_abs","jerk_max","post_impact_acc_variance","orientation_change","acc_x_mean","acc_y_mean","acc_z_mean","gyro_x_mean","gyro_y_mean","gyro_z_mean"] as const;
const mean=(v:number[])=>v.reduce((a,b)=>a+b,0)/v.length; const variance=(v:number[])=>{const m=mean(v);return mean(v.map(x=>(x-m)**2));};
const stats=(v:number[])=>{const m=mean(v),vr=variance(v),min=Math.min(...v),max=Math.max(...v);return[m,Math.sqrt(vr),vr,min,max,max-min,Math.max(...v.map(Math.abs)),Math.sqrt(mean(v.map(x=>x*x))),mean(v.map(x=>x*x))];};
export function extractFeatures(samples:ImuPoint[],sampleRate=50):number[]{
  if(samples.length<2)throw new Error('At least two samples are required.');
  const acc=samples.map(s=>Math.hypot(s.acc_x,s.acc_y,s.acc_z)); const gyro=samples.map(s=>Math.hypot(s.gyro_x,s.gyro_y,s.gyro_z)); const jerk=acc.slice(1).map((v,i)=>Math.abs(v-acc[i])*sampleRate); const impact=acc.indexOf(Math.max(...acc)); const tail=acc.slice(impact+1,impact+1+sampleRate); const quiet=tail.length?tail:[acc.at(-1)!];
  const first=samples[0],last=samples.at(-1)!;const dot=first.acc_x*last.acc_x+first.acc_y*last.acc_y+first.acc_z*last.acc_z;const denom=Math.max(Math.hypot(first.acc_x,first.acc_y,first.acc_z)*Math.hypot(last.acc_x,last.acc_y,last.acc_z),1e-9);const angle=Math.acos(Math.max(-1,Math.min(1,dot/denom)));
  const axis=(key:keyof ImuPoint)=>mean(samples.map(s=>s[key]));
  return [...stats(acc),...stats(gyro),mean(jerk),Math.max(...jerk),variance(quiet),angle,axis('acc_x'),axis('acc_y'),axis('acc_z'),axis('gyro_x'),axis('gyro_y'),axis('gyro_z')];
}
export interface LogisticModel {model_type:string;model_version:string;feature_names:string[];scaler_mean:number[];scaler_scale:number[];coefficients:number[][];intercepts:number[];class_order:string[];possible_fall_threshold:number}
export const MODEL=modelJson as LogisticModel;
export interface Prediction {predictedClass:string;probabilities:Record<string,number>;fallConfidence:number;phoneDropConfidence:number;modelVersion:string;ruleResult:string}
export function predict(samples:ImuPoint[],model:LogisticModel=MODEL):Prediction{
  const features=extractFeatures(samples);if(model.feature_names.join('|')!==FEATURE_NAMES.join('|'))throw new Error('Model feature order mismatch.');const scaled=features.map((value,i)=>(value-model.scaler_mean[i])/model.scaler_scale[i]);const logits=model.coefficients.map((row,i)=>row.reduce((sum,c,j)=>sum+c*scaled[j],model.intercepts[i]));const peak=Math.max(...logits);const exp=logits.map(v=>Math.exp(v-peak));const total=exp.reduce((a,b)=>a+b,0);const probabilities=Object.fromEntries(model.class_order.map((name,i)=>[name,exp[i]/total]));const predictedClass=model.class_order.reduce((best,name)=>probabilities[name]>probabilities[best]?name:best,model.class_order[0]);const f=Object.fromEntries(FEATURE_NAMES.map((name,i)=>[name,features[i]]));const ruleResult=f.acc_mag_max>20&&f.jerk_max>150&&f.post_impact_acc_variance<2.5?'possible_fall':f.acc_mag_max>17?'phone_drop':'normal_activity';return{predictedClass,probabilities,fallConfidence:probabilities.possible_fall||0,phoneDropConfidence:probabilities.phone_drop||0,modelVersion:model.model_version,ruleResult};
}
