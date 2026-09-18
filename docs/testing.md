# Testing

## Automated commands

From `mobile/`:

```sh
npm run typecheck
npm run lint
npm test -- --runInBand
npm run build:android
```

Jest covers navigation, validated persistence, emergency message/phone validation, Python/TypeScript golden-vector parity, and normalized local-model probabilities. Native services and MMKV are mocked or absent in Jest, so these checks do not prove device behavior.

From `ai/`:

```sh
python scripts/generate_development_data.py
python scripts/train.py
python scripts/validate_export.py
```

The training run validates required numeric columns, session labels, finite values, 2-second windows with 50% overlap, disjoint session groups, three model comparisons, fall FPR/FNR, JSON export, and ordered dimensions. Output is synthetic development validation, not research evidence.

## Pending device acceptance

On an authorized Android device, use fictional data and safe movements only:

1. Verify contact CRUD persists after force-stop/restart.
2. Test location granted, denied, providers disabled, timeout, and no-fix cases.
3. Confirm the installed SMS app receives correct recipients/message; do not claim delivery from composer launch.
4. Confirm missing contacts, malformed numbers, and missing SMS app show honest failures and history entries.
5. Check shake debounce/cancel, alarm start/stop under volume/DND states, fake-call states, microphone denial, visible recording, and private audio save.
6. Check both IMUs, approximate sampling rate, timestamps, session IDs/labels, count/duration, readable CSV, and share sheet.
7. Check AI enable/disable, normal and phone-drop suppression, countdown cancel, immediate help, timeout, feedback persistence, cooldown, and missing/corrupt model handling.
8. Inspect Metro and Logcat for critical errors and verify accessible labels/touch targets.

Never perform a dangerous real fall. Use a development injection harness, golden samples, ordinary motion, or a phone drop onto a padded surface.

## Latest automated result

Final audit on 2026-09-18:

- TypeScript: passed.
- ESLint: passed.
- Jest: 11 tests passed in 4 suites.
- Android debug build: passed (226 tasks; final rerun 3m 58s).
- Android production JavaScript bundle: passed; React Native emitted its upstream internal-export fallback warning.
- Python syntax/import and 28-feature-order checks: passed.
- Synthetic development pipeline: regenerated 40 sessions, used a disjoint session-level split, evaluated rule/LR/RF metrics, and validated the Logistic Regression JSON export.

**DEVICE VALIDATION PENDING.** No GPS, SMS, accelerometer, gyroscope, recording, persistence, or runtime behavior was physically verified in this audit.
