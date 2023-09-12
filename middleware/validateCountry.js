//const { lookup } = require("geoip-lite");

const validateCountry = (req, res, next) => {
  const ipAddress = req;
  console.log(ipAddress);
  res.json(ipAddress);
  /* const ipLocation = lookup(ipAddress);

  if (!!ipLocation && ipLocation.country === "US") {
    res.status(403).send("Forbidden");
  } else {
    next();
  }*/
};

module.exports = { validateCountry };
