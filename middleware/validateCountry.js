//const { lookup } = require("geoip-lite");

const validateCountry = (req, res, next) => {
  const ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
  console.log(ipAddress);
  res.send(`${ipAddress}`);
  /* const ipLocation = lookup(ipAddress);

  if (!!ipLocation && ipLocation.country === "US") {
    res.status(403).send("Forbidden");
  } else {
    next();
  }*/
};

module.exports = { validateCountry };
