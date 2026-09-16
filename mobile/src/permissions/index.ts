export type FeaturePermission =
  | 'location'
  | 'microphone'
  | 'camera'
  | 'notifications';
export type PermissionStatus =
  | 'not_implemented'
  | 'granted'
  | 'denied'
  | 'blocked';
export interface PermissionService {
  check(feature: FeaturePermission): Promise<PermissionStatus>;
  requestForFeature(feature: FeaturePermission): Promise<PermissionStatus>;
}
// Add platform requests only when the associated feature is approved. Never request on startup.
export const permissions: PermissionService = {
  check: async () => 'not_implemented',
  requestForFeature: async () => 'not_implemented',
};
