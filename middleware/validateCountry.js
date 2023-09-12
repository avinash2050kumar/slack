const geoip = require("geoip-lite");

const validateCountry = (req, res, next) => {
  const ipLocation = geoip.lookup(req.ip);

  if (!!ipLocation && ipLocation.country !== "US") {
    next();
  } else {
    res.status(403).send("Forbidden");
  }
};
