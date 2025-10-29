const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { PORT, MONGO_URI } = process.env;

if (!MONGO_URI) throw new Error("Missing MONGO_URI environment variable");

const app = express();
app.use(express.json({ limit: "5mb" })); // support large dynamic payloads
app.use(cors());

// ✅ Dynamic Schema for Events
const trackEventSchema = new mongoose.Schema(
  {
    _raw: { type: mongoose.Schema.Types.Mixed, required: true }, // Store full original payload ✅
    ip: String,
    userAgent: String
  },
  { strict: false, timestamps: true }
);

const TrackEvent = mongoose.model("TrackEvent", trackEventSchema);

// ✅ Convert URL to Base64
app.get("/getBase64", async (req, res) => {
  try {
    const response = await axios.get(req.query.url, {
      responseType: "arraybuffer"
    });
    const base64 = Buffer.from(response.data, "binary").toString("base64");
    res.status(200).send(base64);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error converting to Base64");
  }
});

// ✅ Get client IP
app.get("/", (req, res) => res.status(200).send(req.ip));

// ✅ Proxy POST
app.post("/", async (req, res) => {
  try {
    await axios.post(req.body.url, req.body);
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "request failed" });
  }
});

// ✅ Segment-style Tracking + Dynamic Payload Support
app.post("/track", async (req, res) => {
  try {
    const eventData = {
      _raw: req.body,
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || null,
      userAgent: req.headers["user-agent"] || null
    };

    const event = await TrackEvent.create(eventData);

    return res.status(200).json({
      message: "Track event stored successfully",
      insertedId: event._id
    });
  } catch (err) {
    console.error("Track Event Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ✅ Connect & Start Server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT || 3000, () =>
      console.log(`✅ Server running on port ${PORT || 3000}`)
    );
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
