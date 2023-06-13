const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const usePost = require("../../utils/usePost");
const useFetch = require("../../utils/useFetch");
const executeQuery = require("../../utils/executeQuery");
const axios = require("axios");


/* http://localhost:5000/api/data/?kota=Jakarta */
router.get("/data/", async (req, res) => {
  const lat = req.query.lat;
  const long = req.query.long;

  if (!lat && !long) {
    res
      .status(500)
      .json({ message: "Harus ada parameter kota atau lat dan long" });
  }
  if (lat && !long) {
    res.status(500).json({ message: "Harus ada parameter long" });
  }
  if (!lat && long) {
    res.status(500).json({ message: "Harus ada parameter lat" });
  }
  if (lat && long) {
    try {
      const data = await useFetch(
        `https://api.waqi.info/feed/geo:${lat};${long}/?token=4adcc248a7022f88dbec334f431ef971c3d2d5ea`
      );

      try {
        const real_lat = data.data.city.geo[0];
        const real_long = data.data.city.geo[1];
        const date = data.data.time.s;
        const url = data.data.city.url;
        const pm25 = data.data.iaqi.pm25.v;
        const dew = data.data.iaqi.dew.v;
        const t = data.data.iaqi.t.v;
        const p = data.data.iaqi.p.v;
        const w = data.data.iaqi.w.v;

        const data_harian_desc = {
          real_lat,
          real_long,
          date,
          url,
        };

        const data_harian_airpolution = {
          pm25,
          dew,
          t,
          p,
          w,
        };

        await executeQuery(
          `SELECT pm25, dew, t, p, w FROM data_polution WHERE lat='${real_lat}' AND datetime >= DATE_SUB(CURDATE(), INTERVAL 2 DAY) ORDER BY datetime DESC LIMIT 3`
        )
          .then((results) => {
            let input_data;
            if (results.length < 3) {
              const sendToDb = executeQuery(
                `INSERT INTO data_polution VALUES (null, ${real_lat}, ${real_long}, '${date}', '${url}', '${pm25}', '${dew}', '${t}', '${p}', '${w}')`
              );
              input_data = [
                [pm25, dew, t, p, w],
                [pm25 + 5, dew + 1, t + 1, p + 1, w + 1],
                [pm25 + 10, dew + 2, t + 2, p + 2, w + 1.5],
              ];
            }
            if (results.length >= 3) {
              executeQuery(
                `SELECT * FROM data_polution WHERE lat='${real_lat}' AND datetime='${date}'`
              ).then((results) => {
                if (results.length === 0) {
                  const sendToDb = executeQuery(
                    `INSERT INTO data_polution VALUES (null, ${real_lat}, ${real_long}, '${date}', '${url}', '${pm25}', '${dew}', '${t}', '${p}', '${w}')`
                  );
                }
              });
              input_data = [
                [
                  results[0].pm25,
                  results[0].dew,
                  results[0].t,
                  results[0].p,
                  results[0].w,
                ],
                [
                  results[1].pm25,
                  results[1].dew,
                  results[1].t,
                  results[1].p,
                  results[1].w,
                ],
                [
                  results[2].pm25,
                  results[2].dew,
                  results[2].t,
                  results[2].p,
                  results[2].w,
                ],
              ];
            }

            let dataPost = {
              data: input_data,
            };

            axios
              .post("https://model-apis-dl6yh3mkfa-et.a.run.app/predict", dataPost)
              .then((response) => {
                // Tanggapan dari API
                const responseData = response.data;
                const predicted_pm25 = responseData.data[0][0];
                const rounded = Math.round(predicted_pm25);
                res.status(200).send({
                  status: "Succes",
                  data: {
                    desc: data_harian_desc,
                    airpolution: data_harian_airpolution,
                    predicted: responseData.data,
                  },
                  input_data: input_data,
                });
              })
              .catch((error) => {
                // Penanganan kesalahan jika permintaan gagal
                console.error("Error:", error);
                res.status(500).send("Internal Server Error");
              });
          })
          .catch((error) => {
            // Penanganan kesalahan saat mengambil data dari database
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
          });
      } catch (error) {
        res.status(500).json({ error_message: error });
      }
    } catch (error) {
      res.status(500).json({ error_message: error });
    }
  }
});

module.exports = router;
