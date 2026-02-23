const db = require('./db');

// Clear existing data
db.exec('DELETE FROM meals');
db.exec('DELETE FROM users');

// Insert users with different timezones and goals
const insertUser = db.prepare(`
  INSERT INTO users (name, email, timezone, daily_calorie_goal, daily_protein_goal)
  VALUES (?, ?, ?, ?, ?)
`);

const insertMeal = db.prepare(`
  INSERT INTO meals (user_id, name, calories, protein_g, carbs_g, fat_g, logged_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

// Users
const maria = insertUser.run('Maria Santos', 'maria@example.com', 'Europe/Lisbon', 1800, 65);
const james = insertUser.run('James Chen', 'james@example.com', 'America/New_York', 2200, 80);
const yuki = insertUser.run('Yuki Tanaka', 'yuki@example.com', 'Asia/Tokyo', 1600, 55);

// Today's date in UTC for seeding
const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

// Maria's meals — today (Lisbon time)
insertMeal.run(maria.lastInsertRowid, 'Oatmeal with berries', 350, 12, 58, 8, `${today}T08:30:00`);
insertMeal.run(maria.lastInsertRowid, 'Grilled chicken salad', 420, 35, 15, 22, `${today}T12:45:00`);
insertMeal.run(maria.lastInsertRowid, 'Protein shake', 180, 30, 8, 3, `${today}T16:00:00`);
insertMeal.run(maria.lastInsertRowid, 'Salmon with rice', 550, 38, 45, 18, `${today}T19:30:00`);

// Maria's meals — yesterday
insertMeal.run(maria.lastInsertRowid, 'Yogurt parfait', 280, 15, 35, 10, `${yesterday}T07:45:00`);
insertMeal.run(maria.lastInsertRowid, 'Turkey sandwich', 480, 28, 42, 18, `${yesterday}T13:00:00`);
insertMeal.run(maria.lastInsertRowid, 'Pasta with vegetables', 620, 18, 78, 22, `${yesterday}T20:00:00`);

// James's meals — today (New York time)
insertMeal.run(james.lastInsertRowid, 'Eggs and toast', 400, 22, 30, 20, `${today}T07:00:00`);
insertMeal.run(james.lastInsertRowid, 'Burrito bowl', 680, 42, 55, 28, `${today}T12:30:00`);
insertMeal.run(james.lastInsertRowid, 'Trail mix', 250, 8, 22, 16, `${today}T15:00:00`);

// Yuki's meals — today (Tokyo time)
insertMeal.run(yuki.lastInsertRowid, 'Miso soup and rice', 320, 12, 52, 6, `${today}T07:30:00`);
insertMeal.run(yuki.lastInsertRowid, 'Bento box', 550, 30, 60, 18, `${today}T12:00:00`);

console.log('Seeded database:');
console.log(`  ${db.prepare('SELECT COUNT(*) as count FROM users').get().count} users`);
console.log(`  ${db.prepare('SELECT COUNT(*) as count FROM meals').get().count} meals`);
console.log('Done.');
