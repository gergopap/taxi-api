const { notFoundError, authError, requestError, serverError } = require('./errors');

module.exports = function (err, res) {
  if (err instanceof notFoundError) {
    return handleNotFoundErr(err, res);
  }
  if (err instanceof authError) {
    console.log(3434)
    return handleAuthErr(err, res);
  }
  if (err instanceof requestError) {
    return handleReqErr(err, res);
  }
  if (err instanceof serverError) {
    return handleOtherErr(err, res);
  }
  return handleOtherErr(err, res);
};


function handleOtherErr(err, res) {
  return res.status(500).send(err);
}

function handleReqErr(err, res) {
  return res.status(400).send(err);
}

function handleNotFoundErr(err, res) {
  return res.status(404).send(err);
}

function handleAuthErr(err, res) {
  console.log(1)
  return res.status(401).send(err);
}
