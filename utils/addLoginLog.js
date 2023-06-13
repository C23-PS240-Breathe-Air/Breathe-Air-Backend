const db = require("../config/db")

const addLoginLog = (id) => {

  const date = new Date();
  const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');

  return new Promise((resolve, reject) => {
    const query = `INSERT INTO login_log (id, login_time, login_status) VALUES ('${id}', '${formattedDate}', 'Success')`;
    db.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve("Succes");
      }
    });
  });
};

module.exports = addLoginLog