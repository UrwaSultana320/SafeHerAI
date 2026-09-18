# SafeHer AI

SafeHer AI is an Android-first women-safety and emergency-response portfolio prototype. It rebuilds an undergraduate Final Year Project—SOS, trusted contacts, panic alarm, fake call, and recording—and adds a local sensor-based fall-detection research pipeline.

> This is not a certified medical, public-safety, or production emergency product. It does not replace official emergency services. False alarms and missed detections are expected; only safe simulated movement testing is permitted.

## Features

- Local emergency-contact CRUD with priority, validation, and enable/disable controls
- Deliberate press-and-hold SOS through one central `EmergencyEngine`
- Foreground last-known/fresh GPS lookup with timeout and permission handling
- User-reviewed Android SMS composer with identity, trigger, time, coordinates, and Maps URL
- Honest local emergency history, including failures
- Debounced shake trigger with cancellation countdown
- Panic alarm/vibration, local fake-call simulation, and explicit local audio recording
- Labelled accelerometer/gyroscope collection near 50 Hz, private CSV save, and explicit export/share
- Python pipeline comparing a rule baseline, scaled Logistic Regression, and Random Forest
- Offline TypeScript Logistic Regression with Python/TypeScript golden-vector parity
- Phone-drop suppression, possible-fall countdown, immediate help, timeout escalation, and local false-alarm feedback

Video recording is the only deferred original feature: the current project has no compatible camera recording stack, and hidden recording is intentionally prohibited.

## Architecture

```text
SOS / shake / AI fall
        ↓
EmergencyEngine → foreground location → message → SMS composer → event history

accelerometer + gyroscope → 2 s windows → ordered features
        → rule baseline + local Logistic Regression → decision policy
        → phone-drop suppression OR fall countdown → EmergencyEngine
```

The system is local-first and has no Firebase, cloud backend, analytics, or remote inference. React Native screens use a small Kotlin bridge for location, sensors, alarm, recording, and private-file sharing. MMKV holds structured local state.

## Technology

- React Native 0.87.1, React 19, TypeScript, React Navigation, MMKV
- Android/Kotlin native bridge; minimum API 26, target API 36
- Python 3, NumPy, pandas, scikit-learn
- Jest, ESLint, TypeScript, Gradle

## Repository

```text
mobile/src/ai/          feature extraction and local inference
mobile/src/screens/     emergency, safety, sensor, and AI UI
mobile/src/services/    EmergencyEngine and native service adapters
mobile/src/storage/     validated local persistence
mobile/android/         Kotlin bridge and Android configuration
ai/scripts/             generation, validation, features, training, export
ai/models/              exported Logistic Regression and golden vector
ai/evaluation/          synthetic development evaluation
docs/                   architecture, privacy, testing, demo, limitations
```

## Setup and validation

Requirements: Node 22.11+, npm, Android SDK platform 37/build tools 37, NDK 27.1.12297006, and a compatible JDK. On Windows, the build script discovers Android Studio's bundled JDK and default SDK.

```sh
cd mobile
npm ci
npm run typecheck
npm run lint
npm test -- --runInBand
npm run build:android
```

To run, connect an authorized Android device or boot an emulator, start Metro with `npm start`, then use `npm run android`. A successful debug build does not prove GPS, SMS, microphone, alarm, sensor, or runtime behavior.

ML validation from `ai/`:

```sh
python -m pip install -r requirements.txt
python scripts/generate_development_data.py
python scripts/train.py
python scripts/validate_export.py
```

The generated data is deterministic synthetic development data. Its metrics prove the code path only and must not be cited as real-world research performance. Windows are 2 seconds at 50 Hz with 50% overlap and session-level holdout; windows never cross sessions. Model selection considers possible-fall recall, false-negative rate, false-positive rate, portability, and interpretability—not accuracy alone.

## Emergency workflow

Configure a profile and at least one enabled contact. SOS, shake, and AI use the same engine. If location is enabled, the engine asks just in time, uses a recent last-known fix or requests a fresh fix, generates the message, opens the installed SMS app, and records whether the composer opened or why it failed. The user must tap Send; silent SMS is not claimed.

## Limitations and future work

- Physical-device and emulator runtime acceptance is pending.
- Foreground-only sensors/location; OEM background and battery policies are not bypassed.
- SMS composer behavior varies by installed app and does not prove delivery.
- DND and volume settings can limit alarm sound.
- The model uses synthetic development data and needs safe, consented, participant-separated real data.
- Audio files, contact data, location history, and MMKV values are app-private but not application-level encrypted.
- Future work includes real-device evaluation, accessibility testing, calibrated thresholds, participant-level research, and a compatible visible video-recording flow.

## Demo and screenshots

Use [docs/demo-script.md](docs/demo-script.md) for the safe demo flow. Add real screenshots only after device validation; place them under `docs/screenshots/` and caption device/API and build commit. Do not fabricate screenshots or emergency outcomes.

See [architecture](docs/architecture.md), [ML methodology](docs/ml-methodology.md), [testing](docs/testing.md), [privacy](docs/privacy.md), and [Android limitations](docs/android-limitations.md).
