const express = require("express");
const router = express.Router();

const useFetch = require("../../utils/useFetch");
const verifyToken = require("../../auth/verifyToken");

const dataAirPolutionForecast = require("../../data/dataAirPolutionForecast");

/* http://localhost:5000/api/data/?kota=Jakarta */
router.get("/data",  async (req, res) => {
  const lat = req.query.lat;
  const long = req.query.long;

  if (!lat && !long) {
    res.status(500).json({ message: "Harus ada parameter  lat dan long" });
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
        `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${long}&appid=b70cd62dacbb47484da2f672344a527e`
      );
      const componentsOnly = data.list.map((item) => item.components);
      res.json(componentsOnly);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

module.exports = router;
