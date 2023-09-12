const axios = require("axios");

const fetchIpLocation = async ipAddress => {
  try {
    const response = await axios.get(
      `http://ip-api.com/json/${ipAddress}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,proxy,query`
    );

    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const validateCountry = (req, res, next) => {
  const ipAddress = req.headers["x-forwarded-for"] || req.ip; //|| req.connection.remoteAddress || req.ip;

  fetchIpLocation(ipAddress)
    .then(ipLocation => {
      res.status(200).send(ipLocation);
    })
    .catch(err => {
      res.send(err).status(500);
    });
};

module.exports = { validateCountry };
