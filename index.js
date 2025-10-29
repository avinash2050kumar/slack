const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { PORT, MONGO_URI } = process.env;

if (!MONGO_URI) {
  throw new Error("Missing MONGO_URI environment variable");
}

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Mongoose Schema
const eventSchema = new mongoose.Schema(
  {
    eventName: String,
    data: Object
  },
  { timestamps: true } // Automatically adds createdAt + updatedAt
);

const TrackEvent = mongoose.model("TrackEvent", eventSchema);

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

// ✅ Get client IP
app.get("/", (req, res) => {
  return res.status(200).send(req.ip);
});

// ✅ Proxy POST request
app.post("/", async (req, res) => {
  try {
    await axios.post(req.body.url, req.body);
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "request failed" });
  }
});

// ✅ Store Tracking Event in MongoDB via Mongoose
app.post("/track", async (req, res) => {
  try {
    const event = await TrackEvent.create(req.body);

    return res.status(200).json({
      message: "Track event stored",
      insertedId: event._id
    });
  } catch (err) {
    console.error("Track Event Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ✅ Connect DB ➤ THEN Start Server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT || 3000, () => {
      console.log(`✅ Server running on port ${PORT || 3000}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
