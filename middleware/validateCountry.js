const axios = require("axios");

const fetchIpLocation = async ipAddress => {
  try {
    const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const validateCountry = (req, res, next) => {
  const ipAddress = req.headers["x-forwarded-for"]; //|| req.connection.remoteAddress || req.ip;

  fetchIpLocation(ipAddress)
    .then(ipLocation => {
      res.status(200).send(ipLocation);
    })
    .catch(err => {
      res.send(err).status(500);
    });
};

module.exports = { validateCountry };
