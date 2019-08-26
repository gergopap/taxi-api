function notFoundError (message) {
    this.message = message;
}

function authError (message) {
    this.message = message;
}

function requestError (message){
    this.message = message;
}

module.exports = {
    notFoundError,
    authError,
    requestError
};

