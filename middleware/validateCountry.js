//const { lookup } = require("geoip-lite");

const validateCountry = (req, res, next) => {
  const ipAddress = req;
  res.send(ipAddress).toJSON();
  /* const ipLocation = lookup(ipAddress);

  if (!!ipLocation && ipLocation.country === "US") {
    res.status(403).send("Forbidden");
  } else {
    next();
  }*/
};

module.exports = { validateCountry };
