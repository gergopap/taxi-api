const errorHandler = require("../helpers/errorHandler/errorhandler");

function healthcheck(req, res) {
  try {
    const currentTime = new Date();
    res.status(200);
    res.json(currentTime);
  }
  catch (e) {
    errorHandler(e, res);
  }
}

module.exports = {
  healthcheck: healthcheck
};
