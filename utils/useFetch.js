const axios = require("axios");

const useFetch = (link) => {
  return new Promise((resolve, reject) => {
    axios.get(link)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = useFetch;
