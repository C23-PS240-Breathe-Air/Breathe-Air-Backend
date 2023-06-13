const storage = require("../config/storage")

const uploadToBucket = (file) => {
  return new Promise((resolve, reject) => {
    const bucketName = 'bangkit-capstone-bucket'; // Tentukan nama bucket di dalam fungsi
    const newFileName = Date.now() + '-' + file.originalname.replace(/\s+/g, '');
    const myBucket = storage.bucket(bucketName);
    const blob = myBucket.file(newFileName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      console.error(err);
      reject('Terjadi kesalahan saat mengunggah gambar.');
    });

    blobStream.on('finish', () => {
      blob.makePublic().then(() => {
        const publicUrlwithImage = `https://storage.googleapis.com/${bucketName}/${newFileName}`;
        resolve(publicUrlwithImage);
      });
    });

    blobStream.end(file.buffer);
  });
};

module.exports = uploadToBucket;
