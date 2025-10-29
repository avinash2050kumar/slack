const express = require("express");
const axios = require("axios");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const { PORT } = process.env;

const app = express();
app.use(express.json());
app.use(cors());

let db;
async function connectToDB() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log("✅ MongoDB Atlas connected");
    db = client.db("segmentEventsDB"); // choose database name
  } catch (err) {
    console.error("❌ MongoDB Connection Failed", err);
    process.exit(1);
  }
}
connectToDB();

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

app.post("/track", async (req, res) => {
  try {
    const event = req.body;

    if (!event || !event.event) {
      return res.status(400).json({ error: "Invalid event payload" });
    }

    const collection = db.collection("trackEvents");
    const result = await collection.insertOne({
      ...event,
      insertedAt: new Date()
    });

    return res.status(200).json({
      message: "Track event stored",
      insertedId: result.insertedId
    });
  } catch (err) {
    console.error("Track Event Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
