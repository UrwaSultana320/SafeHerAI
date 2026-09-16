# Foundation testing

Run from `mobile/`: `npm run typecheck`, `npm test -- --runInBand`, `npm run lint`, and `npm run build:android`.

Jest checks navigation, storage round trips, invalid/corrupt records, conservative defaults, and inactive services. Native MMKV is mocked: this is not proof of device persistence.

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
- Android debug build: successful (226 tasks; 4m 24s).
- Android production-mode JavaScript bundling: passed. Upstream React Native internal-export fallback warning remains.
- Device acceptance blocked: `adb devices` returned no devices; `emulator -list-avds` returned no AVDs. App launch, native rendering/navigation, native MMKV persistence, and runtime console/logcat checks have not been verified.

The Progress Ledger intentionally leaves M1 unchecked pending these device checks. No Milestone 2 functionality is included.
