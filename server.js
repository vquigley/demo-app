const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

// GET /users — list all users
app.get('/users', (req, res) => {
  const users = db.prepare('SELECT id, name, email, timezone, daily_calorie_goal, daily_protein_goal FROM users').all();
  res.json(users);
});

// GET /users/:id — get a single user
app.get('/users/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// GET /users/:id/meals — get meals for a user
app.get('/users/:id/meals', (req, res) => {
  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const meals = db.prepare('SELECT * FROM meals WHERE user_id = ? ORDER BY logged_at DESC').all(req.params.id);
  res.json(meals);
});

// POST /users/:id/meals — log a meal
app.post('/users/:id/meals', (req, res) => {
  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { name, calories, protein_g, carbs_g, fat_g } = req.body;
  if (!name || calories == null) {
    return res.status(400).json({ error: 'name and calories are required' });
  }

  const result = db.prepare(`
    INSERT INTO meals (user_id, name, calories, protein_g, carbs_g, fat_g)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(req.params.id, name, calories, protein_g || 0, carbs_g || 0, fat_g || 0);

  const meal = db.prepare('SELECT * FROM meals WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(meal);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`NutriTrack API running on http://localhost:${PORT}`);
});
