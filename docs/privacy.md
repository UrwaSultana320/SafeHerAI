# Privacy

The app uses app-sandbox MMKV storage without application-level encryption. Android backup is disabled. There is no cloud sync or analytics. Contacts and emergency history remain local; location is requested only during a user-initiated or detected emergency and is inserted into a user-reviewed SMS draft.

- Location, recordings, and contacts stay on-device unless a later emergency flow explicitly sends a user-approved SMS.
- Do not hardcode personal contacts or API secrets.
- Request microphone, camera, and location only when a feature needs them.
- Recording (when added) must show a clear on-screen indicator.
- No hidden surveillance, background listening, or always-on camera.
- This prototype is not a production safety guarantee.
