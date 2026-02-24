# CLAUDE.md

## Project: NutriTrack API

A nutrition tracking REST API built with Express and SQLite (better-sqlite3).

## Architecture

- **Single-file API** in `src/index.js` — intentionally simple for demo purposes
- **SQLite** via better-sqlite3 — synchronous, no ORM, raw SQL
- **No auth layer** — user ID passed directly in requests

## Database Schema

Two tables:

**users** — has `timezone` (IANA format, e.g. 'Europe/Lisbon') and daily goals for calories, protein, carbs, fat. Every user has personalized goals — never hardcode defaults.

**meals** — linked to users via `user_id`. `logged_at` is stored as UTC datetime text. Always convert to the user's timezone when grouping by day.

## Key Conventions

- **Aggregate in SQL, not JS.** Use SQL SUM/GROUP BY for any aggregation. Never load all rows and reduce in JavaScript.
- **Timezone-aware date grouping.** Users are in different timezones. When grouping meals by "day," convert `logged_at` to the user's timezone first. SQLite doesn't have native TZ support — use the `datetime()` function with timezone offset or handle in a subquery.
- **Validate inputs.** Check required fields, verify referenced entities exist, return proper HTTP status codes.
- **User goals live on the user profile.** Always read them from the `users` table — never assume defaults.

## Common Patterns

```js
// Good: SQL aggregation with date filtering
db.prepare(`
  SELECT SUM(calories) as total_calories, ...
  FROM meals
  WHERE user_id = ? AND date(logged_at, ?) = date('now', ?)
`).get(userId, tzOffset, tzOffset);

// Bad: Loading all meals and filtering in JS
const meals = db.prepare('SELECT * FROM meals WHERE user_id = ?').all(userId);
const filtered = meals.filter(...); // Don't do this
```

## What's NOT in the codebase yet

- No date range queries
- No meal update/delete
