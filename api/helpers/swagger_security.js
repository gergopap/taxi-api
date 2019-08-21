const session = require('../../models/session.js');

module.exports = {
  swaggerSecurityHandlers: {
    sessionId: async function (req, authOrSecDef, scopesOrApiKey, callback) {
      let currentSession = await session.session.findOne({"id": Number(scopesOrApiKey)});
      if (currentSession && scopesOrApiKey) {
        callback();
      } else {
        callback(new Error('Session ID missing or not registered'));
      }
    }
  }
};
