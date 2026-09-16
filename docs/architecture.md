# Architecture

SafeHer AI uses a modular React Native Android app plus an offline Python ML workspace.

## Mobile layers

- UI / screens and navigation
- Local storage (profile, contacts, settings, history)
- Permissions (request only when a feature needs them)
- Services (Emergency Engine, location, SMS, sensors, recording, AI inference)
- Typed domain models

Milestone 1 implements structure and placeholders only. GPS, SMS, sensors, ML inference, Firebase, background services, and camera are out of scope until later approved milestones.

## Emergency path (future)

Triggers (SOS, shake, AI) will call a single Emergency Engine. The first SMS implementation will use the Android SMS composer/intent, not silent `SmsManager`.

## AI path (future)

Labeled IMU sessions are exported from the app, trained in `ai/`, and a compact exported model can later run on-device. Training uses safe simulated activities only.

## Milestone 1 implementation

React Navigation native-stack connects eight screens. MMKV stores `v1.profile`, `v1.contacts`, `v1.settings`, and `v1.history`; schemas are checked at the storage boundary. Defaults contain no personal contacts, and automatic escalation defaults off. Native storage is mocked in Jest; tests cover repository behavior rather than claiming device persistence verification.

Service contracts live together in `mobile/src/services/index.ts` until real adapters justify separate folders. Every adapter returns `not_implemented`. The SOS button only navigates to a preview. Permission requests are inactive and no dangerous Android permissions are declared. No global state package is needed for these placeholders.

Navigation uses the Android fragment restoration setup from the [React Navigation guide](https://reactnavigation.org/docs/getting-started/).

## Specification alignment (2026-09-16)

Preserved the imported foundation, completed the master-spec domain types (including sensor data contracts only), and aligned storage validation and conservative defaults. Added navigation coverage for all seven Home destinations, storage default/write validation coverage, and testing/demo documentation. No dependencies or future milestone behaviors were added.

The pre-spec scaffold's abbreviated profile/contact/settings/history shapes are not accepted by the finalized validators. Existing invalid records remain preserved and reported; no automatic deletion or fabricated migration is performed. The preview has no data editors and no released schema migration is claimed.
