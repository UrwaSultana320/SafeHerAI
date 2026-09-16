# SafeHer AI

Intelligent Women Safety & Emergency Response System — Android-first prototype.

## Purpose

SafeHer AI is a reconstruction and AI enhancement of an undergraduate Final Year Project: a women-safety mobile application with SOS tools, emergency contacts, and offline-capable emergency messaging.

This rebuild keeps the original safety-tool intent and adds a research-oriented motion-classification pipeline (rule-based baseline compared with a trained classifier) so possible falls can be distinguished from everyday movement and phone drops, with a confirmation countdown before any escalation.

## Prototype disclaimer

This is a **graduate-school / portfolio prototype**, not a certified medical, public-safety, or production emergency product.

- It does not replace official emergency services (for example 15 / 112 / 911).
- Fall detection will use **controlled, safe simulated activities only** — not dangerous physical fall testing.
- Sensor models trained on acted data will not match real-world trauma. False alarms and missed events are expected.
- Silent SMS, background monitoring, and always-on sensing are **not** part of the initial milestones.

## High-level architecture

```
SafeHerAI/
  mobile/     React Native (TypeScript) Android app
  ai/         Offline training, evaluation, exported model artifacts
  docs/       Architecture, Android limitations, privacy, ML notes
```

The mobile app is organized so UI never talks to SMS or GPS directly. A future **Emergency Engine** will be the only path that can escalate. Milestone 1 ships navigation, local storage, typed models, and service **placeholders** only.

Emergency SMS, when implemented, will start with the standard Android SMS composer/intent. Silent `SmsManager` sending is deferred. Foreground-only operation comes first; no background location or foreground services in Milestone 1.

## Status

**Milestone 1:** project foundation (this repository state). Later milestones are not implemented until explicitly approved.

## Development

From `mobile/`:

```sh
npm ci
npm run typecheck
npm test -- --runInBand
npm run lint
npm run build:android
```

The Windows build script discovers Android Studio's bundled JDK and the default local Android SDK if environment variables are unset. It uses an ignored `.build-tmp/` directory to avoid Java socket failures with long/redirected temporary paths. `JAVA_HOME` and `ANDROID_HOME` overrides are supported. Other platforms should configure those variables normally.

Build requirements follow the preserved template: React Native 0.87.1, Node >=22.11, Android SDK platform 37, build tools 37.0.0, NDK 27.1.12297006, and a compatible JDK. Minimum Android API is 26; target is 36. See the [React Native environment guide](https://reactnative.dev/docs/set-up-your-environment).

The React Native Gradle plugin requires a Java 17 compilation toolchain; Gradle may download it automatically even when the launcher uses Android Studio's newer bundled Java.

To run after a successful build, connect an Android device with USB debugging or start an emulator. Start Metro with `npm start`, then run `npm run android` in another terminal with Java and Android SDK configured. Debug builds require Metro. No release or physical-device verification is implied by a successful debug build.

## Foundation modules

- `mobile/src/app/`: typed native-stack navigation to all eight screens.
- `mobile/src/components/`, `screens/`: shared page layout, dashboard, and clearly inactive previews.
- `mobile/src/models/`: profile, contacts, settings, events, and trigger types.
- `mobile/src/storage/`: MMKV repositories with versioned JSON keys and validation. Corrupt records are preserved and reported.
- `mobile/src/services/`: six inactive service contracts returning `not_implemented`.
- `mobile/src/permissions/`: just-in-time permission contract; no native requests yet.

No profile/contact editor or emergency workflow is implemented. MMKV is app-local, not configured with application-level encryption; do not treat this prototype as a secure vault. Android backup is disabled.

For current acceptance results and device checks, see [testing](docs/testing.md) and the master specification Progress Ledger. The demo script is in [docs/demo-script.md](docs/demo-script.md).
