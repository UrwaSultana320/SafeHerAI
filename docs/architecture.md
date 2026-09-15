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
