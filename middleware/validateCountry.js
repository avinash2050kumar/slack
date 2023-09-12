//const { lookup } = require("geoip-lite");

const validateCountry = (req, res, next) => {
  const ipAddress = req.connection.remoteAddress || req.ip;
  res.send("Hello" + ipAddress);
  /* const ipLocation = lookup(ipAddress);

  if (!!ipLocation && ipLocation.country === "US") {
    res.status(403).send("Forbidden");
  } else {
    next();
  }*/
};

module.exports = { validateCountry };
