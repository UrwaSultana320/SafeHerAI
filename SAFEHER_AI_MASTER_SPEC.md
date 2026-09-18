# SafeHer AI - Master Project Specification

**Repository source of truth:** `SAFEHER_AI_MASTER_SPEC.md`  
**Project:** SafeHer AI - Intelligent Women Safety & Emergency Response System  
**Platform:** Android-first  
**Purpose:** Rebuild the original undergraduate Women Safety FYP and extend it into a technically credible AI/ML portfolio and research-oriented prototype.

---

## 0. How Codex Must Use This Document

This file is the **single source of truth** for the project.

Whenever Codex is asked to implement work:

1. Read this entire file first.
2. Inspect the current repository and Git status before editing.
3. Preserve completed work unless a change is necessary to satisfy this specification.
4. Implement only the requested milestone unless the prompt explicitly authorizes more.
5. Run the milestone's acceptance checks.
6. Fix project-level errors before stopping.
7. Update the **Progress Ledger** in this file.
8. Create a Git commit for the completed milestone.
9. Report files changed, dependencies changed, checks run, build result, and blockers.
10. Do not silently change architecture, technologies, model definitions, safety rules, or scope. Explain any required deviation first.

Codex may use the local terminal, install project dependencies, edit repository files, run builds/tests, and use local Git.

---

# 1. Project Background

The original undergraduate FYP was a **Women Safety Application** developed by a three-member team.

The original project included or planned the following core functionality:

- emergency contact management
- SOS/emergency triggering
- GPRS/GPS location tracking
- emergency SMS containing the user's location
- shake-based discreet emergency activation
- proposed repeated power-button triggering
- Panic Scream / alarm
- Fake Call functionality
- audio/video recording
- SMS sending and receiving
- Android GUI
- emphasis on emergency assistance without requiring continuous internet access

The reconstructed system must preserve the spirit of the original work while honestly distinguishing original FYP functionality from the new AI implementation.

The rebuilt version is:

# **SafeHer AI - Intelligent Women Safety & Emergency Response System**

---

# 2. Primary Goal

Build a working Android safety application combining:

1. manual safety tools
2. emergency communication
3. phone sensor collection
4. machine-learning-based fall/emergency detection
5. false-alarm reduction
6. human confirmation before automated escalation
7. offline-capable critical functionality
8. quantitative AI evaluation

The project's strongest technical story is:

> A conventional mobile safety system is reconstructed and extended into an AI-assisted emergency detection system that compares rule-based detection with machine learning, focuses on false-positive reduction, and uses confidence-aware human confirmation before escalation.

---

# 3. Scope

## 3.1 Core features that must be completed

### User and settings
- local user profile
- app settings
- emergency preferences
- countdown duration
- protection state

### Emergency contacts
- add
- edit
- delete
- priority
- enable/disable
- multiple contacts
- phone validation

### Manual SOS
- prominent SOS control
- intentional activation
- optional confirmation/hold action
- location retrieval
- emergency message generation
- SMS composer fallback
- event history/log

### Original safety tools
- shake emergency trigger
- Panic Scream / loud alarm
- Fake Call simulation
- visible audio recording
- video recording only if time permits

### Sensor and AI features
- accelerometer collection
- gyroscope collection
- labeled sensor-session recording
- CSV/JSON export
- feature extraction
- rule-based fall baseline
- Logistic Regression classifier
- Random Forest comparison model
- evaluation metrics
- on-device inference for selected lightweight model
- emergency confidence
- phone-drop suppression
- countdown/confirmation
- false-alarm feedback
- automatic escalation after timeout

## 3.2 Stretch features

Only after the core is complete:

- voice/secret-phrase trigger
- video evidence recording
- background protection while screen is locked
- Firebase/cloud synchronization
- contact picker
- in-app map
- TFLite/ONNX model
- iOS
- multiple-user dataset
- remote acknowledgment

## 3.3 Explicit non-goals

Do not make these critical-path requirements:

- becoming the default SMS app
- reading the full SMS inbox
- hidden microphone/camera recording
- hidden always-on surveillance
- bypassing Android security
- intercepting physical power-button events
- claiming medical-device accuracy
- claiming production/public-safety certification
- adding a large deep-learning model only for appearance

---

# 4. Product Honesty and Safety

The README and demo must state:

- this is a research/portfolio prototype
- it is not a certified medical or public-safety device
- it is not a replacement for official emergency services
- falls are simulated safely
- small-dataset results are not population-level reliability claims
- Android permissions and OEM restrictions may limit behavior
- sensitive location and recordings stay local unless explicitly used in an emergency workflow

Never design testing that requires dangerous real falls.

---

# 5. Technology Stack

## Mobile
- React Native
- TypeScript
- Android first
- native-capable React Native build

## Android
- Android Studio / Android SDK
- Kotlin native bridge only when needed
- physical Android phone preferred for sensors and SMS testing

## State
- Zustand or equivalent lightweight state management

## Local persistence
- MMKV or equivalent lightweight key-value storage
- filesystem for sensor sessions and media

## Navigation
- React Navigation
- native stack
- optional bottom tabs

## AI/ML
- Python
- scikit-learn
- pandas
- numpy
- joblib
- matplotlib for saved evaluation plots if required

## Source control
- local Git from the beginning
- GitHub remote later

## Cloud
- not required for core prototype
- Firebase is future work only

Use stable mutually compatible package versions and record exact versions in README.

---

# 6. Repository Structure

```text
SafeHerAI/
|
|-- SAFEHER_AI_MASTER_SPEC.md
|-- README.md
|-- .gitignore
|
|-- docs/
|   |-- architecture.md
|   |-- android-limitations.md
|   |-- privacy.md
|   |-- ml-methodology.md
|   |-- testing.md
|   `-- demo-script.md
|
|-- mobile/
|   |-- android/
|   |-- src/
|   |   |-- app/
|   |   |-- navigation/
|   |   |-- screens/
|   |   |-- components/
|   |   |-- models/
|   |   |-- storage/
|   |   |-- permissions/
|   |   |-- services/
|   |   |   |-- emergency/
|   |   |   |-- location/
|   |   |   |-- sms/
|   |   |   |-- sensors/
|   |   |   |-- shake/
|   |   |   |-- recording/
|   |   |   `-- alarm/
|   |   |-- ai/
|   |   |   |-- featureExtraction/
|   |   |   |-- inference/
|   |   |   `-- model/
|   |   `-- utils/
|   `-- assets/
|
`-- ai/
    |-- requirements.txt
    |-- data/
    |   |-- raw/
    |   |-- processed/
    |   `-- samples/
    |-- scripts/
    |   |-- load_data.py
    |   |-- preprocess.py
    |   |-- feature_engineering.py
    |   |-- train_models.py
    |   |-- evaluate_models.py
    |   `-- export_model.py
    |-- models/
    `-- evaluation/
```

Do not create unnecessary enterprise-level abstractions.

---

# 7. Core Domain Models

## UserProfile

```text
id
name
phoneNumber
optionalMedicalNote
createdAt
updatedAt
```

## EmergencyContact

```text
id
name
phoneNumber
priority
relationshipOptional
enabled
createdAt
updatedAt
```

## AppSettings

```text
protectionEnabled
shakeEnabled
aiDetectionEnabled
panicAlarmEnabled
recordingEnabled
countdownSeconds
autoEscalateEnabled
locationInEmergencyEnabled
```

`autoEscalateEnabled` should default conservatively.

## EmergencyEvent

```text
id
triggerSource
timestamp
status
latitudeOptional
longitudeOptional
locationAccuracyOptional
smsMode
contactCount
aiClassOptional
aiConfidenceOptional
cancelledByUser
errorCodeOptional
notesOptional
```

Possible statuses:

```text
triggered
awaiting_confirmation
cancelled
location_acquired
location_unavailable
composer_opened
sent
send_failed
permission_denied
completed
```

## EmergencyTriggerSource

```text
sos_button
shake
ai_fall
voice
test
```

## SensorSample

```text
timestamp
acc_x
acc_y
acc_z
gyro_x
gyro_y
gyro_z
session_id
activity_label
```

## SensorSession

```text
session_id
label
started_at
ended_at
sample_rate_target
sample_count
device_model_optional
notes_optional
```

---

# 8. Required Screens

1. Splash / lightweight onboarding
2. Home
3. SOS
4. Emergency Contacts
5. Add/Edit Emergency Contact
6. Safety Tools
7. Fake Call
8. Panic Alarm
9. Audio Recording
10. Sensor Data Collection
11. AI Detection Status
12. Emergency Countdown
13. Emergency History
14. Settings
15. Profile

Screens may be combined where appropriate. Do not create elaborate visual designs just to satisfy a list.

---

# 9. Home Screen

Required:

- SafeHer AI title
- protection state
- prominent SOS button
- Emergency Contacts shortcut
- Safety Tools shortcut
- AI Detection shortcut
- recent emergency status if useful
- clear indication when AI protection is off

The SOS control should reduce accidental activation using a hold action, confirmation, or both.

---

# 10. Permissions Strategy

Use just-in-time permissions.

Potential permissions:

- fine/coarse location
- notifications
- vibration
- microphone
- camera only if video ships
- SMS only if direct sending is implemented
- foreground-service permissions only for a later background-protection feature

Rules:

- explain why permission is needed
- do not request everything on first launch
- degrade gracefully if denied
- never crash because permission is absent
- never fake a successful emergency send

---

# 11. Emergency Engine

There must be one reusable **EmergencyEngine**.

No UI screen, shake handler, or AI module should independently send emergency messages.

```text
Trigger
  -> EmergencyEngine
  -> Decision/confirmation policy
  -> LocationService
  -> Emergency message builder
  -> SmsService/composer
  -> EmergencyEvent log
```

Triggers:

```text
SOS
Shake
AI fall prediction
Voice (stretch)
```

---

# 12. Trigger-Specific Policy

## Manual SOS

```text
press/hold SOS
-> short confirmation or immediate execution
-> obtain location
-> compose/send emergency message
-> log
```

## Shake

```text
shake detected
-> short countdown
-> user can cancel
-> otherwise EmergencyEngine
```

## AI

```text
AI possible fall
-> countdown
-> I'm Safe cancels + logs negative feedback
-> Send Help Now escalates immediately
-> timeout escalates
-> EmergencyEngine
```

Do not send an SMS from one raw sensor spike.

---

# 13. Location Service

Emergency location strategy:

1. try last-known location
2. request fresh location
3. use a timeout
4. prefer fresh fix if available
5. fall back to last-known and record that fact
6. if no coordinates, continue emergency flow without coordinates and log `location_unavailable`

Example message:

```text
EMERGENCY ALERT

[User name] may need assistance.

Trigger: Possible fall
Time: [local timestamp]

Location:
https://maps.google.com/?q=[latitude],[longitude]
```

Do not include unnecessary private data.

---

# 14. SMS Strategy

## Required core path

Use the Android SMS composer intent first.

Track:

```text
composer_opened
```

Do not log `sent` unless the app can genuinely determine it.

## Optional direct sending

A small Kotlin wrapper around Android `SmsManager` may be added later if:

- permissions work on the physical test device
- Android restrictions are documented
- the prototype is not represented as Play Store-ready behavior

Direct SMS must not block completion of the project.

---

# 15. Shake Detection

Use accelerometer data.

Do not maintain two independent shake systems.

Possible approach:

- acceleration magnitude
- repeated threshold crossings in a short interval
- debounce/cooldown
- invoke EmergencyEngine through shake confirmation policy

Shake detection is not the project's ML model.

---

# 16. Panic Alarm

Implement:

- visible activation
- loud looping sound
- stop control
- vibration if allowed

Do not promise bypass of Do Not Disturb or OEM restrictions.

---

# 17. Fake Call

Implement a local fake incoming-call UI.

Possible settings:

- caller name
- delay
- ringtone
- accept/reject UI
- optional scripted conversation screen

Document it as a decoy UI, not real telephony.

---

# 18. Recording

## Core
Audio recording with:

- explicit start
- explicit stop
- visible recording indicator
- local storage
- reference in app history if useful

## Stretch
Video recording.

No hidden background recording.

---

# 19. AI Research Questions

Primary:

> Can smartphone inertial sensor data distinguish possible human falls from ordinary activities and phone drops while reducing false emergency alerts?

Secondary:

> How much does a confirmation/countdown decision policy improve practical emergency behavior compared with raw model predictions alone?

---

# 20. Sensor Data Collection

Dedicated Sensor Data Collection mode.

Required labels:

```text
normal
walking
running
phone_drop
simulated_fall
```

Optional only if enough data exists:

```text
sitting_down
standing_up
stairs
quick_phone_pickup
```

Target sampling rate:

```text
approximately 50 Hz
```

Each session:

- choose label
- short countdown
- record 8-15 seconds
- generate session ID
- collect accelerometer + gyroscope
- save CSV
- list sessions
- allow export/share

CSV fields:

```text
timestamp,acc_x,acc_y,acc_z,gyro_x,gyro_y,gyro_z,activity_label,session_id
```

---

# 21. Safe Data Collection Rules

Never instruct dangerous falls.

Safe examples:

- normal phone carrying
- walking
- safe jogging/running
- phone placement/drop on soft surface
- controlled simulated fall movement onto mattress/cushion
- knee/seat transition simulations

If public datasets are used later, document dataset name, source, participants, sensor placement, sample rate, license, and differences from self-collected data.

Never mix external and self-collected data without provenance.

---

# 22. Windowing

Recommended initial configuration:

```text
window size: 2.0 seconds
overlap: 50%
target sample rate: approximately 50 Hz
```

Rules:

- windows never cross session boundaries
- incomplete windows may be dropped
- train/test split by session where possible
- if multiple participants exist, prefer participant split

---

# 23. Feature Engineering

Python and TypeScript must use the same ordered feature contract.

Suggested features:

### Acceleration
- magnitude
- mean magnitude
- standard deviation
- variance
- min
- max
- range
- peak magnitude
- RMS
- energy

### Gyroscope
- magnitude
- mean
- standard deviation
- variance
- max
- range
- energy

### Motion change
- jerk from acceleration magnitude
- max jerk
- mean absolute jerk
- orientation-change proxy if practical
- post-impact low-motion variance

Do not add features that cannot be reproduced on-device.

---

# 24. ML Models

## Model 1 - Rule-Based Baseline

Possible logic:

```text
high acceleration peak
+
orientation/motion change
+
short low-motion period
=
possible fall
```

Tune thresholds using training data only.

This is a baseline, not ML.

## Model 2 - Logistic Regression

Primary lightweight deployment candidate.

Use:

- StandardScaler
- class weighting if useful
- documented feature ordering
- probability output

Reasons:

- interpretable
- lightweight
- reproducible in TypeScript
- easy to explain

## Model 3 - Random Forest

Comparison model.

Use controlled complexity and reproducible seed.

Do not deploy it automatically just because overall accuracy is higher.

Model selection should prioritize:

- possible-fall recall
- false-positive rate
- robustness
- deployability
- explainability

---

# 25. Operational Class Mapping

Training labels:

```text
normal
walking
running
phone_drop
simulated_fall
```

Operational outcomes:

```text
normal_activity
phone_drop
possible_fall
```

Mapping:

```text
normal + walking + running -> normal_activity
phone_drop -> phone_drop
simulated_fall -> possible_fall
```

A high phone-drop probability should suppress fall escalation.

---

# 26. Evaluation Metrics

Report at minimum:

- accuracy
- precision
- recall
- F1-score
- per-class metrics
- confusion matrix
- false-positive rate for possible fall
- false-negative rate for possible fall

Also report practical policy outcomes if possible:

```text
How many windows opened a countdown?
How many escalated after policy?
How many false alarms were prevented by cancellation?
```

Never use accuracy alone.

---

# 27. Data Leakage Rules

Never randomly split individual rows from the same sensor session across training and test sets.

Prefer:

1. participant split if enough participants
2. otherwise session-level split

Document the limitation if only one user contributes data.

---

# 28. Model Export

Primary deployment target: **Logistic Regression exported as JSON**.

Export:

- feature order
- scaler mean
- scaler scale
- coefficients
- intercepts
- class order
- decision threshold(s)
- model/version metadata

Example:

```json
{
  "model_type": "logistic_regression",
  "version": "1.0",
  "feature_names": [],
  "scaler_mean": [],
  "scaler_scale": [],
  "coefficients": [],
  "intercepts": [],
  "classes": []
}
```

Do not require a Python server for emergency inference.

---

# 29. On-Device Inference

TypeScript path:

```text
raw sensor window
-> feature extraction
-> scaling
-> logistic-regression probability
-> operational class mapping
-> DecisionPolicy
```

A **golden feature test** is required:

- one known sensor window
- expected Python feature vector
- TypeScript feature vector
- compare within floating-point tolerance

This prevents silent Python/mobile feature mismatch.

---

# 30. AI Detection Status Screen

Show development/demo information:

- protection state
- sensor status
- current activity prediction
- fall confidence
- phone-drop confidence
- rule baseline output
- ML output
- recent AI event

Keep the main Home screen simpler.

---

# 31. Emergency Countdown

When AI predicts a possible fall:

```text
Possible Fall Detected

Are you safe?

Emergency alert will begin in:
10...

[I'M SAFE]
[SEND HELP NOW]
```

### I'm Safe
- cancel
- create false-alarm feedback
- store sensor-window reference if opted into research data
- return to protection mode

### Send Help Now
- bypass remaining countdown
- invoke EmergencyEngine

### Timeout
- invoke EmergencyEngine

---

# 32. False-Alarm Feedback

Store:

```text
timestamp
prediction
confidence
user_response
session_reference
model_version
```

This creates a future retraining path.

Do not claim real-time learning unless retraining is actually implemented.

---

# 33. UI Principles

The UI should be:

- professional
- simple
- fast
- accessible
- large touch targets
- clear safety state
- minimal taps in emergencies

Avoid elaborate animation systems until the core is complete.

---

# 34. Error Handling

Every service must handle failure explicitly.

### Location
- permission denied
- location disabled
- timeout
- no fresh fix

### SMS
- no SMS-capable app
- invalid phone number
- permission denied
- composer launch failure

### Sensors
- unavailable sensor
- sampling interruption
- invalid sample

### Recording
- permission denied
- storage failure

### ML
- missing model
- model version mismatch
- feature-count mismatch
- invalid probability

Never silently swallow critical errors.

---

# 35. Logging

Development logs must not contain:

- private recording contents
- secrets
- unnecessary personal information

Emergency event history should be readable in the app.

---

# 36. Git Rules

Recommended commits:

```text
baseline - imported SafeHer AI planning documents
milestone 1 - app foundation
milestone 2 - emergency contacts gps and sms workflow
milestone 3 - safety tools
milestone 4 - sensor data collection
milestone 5 - machine learning pipeline
milestone 6 - on-device AI emergency workflow
milestone 7 - testing documentation and demo polish
```

Before milestone work:

```text
git status
```

After successful completion:

```text
git status
git add ...
git commit ...
```

Do not commit:

- secrets
- large raw datasets
- build outputs
- local environment files
- unnecessary model binaries
- recordings

Tiny representative sample data may be committed.

---

# 37. Required Documentation

## README.md
Eventually include:

- overview
- original FYP background
- AI enhancement
- features
- architecture
- setup
- Android requirements
- AI methodology
- limitations
- screenshots/demo
- research results
- disclaimer

## docs/architecture.md
System structure and flow.

## docs/android-limitations.md
Document power-button limitations, background restrictions, SMS restrictions, microphone/camera limitations, and DND/alarm behavior.

## docs/privacy.md
Explain local-first design, permissions, location, recordings, and dataset handling.

## docs/ml-methodology.md
Explain collection, labels, windowing, features, models, split strategy, metrics, and limitations.

## docs/testing.md
Manual and automated test cases.

## docs/demo-script.md
1-3 minute project demo flow.

---

# 38. Milestone 0 - Environment and Baseline

## Objective
Make the repo safe and reproducible before feature development.

## Tasks
- inspect existing Cursor-created files
- preserve useful planning/docs
- initialize local Git if needed
- create root `.gitignore`
- verify Node/npm
- verify Android SDK/JDK
- verify Python
- record exact versions in README
- create baseline commit

## Acceptance criteria
- clean understandable structure
- Git works
- no secrets tracked
- environment blockers identified

## Commit

```text
baseline - imported SafeHer AI planning documents
```

---

# 39. Milestone 1 - Application Foundation

## Objective
Create a runnable Android React Native TypeScript app.

## Tasks
- initialize `mobile/`
- navigation
- lightweight local storage
- permissions architecture
- models/types
- service interfaces/stubs
- initial screens:
  - Home
  - SOS
  - Emergency Contacts
  - Safety Tools
  - AI Detection
  - Emergency History
  - Profile
  - Settings
- basic professional UI
- Home includes protection state, SOS, Contacts, Safety Tools, AI Detection
- complete AI/docs skeleton
- TypeScript check
- Android build

## Must not implement yet
- real GPS
- real SMS
- real sensors
- ML
- Firebase
- background protection
- recording

## Acceptance criteria
- TypeScript passes
- Android debug build succeeds
- app launches
- navigation works
- local-storage smoke test works
- no critical console errors

## Commit

```text
milestone 1 - SafeHer AI foundation
```

---

# 40. Milestone 2 - Emergency Core

## Objective
Create a working manual emergency vertical slice.

## Tasks

### Contacts
- local CRUD
- validation
- priority
- empty state

### SOS
- intentional activation
- confirmation/hold interaction
- call EmergencyEngine

### Location
- permission handling
- last-known location
- fresh fix
- timeout
- maps URL

### Message
- consistent emergency message

### SMS
- Android composer intent
- selected emergency contacts
- log composer-opened state
- optional direct SmsManager investigation only after composer flow works

### History
- log emergency events
- show history
- display failures honestly

## Acceptance criteria
- contact persists after restart
- SOS obtains location on physical phone
- composer opens with correct recipient/message
- event is logged
- location failure does not crash
- permission denial does not crash
- no internet dependency for core flow except usefulness of map link

## Commit

```text
milestone 2 - emergency contacts gps and sms workflow
```

---

# 41. Milestone 3 - Original Safety Tools

## Objective
Rebuild the main non-AI safety tools.

## Tasks

### Shake
- accelerometer-based detector
- debounce
- short countdown
- invoke EmergencyEngine

### Panic alarm
- start/stop
- visible state

### Fake Call
- caller configuration
- timer
- fake incoming UI
- accept/reject

### Audio recording
- microphone permission
- explicit REC indicator
- local file
- stop/save

### Video
- stretch only

## Acceptance criteria
- shake does not constantly retrigger
- shake can be cancelled
- panic alarm starts/stops
- fake call is consistent
- audio recording is explicit and saved
- no hidden recording

## Commit

```text
milestone 3 - safety tools
```

---

# 42. Milestone 4 - Sensor Data Collection

## Objective
Create a real data pipeline from the phone.

## Tasks
- SensorService
- accelerometer
- gyroscope
- approximately 50 Hz target
- session management
- label selection
- CSV output
- session list
- export/share
- sample-count display
- validation

Labels:

```text
normal
walking
running
phone_drop
simulated_fall
```

## Acceptance criteria
- both sensors produce samples on physical device
- timestamps valid
- samples attached to session ID
- labels persist in CSV
- CSV opens with Python/pandas
- multiple safe sessions export successfully

## Commit

```text
milestone 4 - sensor data collection
```

---

# 43. Milestone 5 - Machine Learning Pipeline

## Objective
Create and evaluate the genuine AI component.

## Tasks

### Python
- virtual environment
- `requirements.txt`
- reproducible seed

### Data
- loader
- validation
- preprocessing
- session-aware windowing

### Features
- documented ordered feature vector

### Models
1. rule baseline
2. Logistic Regression
3. Random Forest

### Evaluation
- accuracy
- precision
- recall
- F1
- confusion matrix
- possible-fall FPR
- possible-fall FNR
- model comparison table

### Export
Export selected Logistic Regression + scaler metadata to JSON.

## Acceptance criteria
- raw CSV -> metrics pipeline runs end-to-end
- no row-level leakage
- results saved
- limitations documented
- selected model justified by more than overall accuracy
- model JSON created

## Commit

```text
milestone 5 - machine learning pipeline
```

---

# 44. Milestone 6 - On-Device AI Emergency Workflow

## Objective
Connect live phone sensors to AI-assisted emergency escalation.

## Tasks

### Feature parity
- TypeScript feature extraction
- Python/TypeScript golden-vector test

### Inference
- load model JSON
- apply scaler
- Logistic Regression probability
- operational class mapping

### AI status
- rule output
- ML output
- confidence
- protection state

### Live detection
- sliding windows
- 2-second starting window
- 50% overlap
- debounce/cooldown

### Policy
- suppress phone drop
- possible fall -> countdown
- I'm Safe
- Send Help Now
- timeout escalation

### Feedback
- false-alarm record
- model version
- confidence
- session/window reference

## Acceptance criteria
- same window produces matching Python and TypeScript feature vectors
- model runs offline on device
- normal and phone-drop activity do not automatically send alerts
- possible fall opens countdown
- user can cancel
- timeout invokes EmergencyEngine
- feedback persists

## Commit

```text
milestone 6 - on-device AI emergency workflow
```

---

# 45. Milestone 7 - Testing, Documentation, Demo and Polish

## Objective
Turn the working system into a credible graduate-school portfolio project.

## Functional testing
- contacts
- SOS
- permission denial
- no GPS
- SMS composer failure
- shake false trigger
- recording
- sensor collection
- missing model
- countdown cancel
- countdown timeout

## AI testing
- held-out normal sessions
- walking
- running
- phone drop
- simulated fall
- false positives
- false negatives

## UI cleanup
- consistent spacing
- readable typography
- clear buttons
- accessible touch targets
- remove placeholder content

## Documentation
Complete all docs and README.

## Demo script
Show:

1. app overview
2. emergency contacts
3. manual SOS
4. location/SMS
5. an original safety tool
6. sensor data collection
7. AI prediction
8. fall countdown
9. cancel or escalate
10. evaluation results

## Acceptance criteria
- Android build succeeds
- TypeScript passes
- core flows manually tested
- ML pipeline reproducible
- README complete
- demo script complete
- no false production claims
- repository understandable without verbal explanation

## Commit

```text
milestone 7 - testing documentation and demo polish
```

---

# 46. Optional Milestone 8 - Stretch Features

Only after Milestones 1-7:

- secret-phrase voice trigger
- video recording
- background protection with visible foreground notification
- optional direct SMS send
- Firebase sync
- public-dataset comparison
- additional participants
- retraining workflow
- richer AI visualization

Commit each stretch feature separately.

---

# 47. Testing Checklist

## Contacts
- add valid contact
- invalid phone number
- edit
- delete
- persistence after restart

## Permissions
- grant
- deny
- deny permanently
- feature-specific explanation

## SOS
- cancel
- confirm
- GPS success
- GPS timeout
- composer success
- no SMS app

## Shake
- intentional shake
- ordinary walking
- repeated motion
- cooldown

## Sensor collection
- each label
- start/stop
- exported CSV
- missing sensor

## ML
- feature shape
- missing model
- class order
- scaler dimensions
- probability sanity

## AI emergency
- normal
- walking
- running
- phone drop
- simulated fall
- I'm Safe
- Send Help Now
- timeout

---

# 48. Research and Portfolio Deliverables

Final repository should contain:

- working Android app
- source code
- ML pipeline
- small safe example dataset
- evaluation metrics
- confusion matrix
- architecture documentation
- screenshots
- demo script
- model export
- comparison between original FYP and AI upgrade

Suggested comparison:

| Original FYP | SafeHer AI |
|---|---|
| User-triggered emergency | Manual + AI-assisted detection |
| Shake trigger | Shake + sensor classification |
| GPS/GPRS tracking | Robust location service |
| SMS emergency alert | Central Emergency Engine |
| Fixed rules | Rule baseline + ML comparison |
| No model confidence | Confidence-aware policy |
| Limited false-alarm strategy | Countdown + user feedback |
| No quantitative ML evaluation | Precision, recall, F1, FPR, confusion matrix |
| Conventional mobile app | Research-oriented intelligent safety prototype |

---

# 49. Final Definition of Done

The project is complete when:

- Android app builds and launches
- emergency contacts work
- SOS/location/SMS composer works
- history works
- shake/panic/fake-call/audio core tools work
- sensor collection works on a real phone
- dataset export works
- ML pipeline trains/evaluates models
- rule/LR/RF comparison exists
- selected model exports successfully
- model inference runs locally
- AI countdown works
- false-alarm feedback works
- documentation is complete
- demo is reproducible
- Git history contains milestone commits
- limitations are honestly reported

---

# 50. Progress Ledger

Codex updates this after each completed milestone.

- [ ] Milestone 0 - Environment and baseline
- [ ] Milestone 1 - Application foundation (implementation ready; device acceptance pending)
- [x] Milestone 2 - Emergency core (IMPLEMENTATION COMPLETE — DEVICE VALIDATION PENDING)
- [x] Milestone 3 - Original safety tools (IMPLEMENTATION COMPLETE — DEVICE VALIDATION PENDING; VIDEO DEFERRED)
- [x] Milestone 4 - Sensor data collection (IMPLEMENTATION COMPLETE — DEVICE VALIDATION PENDING)
- [x] Milestone 5 - Machine learning pipeline
- [x] Milestone 6 - On-device AI emergency workflow (IMPLEMENTATION COMPLETE — DEVICE VALIDATION PENDING)
- [ ] Milestone 7 - Testing, documentation and demo polish
- [ ] Milestone 8 - Optional stretch work

Current milestone: `M6 - implementation complete; device validation pending (2026-09-18)`

Last successful Android build: `2026-09-16 - npm run build:android; assembleDebug successful`

Last successful TypeScript check: `2026-09-16 - npm run typecheck`

Last successful ML pipeline run: `2026-09-18 - 40 sessions, session-level split, rule/LR/RF evaluated; export validated`

Latest model version: `safeher-lr-1`

Known blockers: `Physical-device validation is pending by instruction. Location fixes, SMS composer integration, and MMKV persistence are implemented but not hardware-verified.`

M1 validation (2026-09-16): 8 Jest tests passed in 2 suites; ESLint and Android JS bundle passed. Storage smoke tests use a mocked native backend. All seven Home destinations and Back navigation pass in Jest. Domain contracts, storage validation/defaults, accessibility labels, and testing/demo docs aligned; existing foundation preserved. No dependencies added. See `docs/testing.md`. M1 remains unchecked until device acceptance; M2 not started.

M2 implementation (2026-09-18): contact CRUD/priority/enablement, deliberate SOS, central EmergencyEngine, foreground Android location bridge, message generation, SMS composer, and persisted event history are complete. Static/build validation recorded in Git commit; physical GPS/SMS/device acceptance remains pending.

M3 implementation (2026-09-18): shared accelerometer shake trigger with debounce/countdown, panic alarm/vibration, fake-call simulation, and explicit local audio recording are complete. Physical audio/sensor validation remains pending. Video is deferred because the current dependency-free native architecture has no camera recording stack; adding one during this run would risk build stability.

M4 implementation (2026-09-18): the shared native SensorService streams accelerometer and gyroscope data near 50 Hz. Labelled sessions use a safe start countdown, duration/sample display, required CSV schema, local file storage, session list, and Android share sheet. Hardware sampling/export acceptance remains pending.

M5 complete (2026-09-18): deterministic synthetic development data validates raw loading, session-aware windows, 28 ordered features, session-level holdout, rule baseline, scaled Logistic Regression, Random Forest, full fall-focused metrics, JSON export, and schema validation. Metrics are explicitly not research results.

M6 implementation (2026-09-18): TypeScript feature extraction passes Python golden-vector parity, exported Logistic Regression runs offline, 2-second windows advance at 50% overlap, phone-drop is suppressed, and possible-fall policy provides cancel/immediate-help/timeout paths through EmergencyEngine. False-alarm feedback persists locally. Live hardware validation remains pending.

---

# 51. Short Prompts for Codex From Now On

## Start or resume a milestone

```text
Read SAFEHER_AI_MASTER_SPEC.md from the repository root and inspect the current repository and Git state.

Implement Milestone X exactly as specified. Preserve completed work, run all acceptance checks, update the Progress Ledger, create the specified Git commit, and stop before the next milestone.

If there is a genuine blocker, report it instead of silently changing the architecture.
```

## Continue interrupted work

```text
Read SAFEHER_AI_MASTER_SPEC.md and inspect the current repository and Git status.

Resume Milestone X from the current state. Do not redo completed work unnecessarily. Complete its acceptance criteria, update the Progress Ledger, commit the milestone, and stop.
```

## Fix a milestone

```text
Read SAFEHER_AI_MASTER_SPEC.md.

Milestone X is implemented but has this problem:

[PASTE ERROR]

Diagnose and fix it without expanding scope into the next milestone. Re-run the milestone acceptance checks and commit the fix.
```

## Review only

```text
Read SAFEHER_AI_MASTER_SPEC.md and inspect the repository.

Do not modify anything. Review Milestone X against its acceptance criteria and report missing, incorrect, fragile, or misleading parts.
```

## Final audit

```text
Read SAFEHER_AI_MASTER_SPEC.md and inspect the entire repository.

Do not add new product features. Perform a final audit against the Definition of Done, run available builds/tests/checks, fix only issues required for compliance, update documentation/progress, and produce the final project-status report.
```

---

# 52. Rule for Future Changes

If project scope changes, update this file first.

Do not allow implementation and specification to drift apart.

**This document is the canonical implementation contract for SafeHer AI.**
