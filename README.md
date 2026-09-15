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
