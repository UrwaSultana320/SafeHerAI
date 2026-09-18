# Privacy

The app uses app-sandbox MMKV storage without application-level encryption. Android backup is disabled. There is no cloud sync or analytics. Contacts and emergency history remain local; location is requested only during a user-initiated or detected emergency and is inserted into a user-reviewed SMS draft.

- Location, recordings, and contacts stay on-device unless a later emergency flow explicitly sends a user-approved SMS.
- Do not hardcode personal contacts or API secrets.
- Request microphone, camera, and location only when a feature needs them.
- Recording (when added) must show a clear on-screen indicator.
- Audio recording requires an explicit start, shows a REC indicator, and saves to the private app directory only. The user explicitly stops it. Video is not implemented.
- No hidden surveillance, background listening, or always-on camera.
- This prototype is not a production safety guarantee.
- ML inference is offline. False-alarm feedback (class, confidence, model version, time, and window reference) remains in local app storage and does not contain audio or location.
