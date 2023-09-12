const { lookup } = require("geoip-lite");

const validateCountry = (req, res, next) => {
  const ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;

  const ipLocation = lookup(ipAddress);

  console.log(ipAddress, ipLocation);

  if (!!ipLocation && ipLocation.country && ipLocation.country === "US") {
    res.status(403).send("Forbidden");
  } else {
    //next();
    res.status(200).send(ipLocation.country || "Unknown");
  }
};

module.exports = { validateCountry };
