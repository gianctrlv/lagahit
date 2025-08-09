const db = require("../config/db");

async function createUserTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function emailExists(email) {
  const results = await db.query("SELECT id FROM users WHERE email = ?", [email]);
  return results.length > 0;
}

async function createUser(name, email, password) {
  await db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password]
  );
}

async function getUserByEmail(email) {
  const results = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return results.length > 0 ? results[0] : null;
}

module.exports = {
  createUserTable,
  emailExists,
  createUser,
  getUserByEmail,
};
