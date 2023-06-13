const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

const upload = require("../config/multerConfig");
const uploadToBucket = require("../utils/uploadToBucket");
const executeQuery = require("../utils/executeQuery")

router.post("/", upload.single("file"), async (req, res) => {
  const { email, password, nama, alamat, telepon } = req.body;
  const file = req.file;
  var imgProfile = "";

  if (file) {
    const publicUrlwithImage = await uploadToBucket(file);
    var imgProfile = publicUrlwithImage;
  } else {
    var imgProfile = `https://storage.googleapis.com/bangkit-capstone-bucket/default-profile-icon-24.jpg`; // default img profile
  }

  // Input to database
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, "capstone123");

    await executeQuery(
      `INSERT INTO users (id, email, password, nama, alamat, telepon, img_profile) VALUES (null, '${email}', '${hashedPassword}', '${nama}', '${alamat}', '${telepon}', '${imgProfile}')`
    ).catch(() => {
      return res.status(409).send({status: "Failed", message:"Email sudah terdaftar"})
    })

    const results = await executeQuery(
      `SELECT * FROM users WHERE email = '${email}'`
    );
    return res.status(200).json({
      message: "Berhasil",
      token,
      data: results[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error registering user!");
  }
});

module.exports = router;
