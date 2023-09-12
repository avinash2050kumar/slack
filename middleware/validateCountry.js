const maxmind = require("maxmind-db-reader");
const lookup = maxmind.openSync("path/to/your/maxmind-db-file.mmdb");

/*const fetchIpLocation = async ipAddress => {
  try {
    const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
    const response2 = await axios.get(
      `https://ipinfo.io/widget/demo/${ipAddress}`
    );
    return response2.data;
  } catch (e) {
    console.log(e);
  }
};*/

const validateCountry = (req, res, next) => {
  const ipAddress = req.headers["x-forwarded-for"] || req.ip; //|| req.connection.remoteAddress || req.ip;

  const ip = "8.8.8.8";
  const result = lookup.get(ip);

  console.log(result);

  res.send(ip).status(200);

  /*fetchIpLocation(ipAddress)
    .then(ipLocation => {
      res.status(200).send(ipLocation);
    })
    .catch(err => {
      res.send(err).status(500);
    });*/
};

module.exports = { validateCountry };
