# Testing

Run from `mobile/`: `npm run typecheck`, `npm test -- --runInBand`, `npm run lint`, and `npm run build:android`.

Jest checks navigation, storage round trips, validation, conservative defaults, phone validation, and emergency message generation. Native MMKV and Android services are not proof of device persistence or GPS/SMS behavior.

## Android acceptance (requires a device or configured emulator)

1. Start Metro with `npm start`, then install/run with `npm run android` using the configured Java and Android SDK.
2. Verify Home launches without a red error screen, and protection is inactive.
3. Open each of the seven destinations and return using Android Back. Check scrolling and text readability.
4. Confirm SOS only shows a preview, with no permissions, location lookup, or messaging.
5. In the React Native debugger, use a temporary development-only harness importing `localStorage` to write synthetic profile/contact/settings/history values and read them back. Force-stop and reopen, verify they persist, then restore the previous values. Never use real personal data.
6. Inspect Metro and `adb logcat` for critical JS/native errors. Record device/API, results, and failures here.

Only safe simulated activities are permitted for future sensor testing. M1 collects no sensors and performs no emergency actions.

## Latest results — 2026-09-16

- TypeScript and ESLint passed.
- Jest: 8 tests passed in 2 suites, including all Home routes and Back navigation.
- Android debug build rerun: successful (226 tasks; 3m 25s). TypeScript, ESLint, and all 8 Jest tests also passed again during this runtime-acceptance attempt.
- Android production-mode JavaScript bundling: passed. Upstream React Native internal-export fallback warning remains.
- Device acceptance rechecked at 19:00 PKT: `SafeHer_M1_API29` and its API 29 x86_64 system image are installed. The emulator started at 12:43 with `-accel off -gpu software -no-window -no-snapshot` but remains offline after over six hours and an ADB offline reconnect. `emulator -accel-check` reports virtualization extensions unavailable. No physical device is connected. App launch, native rendering/navigation, native MMKV persistence, and runtime console/logcat checks have not been verified.
- Required manual action: connect and authorize an Android device (API 26+) over ADB, or enable host/nested virtualization and provide a booted emulator. This blocks foundation runtime acceptance, not merely later hardware sensor checks; the requested sequential M1–M7 execution therefore stops at M1.

The Progress Ledger intentionally leaves M1 unchecked pending these device checks. No Milestone 2 functionality is included.
