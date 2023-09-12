const express = require("express");
const axios = require("axios");
const cors = require("cors");
//const geoip = require("geoip-lite");
const { validateCountry } = require("./middleware/validateCountry");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/getBase64", (req, res) => {
  axios
    .get(req.query.url, {
      responseType: "arraybuffer"
    })
    .then(response => {
      const buffer = Buffer.from(response.data, "binary").toString("base64");
      return res.send(buffer).status(200);
    })
    .catch(err => {
      return res.send(err).status(500);
    });
});

app.get(
  "/",
  validateCountry /*, (req, res) => {
  res
    .send(
      `${req.ip} - ${geoip.lookup(req.ip)} - ${JSON.stringify(
        geoip.lookup("2.58.241.67")
      )}`
    )
    .status(200);
}*/
);

app.listen(3012, () => {
  console.log("Server is running on port 3012");
});
