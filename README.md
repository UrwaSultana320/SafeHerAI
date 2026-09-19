# SafeHer AI
## Intelligent Women Safety & Emergency Response System

An Android-first academic prototype that combines established mobile safety tools with local, sensor-based emergency detection and human confirmation.

## Project Overview

SafeHer AI reconstructs and extends my undergraduate **Women Safety Application** Final Year Project (FYP).

The original FYP focused on emergency contacts, GPS/GPRS location tracking, emergency SMS, a shake emergency trigger, panic alarm, fake call, and audio/video safety functionality. The reconstructed application preserves the practical safety workflow while adding accelerometer and gyroscope collection, machine-learning-based fall/emergency detection, phone-drop versus possible-fall classification, confidence-aware decisions, false-alarm reduction, a user-confirmation countdown, local/offline inference, and timeout-based emergency escalation.

The current implementation is a small-scale prototype. It does not claim real-world fall-detection accuracy or production readiness.

## Why I Revisited This Project

I originally developed the Women Safety Application as my undergraduate FYP. After several years of professional software-engineering experience and a transition toward AI/ML, I revisited the problem to explore how machine learning could improve emergency detection while reducing false alerts.

## Key Features

### Emergency & Safety

- Local user profile and prioritized emergency-contact management
- Press-and-hold manual SOS through a central emergency engine
- Foreground location retrieval and a user-reviewed Android SMS composer
- Debounced shake trigger with a cancellation countdown
- Panic alarm, fake-call simulation, and visible local audio recording
- Local emergency history with honest success and failure states

### AI / Machine Learning

- Accelerometer and gyroscope input at approximately 50 Hz
- Rule-based baseline, Logistic Regression, and Random Forest comparison
- Offline TypeScript inference using an exported Logistic Regression model
- Confidence-aware phone-drop suppression and possible-fall handling
- “I'm Safe,” “Send Help Now,” and timeout-escalation paths
- Python/TypeScript golden-vector feature-parity validation

### Data Collection & Evaluation

- Labelled, session-based sensor collection
- Private CSV storage with explicit export/share
- Two-second sensor windows with 50% overlap
- Fixed 28-feature contract shared by Python and TypeScript
- Session-level train/test separation to reduce leakage
- Fall-focused evaluation including false-positive and false-negative rates

## System Architecture

```text
Manual SOS / Shake / AI Fall Detection
                  ↓
      Decision / Confirmation Policy
                  ↓
           Emergency Engine
                  ↓
     Location + Emergency Message
                  ↓
   SMS Workflow + Emergency History
```

```text
Accelerometer + Gyroscope
             ↓
       Sensor Windows
             ↓
     Feature Extraction
             ↓
Rule Baseline + ML Classifier
             ↓
     Confidence / Class
             ↓
 Emergency Decision Policy
```

Emergency-critical processing is local-first. The application has no cloud backend or remote inference dependency.

## AI / ML Methodology

Sensor sessions use the core labels `normal`, `walking`, `running`, `phone_drop`, and `simulated_fall`. Samples are grouped into time windows without crossing session boundaries, then converted into an ordered feature vector covering acceleration, gyroscope motion, jerk, post-impact variance, and orientation change.

The pipeline compares a documented rule-based baseline with scaled, class-weighted Logistic Regression and Random Forest. Evaluation reports accuracy, precision, recall, F1-score, confusion matrices, false-positive rate, and false-negative rate. Model selection is not based on accuracy alone; possible-fall recall, false negatives, false positives, portability, and interpretability are also considered.

The current pipeline data is **synthetic development data used only to validate the software workflow**. Its metrics are not presented as research results.

## On-Device AI

The selected lightweight Logistic Regression model is exported to JSON and reproduced in TypeScript so inference can run locally on Android rather than through a remote Python API. Each completed sensor window produces class probabilities and model confidence. Normal activity continues monitoring, phone-drop predictions are suppressed, and a sufficiently confident possible fall opens a countdown where the user can select **I'm Safe** or **Send Help Now**. If the countdown expires, the central emergency engine escalates the event.

## Technology Stack

| Area | Technologies |
| --- | --- |
| Mobile | React Native, TypeScript, Android, Kotlin native bridge |
| AI/ML | Python, scikit-learn, pandas, NumPy |
| Storage | MMKV local storage, app-private filesystem |
| Development | Git, GitHub, Jest, ESLint, Gradle |

## Repository Structure

```text
SafeHerAI/
├── mobile/                     # React Native app and Android bridge
├── ai/                         # Data, training, evaluation, and export pipeline
├── docs/                       # Architecture, methodology, testing, and limitations
├── AGENTS.md                   # Repository working instructions
├── SAFEHER_AI_MASTER_SPEC.md   # Project specification and progress ledger
└── README.md
```

## Original FYP vs SafeHer AI

| Original FYP | SafeHer AI |
| --- | --- |
| User-triggered emergency | Manual and AI-assisted detection |
| GPS/GPRS tracking | Structured foreground location service |
| SMS alerts | Central emergency-engine workflow with SMS composer |
| Shake trigger | Shake plus sensor-driven AI |
| Rule-based behavior | Rule baseline plus ML classifiers |
| No confidence estimate | Confidence-aware decisions |
| Basic false-alarm handling | Countdown and user feedback |
| No ML evaluation | Precision, recall, F1, FPR, and FNR evaluation |

## Current Project Status

- Core implementation: complete
- TypeScript: passed
- Lint: passed
- Automated tests: 11/11 passed
- Android debug build: passed
- ML training/export pipeline: passed
- Physical-device validation: pending

These automated results were recorded during the final audit on 18 September 2026. The ML pipeline currently uses **synthetic/development data** for software validation because real sensor collection has not yet been performed on a physical Android device. Synthetic-data metrics must not be interpreted as real-world or research performance.

## Device Validation Pending

The next validation phase is to verify the implemented workflows on a physical Android device:

- GPS retrieval and permission/error states
- SMS composer recipients and message content
- MMKV/native persistence after restart
- Accelerometer and gyroscope sampling
- CSV sensor save and export
- Alarm, fake call, and visible audio recording
- AI countdown, cancellation, immediate help, and timeout escalation

## Research Limitations

- The present ML evaluation uses simulated/synthetic development data.
- This is a small-scale prototype, not a medical or public-safety certified system.
- Real-world fall detection requires substantially larger, more diverse, safely collected datasets.
- Android device, SMS-app, permission, battery, DND, and OEM behavior may vary.
- Video recording is deferred; hidden recording is intentionally prohibited.

## Future Work

- Collect safe, consented, multi-user sensor data
- Evaluate the model and full workflow on physical devices
- Improve false-positive reduction using real observations
- Test additional models only when evidence justifies the added complexity
- Explore an optional voice emergency trigger
- Explore optional cloud synchronization without weakening the local emergency path
- Broaden Android device and OEM testing

## Setup

Prerequisites: Node.js 22.11 or later, npm, Python 3, Android SDK platform/build tools 37, NDK 27.1.12297006, and a compatible JDK. On Windows, the included build script can discover Android Studio's bundled JDK and the default Android SDK location.

Install and validate the mobile application:

```sh
cd mobile
npm ci
npm run typecheck
npm run lint
npm test -- --runInBand
npm run build:android
```

To run on Android, connect an authorized device or start an emulator, run `npm start`, and then run `npm run android` in a second terminal.

Install and validate the ML pipeline:

```sh
cd ai
python -m pip install -r requirements.txt
python scripts/generate_development_data.py
python scripts/train.py
python scripts/validate_export.py
```

See [docs/testing.md](docs/testing.md) for validation scope and [docs/ml-methodology.md](docs/ml-methodology.md) for the feature and evaluation methodology.

## Screenshots

Screenshots will be added after physical-device validation.

## Demo

A device demonstration will be recorded after runtime validation. The planned safe demonstration flow is documented in [docs/demo-script.md](docs/demo-script.md).

## Disclaimer

SafeHer AI is an academic/research prototype and is not a certified medical or emergency-response system.

Further technical detail is available in [architecture](docs/architecture.md), [Android limitations](docs/android-limitations.md), and [privacy](docs/privacy.md).
