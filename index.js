const express = require("express");
const axios = require("axios");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const { PORT, MONGO_URI } = process.env;

if (!MONGO_URI) {
  throw new Error("Missing MONGODB_URI environment variable");
}

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Global Mongo Client for Serverless
let cachedClient = null;
async function connectDB() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

// ✅ Convert URL to Base64
app.get("/getBase64", (req, res) => {
  axios
    .get(req.query.url, { responseType: "arraybuffer" })
    .then(response => {
      const buffer = Buffer.from(response.data, "binary").toString("base64");
      return res.status(200).send(buffer);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send("Error converting to Base64");
    });
});

// ✅ Return Client IP
app.get("/", (req, res) => {
  res.status(200).send(req.ip);
});

// ✅ Proxy POST request
app.post("/", async (req, res) => {
  try {
    await axios.post(req.body.url, req.body);
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "request failed" });
  }
});

// ✅ Store event in MongoDB Atlas
app.post("/track", async (req, res) => {
  try {
    const client = await connectDB(MONGO_URI);
    const db = client.db("analytics");

    const event = {
      ...req.body,
      insertedAt: new Date()
    };

    const result = await db.collection("trackEvents").insertOne(event);

    return res.status(200).json({
      message: "Track event stored",
      insertedId: result.insertedId
    });
  } catch (err) {
    console.error("Track Event Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT || 3000, () => {
  console.log(`Server running on port ${PORT}`);
});
