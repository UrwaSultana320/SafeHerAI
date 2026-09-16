# SafeHer AI — Codex Repository Instructions

## Project
SafeHer AI — Intelligent Women Safety & Emergency Response System

Android-first React Native + TypeScript application with a Python/scikit-learn ML pipeline for sensor-based fall/emergency detection.

## Source of Truth
The detailed project specification is:

`SAFEHER_AI_MASTER_SPEC.md`

Before implementing a milestone:

1. Inspect the current repository and Git status.
2. Identify the requested milestone.
3. Read the relevant milestone section in `SAFEHER_AI_MASTER_SPEC.md`.
4. Read only the supporting architecture/docs needed for that task.
5. Inspect the existing implementation before editing.
6. Preserve completed working code unless a change is required.

Do not reread or restate the entire master specification unless necessary.

## Scope Rules
- Implement only the milestone requested by the user.
- Stop before beginning the next milestone.
- Do not silently change architecture, technology choices, model definitions, or scope.
- Prefer the smallest correct change.
- Do not rewrite working code unnecessarily.
- Do not duplicate existing functionality.
- Do not add dependencies unless they are actually required.
- Keep Android as the primary target.
- Keep emergency-critical functionality local/offline where practical.
- Do not add Firebase/cloud infrastructure unless explicitly requested.
- Do not implement hidden microphone/camera recording or other covert surveillance behavior.
- Do not claim prototype functionality is production/public-safety certified.

## Development Workflow
Before work:

```bash
git status
```

Then:
1. Inspect existing code.
2. Implement the requested milestone.
3. Run the milestone acceptance checks.
4. Fix project-level failures.
5. Update the Progress Ledger in `SAFEHER_AI_MASTER_SPEC.md`.
6. Update relevant documentation only when needed.
7. Review `git diff`.
8. Commit the completed milestone using the commit name defined in the master spec.
9. Stop.

If a genuine environment or platform blocker remains, report it instead of inventing a workaround or expanding scope.

## Validation
Run the checks relevant to the milestone.

Typical mobile checks:
- TypeScript type checking
- relevant unit/tests if present
- Android debug build when applicable
- verify no critical runtime/configuration errors

Typical ML checks:
- Python pipeline execution
- data validation
- session-aware train/test split
- evaluation metrics
- model export validation
- reproducibility where practical

Do not report a check as passing unless it actually ran successfully.

## Git Rules
Use Git checkpoints.

Never commit:
- secrets or API keys
- `.env` files containing secrets
- build outputs
- dependency caches
- large raw datasets
- private recordings
- private location data
- local machine configuration
- unnecessary model binaries

Small anonymized/sample data may be committed when useful for reproducibility.

Before committing:
- inspect `git status`
- inspect intended changes
- avoid staging unrelated files

## Documentation
Keep these documents aligned with the implementation when relevant:

- `README.md`
- `docs/architecture.md`
- `docs/android-limitations.md`
- `docs/privacy.md`
- `docs/ml-methodology.md`
- `docs/testing.md`
- `docs/demo-script.md`

Do not rewrite all documentation after every milestone. Update only what changed.

## AI/ML Rules
- The rule-based fall detector is a baseline, not ML.
- The ML work must include a real trained classifier.
- Primary comparison: rule baseline vs Logistic Regression vs Random Forest.
- Do not select a model using accuracy alone.
- Pay particular attention to fall recall and false-positive rate.
- Avoid row-level data leakage.
- Prefer participant-level split; otherwise use session-level split.
- Keep feature ordering identical between Python and mobile inference.
- Preserve the Python/TypeScript golden-vector parity test.
- Do not call a remote Python API during an emergency.
- Do not claim online/continuous learning unless retraining is actually implemented.

## Safety and Privacy
- Use only safe simulated fall testing.
- Never instruct a person to perform dangerous real falls.
- Location and recordings should remain local unless explicitly used in an emergency workflow.
- Recording must be visible and user-controlled.
- Handle denied permissions gracefully.
- Never fake a successful SMS/emergency action.
- Document Android/OEM limitations honestly.

## Milestones
- M0 — Environment and baseline
- M1 — Application foundation
- M2 — Emergency contacts + SOS + GPS + SMS
- M3 — Original safety tools
- M4 — Sensor data collection
- M5 — Machine learning pipeline
- M6 — On-device AI emergency workflow
- M7 — Testing, documentation and demo polish
- M8 — Optional stretch features

Detailed requirements and acceptance criteria are in `SAFEHER_AI_MASTER_SPEC.md`.

## Response Style
Be concise.

Do not narrate routine implementation steps or repeat project background.

At the end of a task, report only:

1. Completed work
2. Validation/build/test result
3. Material files/dependencies changed
4. Remaining blockers or manual actions
5. Git commit message/hash, if committed

## Short Task Pattern
When the user says something like:

`Implement Milestone 3.`

Interpret it as:

- follow this `AGENTS.md`
- read the relevant Milestone 3 section of `SAFEHER_AI_MASTER_SPEC.md`
- inspect the current repo
- implement only Milestone 3
- validate it
- update progress
- commit it
- stop before Milestone 4
