# Android limitations

Documented constraints for this prototype:

- **Repeated power-button SOS** is not reliable for third-party apps. Android system Emergency SOS owns that gesture. This project will not fake it.
- **SMS** uses the standard composer. The user must review and tap Send; composer availability and multi-recipient behavior vary by installed SMS app. Silent `SmsManager` sending is not used.
- **Inbound SMS / inbox read** is out of scope (Play policy and privacy).
- **Location** is foreground-only. Permission denial, disabled providers, stale fixes, and timeouts are reported without crashing. Real accuracy requires a physical phone.
- **Fake call** is a local decoy UI with a simulated ringtone/call screen, not a real incoming cellular call.
- **Background operation** is not guaranteed. Android/OEM battery restrictions can stop foreground-screen monitoring when the app is backgrounded; no policy bypass is attempted.
- **Permissions** may be denied or permanently blocked. Location and microphone are requested just in time, and users may need Android Settings to unblock them.
- **Emulator vs phone**: emulator sensor, GPS, audio, vibration, SMS-app, and sharing behavior is not equivalent to physical hardware.
- **Alarm / DND**: Android Do Not Disturb, muted alarm streams, and OEM policies can reduce panic-alarm audibility. Vibration also depends on device settings.
- **Sensors**: shake monitoring is foreground-only in this prototype; OEM background limits are not bypassed.
- **Recording**: audio is explicit and local. Video recording is deferred because no compatible camera stack is configured; hidden recording is never used.
