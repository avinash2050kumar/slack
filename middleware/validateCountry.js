const axios = require("axios");

const fetchIpLocation = async ipAddress => {
  try {
    const response = await axios.get(
      `http://ip-api.com/json/${ipAddress}?fields=status,countryCode,proxy`
    );

    return response.data;
  } catch (e) {
    throw new Error("Something went wrong");
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
        throw new Error("Unauthorized");
      }
      next();
    })
    .catch(err => {
      throw new Error("Something went wrong");
    });
};

module.exports = { validateCountry };
