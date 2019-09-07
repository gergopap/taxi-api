const request = require('supertest');
const app = require('../../../app');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const userdb = require('../helpers/models/userModel');
const sessiondb = require('../helpers/models/sessionModel');
const companydb = require('../helpers/models/companyModel');
const orderdb = require('../helpers/models/orderModel');

const samplePosition = {
  "home": "false",
  "address": {
    "postal": 6720,
    "city": "Szeged",
    "street": "Kossuth Lajos sgt",
    "number": "67/b"
  }
};

const sampleChosenCompany = {
  "favorite": "false",
  "companyName": "Szeged taxi"
};

const sampleCompany = {
  name: 'Szeged taxi',
  city: 'Szeged'
}

const defaultUser = {
  "user": {
    "id": 1,
    "username": 'User',
    "password": '123456',
    "email": 'email@email.com',
    "firstname": 'First',
    "lastname": 'Last',
    "phone": '+36001115555',
    "home": {
      "postal": 6720,
      "city": 'Szeged',
      "street": 'Street',
      "number": '11/b'
    }
  }
};

sampleSession = {
  "id": '111111',
  "userId": 1
};

describe('cards coontroller test', function () {
  this.timeout(3000);

  before(function (done) {
    mongoose.connect('mongodb://localhost/taxitestdb', { useNewUrlParser: true });
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () { done() });
  });

  beforeEach(async function (done) {
    await userdb.user.insertMany({
      defaultUser
    });
    await sessiondb.session.insertMany({
      sampleSession
    });
    await companydb.taxicompany.insertMany({
      sampleCompany
    });
    done();
  });

  afterEach(async function () {
    await userdb.user.deleteMany({});
    await sessiondb.session.deleteMany({});
    await companydb.taxicompany.deleteMany({});
  });

  describe('PUT /taxi/position', function () {
    it('should update users current position', async function (done) {
      request(app)
        .put('/taxi/position')
        .set('Accept', 'application/json')
        .set('sessionID', sampleSession.id)
        .send(samplePosition)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          const user = await userdb.user.findOne({ 'user.id': '1' });
          const companys = await companydb.taxicompany.find({ "city": samplePosition.address.city });

          expect(user.currentLocation).to.equal(samplePosition.address);
          expect(res.body).to.equal(companys);
          done();
        });
    });

    it('should return error 400 when the user is at a location, where are not avaliable any of the companys', async function (done) {
      request(app)
        .put('/taxi/position')
        .set('Accept', 'application/json')
        .set('sessionID', sampleSession.id)
        .send({
          "home": "false",
          "address": {
            "postal": 96642,
            "city": "Kisules",
            "street": "Kossuth Lajos u",
            "number": "3"
          }
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .end(async (err, res) => {
          expect(res.body.message).to.equal("Sorry, there are not any taxis at your position!");
          done();
        });
    });
  });

  describe('POST /taxi/order', function () {
    it('should save the order with users curent location, current time and users chosen company', async function (done) {
      request(app)
        .post('/taxi/order')
        .set('Accept', 'application/json')
        .set('sessionID', sampleSession.id)
        .send(sampleChosenCompany)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          const user = await userdb.user.findOne({ 'user.id': '1' });
          const order = await orderdb.order.findOne({ 'order.userId': '1' });

          expect(res.body.address).to.equal(user.user.currentLocation);
          expect(res.body.company).to.equal(order.company);
          expect(res.body.userId).to.equal(order.userId);
          done();
        });
    });

    it('should return error 400 when users chosen company is not avaliable at users location', async function (done) {
      request(app)
        .post('/taxi/order')
        .set('Accept', 'application/json')
        .set('sessionID', sampleSession.id)
        .send({
          "favorite": "false",
          "companyName": "Kaufman Cabs"
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .end(async (err, res) => {
          expect(res.body.message).to.equal('Please choose a company from the avaliable companys!');
          done();
        });
    });
  });

  describe('GET /taxi/history', function () {
    it('should list current users all orders', async function (done) {
      request(app)
        .get('/taxi/history')
        .set('Accept', 'application/json')
        .set('sessionID', sampleSession.id)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          const history = await orderdb.order.find({ "order.userId": "1" });

          expect(res.body).to.equal(history);
          done();
        });
    });
  });

  describe('PUT /taxi/favorite', function () {
    it('should update users favorite company ', async function (done) {
      request(app)
        .put('/taxi/favorite')
        .set('Accept', 'application/json')
        .set('sessionID', sampleSession.id)
        .send(sampleCompany.name)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          const user = await userdb.user.findOne({ "user.id": "1" });

          expect(res.body).to.equal(user.user.favoreiteCompany);
          done();
        });
    });


    it('should return error 400, when user wants to add a company as a favorite, which is not avaliable', async function (done) {
      request(app)
        .put('/taxi/favorite')
        .set('Accept', 'application/json')
        .set('sessionID', sampleSession.id)
        .send("Checker Cab")
        .expect('Content-Type', /json/)
        .expect(400)
        .end(async (err, res) => {
          expect(res.body.message).to.equal('This company is not our partner');
          done();
        });
    });
  });
});
