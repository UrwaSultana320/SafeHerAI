import { PermissionsAndroid, Platform } from 'react-native';
export type FeaturePermission =
  | 'location'
  | 'microphone'
  | 'camera'
  | 'notifications';
export type PermissionStatus =
  | 'granted'
  | 'denied'
  | 'blocked';
export interface PermissionService {
  check(feature: FeaturePermission): Promise<PermissionStatus>;
  requestForFeature(feature: FeaturePermission): Promise<PermissionStatus>;
}
const androidPermission = (feature: FeaturePermission): string | undefined => {
  if (feature === 'location') return PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
  if (feature === 'microphone') return PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
  if (feature === 'camera') return PermissionsAndroid.PERMISSIONS.CAMERA;
  if (feature === 'notifications' && Number(Platform.Version) >= 33)
    return PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
};
const mapResult = (value: string): PermissionStatus =>
  value === PermissionsAndroid.RESULTS.GRANTED
    ? 'granted'
    : value === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
      ? 'blocked'
      : 'denied';
// Permissions are requested only at the moment a user starts the related feature.
export const permissions: PermissionService = {
  check: async feature => {
    if (Platform.OS !== 'android') return 'denied';
    const permission = androidPermission(feature);
    if (!permission) return 'granted';
    return (await PermissionsAndroid.check(permission as never))
      ? 'granted'
      : 'denied';
  },
  requestForFeature: async feature => {
    if (Platform.OS !== 'android') return 'denied';
    const permission = androidPermission(feature);
    if (!permission) return 'granted';
    return mapResult(await PermissionsAndroid.request(permission as never));
  },
};
