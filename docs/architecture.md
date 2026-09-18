# Architecture

SafeHer AI uses a modular React Native Android app plus an offline Python ML workspace.

## Mobile layers

- UI / screens and navigation
- Local storage (profile, contacts, settings, history)
- Permissions (request only when a feature needs them)
- Services (Emergency Engine, location, SMS, sensors, recording, AI inference)
- Typed domain models

The emergency core is implemented locally. Sensors, recording, and ML inference are added in later milestones; Firebase is not used.

## Emergency path

Triggers (SOS, shake, AI) call one Emergency Engine, which requests location, builds a consistent message, opens the Android SMS composer, and persists an honest result. No screen sends an emergency independently.

## AI path (future)

Labeled IMU sessions are exported from the app, trained in `ai/`, and a compact exported model can later run on-device. Training uses safe simulated activities only.

## Sensor collection

One Android sensor bridge serves shake detection, labelled collection, and AI monitoring. Session collectors combine the latest gyroscope reading with accelerometer samples at an approximately 50 Hz request rate, never mix session IDs, and save the required CSV columns into private app storage before an explicit share action.

## Milestone 1 implementation

React Navigation native-stack connects eight screens. MMKV stores `v1.profile`, `v1.contacts`, `v1.settings`, and `v1.history`; schemas are checked at the storage boundary. Defaults contain no personal contacts, and automatic escalation defaults off. Native storage is mocked in Jest; tests cover repository behavior rather than claiming device persistence verification.

Service contracts and the emergency orchestration live in `mobile/src/services/index.ts`. A small Android bridge obtains last-known or fresh foreground location with a timeout. Permissions are requested only when SOS needs location. No global state package is required.

Navigation uses the Android fragment restoration setup from the [React Navigation guide](https://reactnavigation.org/docs/getting-started/).

## Specification alignment (2026-09-16)

Preserved the imported foundation, completed the master-spec domain types (including sensor data contracts only), and aligned storage validation and conservative defaults. Added navigation coverage for all seven Home destinations, storage default/write validation coverage, and testing/demo documentation. No dependencies or future milestone behaviors were added.

The pre-spec scaffold's abbreviated profile/contact/settings/history shapes are not accepted by the finalized validators. Existing invalid records remain preserved and reported; no automatic deletion or fabricated migration is performed. The preview has no data editors and no released schema migration is claimed.
