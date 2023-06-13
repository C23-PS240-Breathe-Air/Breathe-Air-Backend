// app/controllers/userController.js

const User = require('../models/userModel');

// Fungsi untuk menampilkan semua pengguna
exports.getAllUsers = (req, res) => {
  User.getAll((users) => {
    res.send({ users });
  });
};

exports.getUserCustom = (req, res) => {
  const email = req.query.email;
  const id = req.query.id;

  if (email){
    User.getByEmail(email, (user) => {
      res.send(user);
    });
  }

  if(id){
    User.getById(id, (user) => {
      res.send(user);
    });
  }
};

// Fungsi untuk membuat pengguna baru
exports.update = (req, res) => {
  const { name, email } = req.body;
  const newUser = {
    name,
    email,
  };
  User.create(newUser, (insertId) => {
    res.redirect('/users');
  });
}; 
