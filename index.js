const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const { PORT, MONGO_URI } = process.env;

if (!MONGO_URI) throw new Error("Missing MONGO_URI environment variable");

const app = express();
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(cors());

const trackEventSchema = new mongoose.Schema(
  {
    ip: String,
    userAgent: String,
  },
  { strict: false, timestamps: true },
);

const TrackEvent = mongoose.model("TrackEvent", trackEventSchema);

app.get("/", (req, res) => res.status(200).send(req.ip));

app.post("/", async (req, res) => {
  try {
    await axios.post(req.body.url, req.body);
    res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(500).json({ error: "request failed" });
  }
});

app.get("/api/ip", async (req, res) => {
  const forwardedIp = req.headers["x-forwarded-for"]?.toString().split(",")[0];
  const socketIp = req.socket.remoteAddress;
  const ip = (forwardedIp || socketIp || "").replace(/^::ffff:/, "").trim();

  if (!ip) {
    return res.status(400).json({ error: "location not found" });
  }

  try {
    const response = await axios.get(
      `https://free.freeipapi.com/api/json/${ip}`,
    );
    const data = response.data;

    // Format address
    const formattedAddress = [
      data.cityName,
      data.regionName,
      data.countryName,
      data.zipCode,
    ]
      .filter(Boolean)
      .join(", ");

    // Final response
    return res.status(200).json({
      countryName: data.countryName,
      countryCode: data.countryCode,
      capital: data.capital,
      cityName: data.cityName,
      regionName: data.regionName,
      isProxy: data.isProxy,
      formattedAddress,
    });
  } catch (error) {
    return res.status(500).json({ error: "failed to fetch location details" });
  }
});

app.post("/track", async (req, res) => {
  try {
    const event = await TrackEvent.create({ ...req.body });

    return res.status(200).json({
      message: "Track event stored successfully",
      insertedId: event._id,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT || 3000, () =>
      console.log(`Server running on port ${PORT || 3000}`),
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
