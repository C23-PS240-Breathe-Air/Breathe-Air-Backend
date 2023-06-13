const { Storage } = require("@google-cloud/storage");
const path = require("path");

// inisialisasi client Google Cloud Storage
const keyfilePath = "auth";
const storage = new Storage({
  projectId: "astute-acolyte-381310",
  keyFilename: path.join(keyfilePath, "keyfile.json"),
});

module.exports = storage