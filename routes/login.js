const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

const addLoginLog = require("../utils/addLoginLog");
const executeQuery = require("../utils/executeQuery");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  await executeQuery(`SELECT * FROM users WHERE email = '${email}'`).then((results) => {
    if (results.length === 0) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    // Bandingkan password yang diinputkan dengan password di database
    bcrypt.compare(password, results[0].password, (error, match) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Terjadi kesalahan saat login." });
      }

      if (!match) {
        return res.status(401).json({ message: "Email atau password salah." });
      }

      // Buat token JWT
      const token = jwt.sign(
        { id: results[0].id, email: results[0].email },
        "capstone123",
        { expiresIn: "24h" }
      );

      const data = results[0];

      addLoginLog(results[0].id)
        .then((loginLogResult) => {
          return res.status(200).json({ message: loginLogResult, token, data });
        })
        .catch((addLoginLogError) => {
          console.error(addLoginLogError);
          return res
            .status(500)
            .json({ message: "Terjadi kesalahan saat login." });
        });
    });
  });

  // Ambil user dari database berdasarkan email
});

module.exports = router;
