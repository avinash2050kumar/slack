const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { PORT, MONGO_URI } = process.env;

const app = express();
app.use(express.json());
app.use(cors());

// Create a generic mongoose schema for track events (flexible)
const trackEventSchema = new mongoose.Schema(
  {
    event: String,
    properties: Object,
    insertedAt: { type: Date, default: Date.now }
  },
  { strict: false } // allows dynamic fields
);

const TrackEvent = mongoose.model("trackEvents", trackEventSchema);

// Routes
app.get("/getBase64", (req, res) => {
  axios
    .get(req.query.url, { responseType: "arraybuffer" })
    .then(response => {
      const buffer = Buffer.from(response.data).toString("base64");
      res.status(200).send(buffer);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({ error: "Failed to fetch file" });
    });
});

app.get("/", (req, res) => {
  res.status(200).send(req.ip);
});

app.post("/", async (req, res) => {
  try {
    await axios.post(req.body.url, req.body);
    res.status(200).send({ message: "ok" });
  } catch (error) {
    res.status(500).send({ error: "Failed" });
  }
});

app.post("/track", async (req, res) => {
  try {
    const event = req.body;

    if (!event || !event.event) {
      return res.status(400).json({ error: "Invalid event payload" });
    }

    const result = await TrackEvent.create(event);

    res.status(200).json({
      message: "Track event stored",
      insertedId: result._id
    });
  } catch (err) {
    console.error("Track Event Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Connect DB → Then Start Server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
