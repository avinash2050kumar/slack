const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const { PORT } = process.env;

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

app.get("/", (req, res) => {
  res.send(`${req.ip}`).status(200);
});

app.post("/", async (req, res) => {
  try {
    const response = await axios.post(req.body.url, req.body);

    res.status(200).send({
      message: "ok"
    });
  } catch (error) {
    //
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
