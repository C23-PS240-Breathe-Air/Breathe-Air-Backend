const axios = require("axios");

const usePost = (link, data) => {
  return new Promise((resolve, reject) => {
    axios.post(link, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = usePost;
