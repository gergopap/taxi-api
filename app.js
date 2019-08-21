'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
const mongoose = require('mongoose');

const config = {
  appRoot: __dirname,
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  swaggerExpress.register(app);

  app.use(swaggerExpress.runner.swaggerTools.swaggerUi());

  var port = process.env.PORT || 10010;
  app.listen(port);

  mongoose.connect('mongodb://localhost/taxi', { useNewUrlParser: true });

  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
  });
});

module.exports = app;
