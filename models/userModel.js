const db = require("../config/db")
const executeQuery = require("../utils/executeQuery")

// Fungsi untuk menampilkan semua pengguna
exports.getAll = (callback) => {
  executeQuery('SELECT * FROM users').then((result) => {
    callback(result)
  }).catch((error) => {
    throw error
  })
};

// Fungsi untuk menampilkan detail pengguna berdasarkan ID
exports.getById = (id, callback) => {
  executeQuery(`SELECT * FROM users WHERE id = '${id}'`).then((result) => {
    callback(result[0])
  }).catch((error) => {
    throw error
  })
};

// Fungsi untuk menampilkan detail pengguna berdasarkan Email
exports.getByEmail = (email, callback) => {
  executeQuery(`SELECT * FROM users WHERE email = '${email}'`).then((result) => {
    callback(result[0])
  }).catch((error) => {
    throw error
  })
};

// Fungsi untuk membuat pengguna baru
exports.update = (user, callback) => {
  const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.query(query, [user.name, user.email], (error, results) => {
    if (error) {
      throw error;
    }
    callback(results.insertId);
  });
};