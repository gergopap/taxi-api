const session = require('./models/sessionModel'); 

module.exports = {
  swaggerSecurityHandlers: {
    sessionId: async function (req, authOrSecDef, scopesOrApiKey, callback) {
      const currentSession = await session.session.findOne({"id": Number(scopesOrApiKey)});
      if (currentSession && scopesOrApiKey) {
        req.app.locals.userId = currentSession.userId;
        console.log(req.app.locals.userId);
        callback();
      } else {
        callback(new Error('Session ID missing or not registered'));
      }
    }
  }
};
