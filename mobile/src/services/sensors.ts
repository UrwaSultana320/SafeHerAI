import type { SensorSample, SensorSession } from '../models';
import { deviceServices, type NativeSensorEvent } from './device';

export const SENSOR_LABELS = ['normal', 'walking', 'running', 'phone_drop', 'simulated_fall', 'sitting_down', 'standing_up', 'quick_phone_pickup'] as const;
export const samplesToCsv = (samples: SensorSample[]) => ['timestamp,acc_x,acc_y,acc_z,gyro_x,gyro_y,gyro_z,activity_label,session_id', ...samples.map(s => [s.timestamp,s.acc_x,s.acc_y,s.acc_z,s.gyro_x,s.gyro_y,s.gyro_z,s.activity_label,s.session_id].join(','))].join('\n');
export class SensorSessionCollector {
  readonly session: SensorSession; readonly samples: SensorSample[] = [];
  private gyro = { x: 0, y: 0, z: 0 }; private unsubscribe?: () => void;
  constructor(label: string) { this.session = { session_id: `session-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, label, started_at: new Date().toISOString(), sample_rate_target: 50, sample_count: 0 }; }
  start(onSample: (count: number) => void) { this.unsubscribe = deviceServices.subscribeSensors((event: NativeSensorEvent) => { if (event.sensor === 'gyroscope') { this.gyro = event; return; } this.samples.push({ timestamp: event.timestamp, acc_x:event.x,acc_y:event.y,acc_z:event.z,gyro_x:this.gyro.x,gyro_y:this.gyro.y,gyro_z:this.gyro.z,activity_label:this.session.label,session_id:this.session.session_id }); this.session.sample_count=this.samples.length; onSample(this.samples.length); }); }
  stop() { this.unsubscribe?.(); this.unsubscribe=undefined; this.session.ended_at = new Date().toISOString(); return this.session; }
}
