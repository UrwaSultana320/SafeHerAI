# Architecture

SafeHer AI combines an Android-first React Native/TypeScript app with an offline Python/scikit-learn workspace. There is no cloud backend or remote inference.

## Emergency path

```text
manual SOS ─┐
shake ──────┼→ EmergencyEngine → foreground location → message
AI fall ────┘                                      → SMS composer → history
```

Every trigger calls the same engine. It selects enabled contacts by priority, validates numbers, optionally requests location, generates one message format, opens the platform composer, and persists the actual result. Screens do not independently dispatch emergencies.

## Sensor and AI path

```text
Android accelerometer + gyroscope (~50 Hz)
        ├→ labelled session → private CSV → explicit share → Python pipeline
        ├→ shake signal → debounce → cancellation countdown → EmergencyEngine
        └→ 100-sample window / 50-sample step → 28 ordered features
             → rule baseline + local Logistic Regression → DecisionPolicy
             → normal / phone-drop suppression / possible-fall countdown
             → cancel feedback OR EmergencyEngine
```

The shared Kotlin bridge prevents duplicate sensor implementations. Collection creates one session ID and label per CSV. Live inference maintains a 2-second sliding window with 50% overlap and a cooldown.

## Layers

- `screens`: user interaction, visible safety states, empty/error states
- `services`: EmergencyEngine, message/location/SMS adapters, device and sensor collection
- `ai`: feature extraction, model loading, scaling, softmax, operational mapping
- `storage`: MMKV JSON keys with runtime validation for profile, contacts, settings, history, sessions, recordings, and feedback
- `android`: just-in-time native location, IMU events, alarm/vibration, MediaRecorder, and private file sharing
- `ai/` repository root: raw validation, session windowing, features, models, metrics, export, golden vector

React Navigation native-stack connects Home, contacts, SOS, tools, AI, collection, history, profile, and settings. Android backup is disabled. Sensitive permissions are requested only when a user starts the relevant feature.
