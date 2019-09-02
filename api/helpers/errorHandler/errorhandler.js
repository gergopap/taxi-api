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


/* const requestError = (message) => {
  this.message = message;
};

const notFoundError = (message) => {
  this.message = message;
}

const authError = (message) => {
  this.message = message;
};


const errorFunction = (err, res) => {
  if (err instanceof notFoundError) {
    return handleBadRequest(err, res);

  }
  if (err instanceof requestError) {
    return handleBadRequest(err, res);

  }
  if (err instanceof authError) {
    return handleBadRequest(err, res);

  }
  return handleBadRequest(err, res);

};

function handleOtherErrors(err, res) {
  res.status(500).send(err);
}

function handleBadRequest(err, res) {
  res.status(400).send(err);
}

function handlenotFoundError(err, res) {
  res.status(404).send(err);
}

function handleauthError(err, res) {
  res.status(401).send(err);
}


module.exports = {
  errorFunction,
  requestError,
  notFoundError,
  authError
};
 */