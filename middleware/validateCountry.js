const axios = require("axios");

const fetchIpLocation = async ipAddress => {
  try {
    const response = await axios.get(
      `http://ip-api.com/json/${ipAddress}?fields=status,countryCode,proxy`
    );

    return response.data;
  } catch (e) {
    res.send("Something went wrong").status(401);
  }
};

const validateCountry = (req, res, next) => {
  // change based on server type
  const ipAddress = req.headers["x-forwarded-for"]; //|| req.connection.remoteAddress; req.ip ||

  fetchIpLocation(ipAddress)
    .then(ipLocation => {
      if (
        ipLocation.status === "fail" ||
        ipLocation.countryCode === "US" ||
        ipLocation.proxy
      ) {
        res.send("Unauthorized").status(401);
      }
      res.send(ipLocation).status(200);
      next();
    })
    .catch(err => {
      res.send("Something went wrong").status(401);
    });
};

module.exports = { validateCountry };
