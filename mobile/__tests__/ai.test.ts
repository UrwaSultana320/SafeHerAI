import golden from '../src/ai/assets/golden_vector.json';
import {extractFeatures,FEATURE_NAMES,predict} from '../src/ai/inference';
test('TypeScript feature extraction matches Python golden vector',()=>{const actual=extractFeatures(golden.samples);expect(FEATURE_NAMES).toEqual(golden.feature_names);actual.forEach((value,index)=>expect(value).toBeCloseTo(golden.expected_features[index],8));});
test('local model returns normalized operational probabilities',()=>{const result=predict(golden.samples);expect(['normal_activity','phone_drop','possible_fall']).toContain(result.predictedClass);expect(Object.values(result.probabilities).reduce((a,b)=>a+b,0)).toBeCloseTo(1,10);});
