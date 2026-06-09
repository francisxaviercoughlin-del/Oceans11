# Ocean's 11 Development Rules

## Technology Stack

* React Native
* Expo
* TypeScript
* SQLite

## Product Rules

* Golf game scoring application
* Based on Ocean's 11 format
* St. Louis Country Club visual design language
* No tee selection in V1
* Users adjust handicaps themselves
* Par values limited to 3-5
* Stroke indexes must be unique 1-18

## Development Standards

* TypeScript only
* Production-quality code
* Reusable components
* Repository pattern for database access
* Explain files before modifying them
* Keep screens mobile-first

## Current Status

* Home Screen complete
* Courses Screen complete
* Create Course Screen complete
* Navigation complete

## Next Milestone

* SQLite persistence
* Course storage
* Course editing
* Round setup
* Ocean's 11 scoring engine
# Expo HAS CHANGED

## V1 Scope

Ocean's 11 V1 ends at the Results Screen.

Final V1 Flow:

Home
→ Courses
→ Create/Edit Course
→ New Round
→ Player Entry
→ Handicap Entry
→ Score Round
→ Results

Out of Scope for V1:

- Round History
- Historical round browsing
- Round archives
- PDF export
- Sharing results
- Email results
- Cloud sync
- User accounts
- Statistics and analytics
- Tee management

Primary Goal:

Allow golfers to:
1. Set up a game
2. Score a game
3. View results

Do not implement features outside this scope unless explicitly approved.
