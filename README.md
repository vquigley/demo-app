# NutriTrack

Simple nutrition tracking API. Built with Express and SQLite.

## Setup

```
npm install
npm run seed
npm start
```

## API

- `GET /users` — list all users
- `GET /users/:id` — get a user
- `GET /users/:id/meals` — get meals for a user
- `POST /users/:id/meals` — log a meal (`{ name, calories, protein_g, carbs_g, fat_g }`)

## Demo task

> Add a daily nutrition summary endpoint

This endpoint should return a user's total calories, protein, carbs, and fat
for a given day, along with their progress toward their daily goals.
