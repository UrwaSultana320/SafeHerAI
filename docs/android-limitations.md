# Android limitations

Documented constraints for this prototype (to be expanded as features are implemented):

- **Repeated power-button SOS** is not reliable for third-party apps. Android system Emergency SOS owns that gesture. This project will not fake it.
- **Silent SMS (`SmsManager`)** is deferred. Milestone 2+ will prioritize the standard SMS composer/intent. Android 15+ may hard-restrict SMS permissions for sideloaded APKs.
- **Inbound SMS / inbox read** is out of scope (Play policy and privacy).
- **Background location, foreground services, and always-on sensors** are not in Milestone 1. The app must work in the foreground first.
- **Fake call** (later) is a local decoy UI, not a real incoming cellular call.
