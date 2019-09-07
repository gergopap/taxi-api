const request = require('supertest');
const app = require('../../../app');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const userdb = require('../helpers/models/userModel');
const sessiondb = require('../helpers/models/sessionModel');

const sampleUser = {
  "username": "user1",
  "firstname": "Sample",
  "lastname": "User",
  "email": "user@gmail.com",
  "password": "secret",
  "phone": "+36703330000",
  "home": {
    "postal": 6720,
    "city": "Szeged",
    "street": "Kossuth Lajos sgt",
    "number": "67/b"
  }
};

const sampleCredentials = {
  "username": "user1",
  "password": "secret"
};

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
    done();
  });

  afterEach(async function () {
    await userdb.user.deleteMany({});
    await sessiondb.session.deleteMany({});
  });

  describe('POST /signup', function () {
    it('should create a new user', async function (done) {
      request(app)
        .post('/signup')
        .set('Accept', 'application/json')
        .send(sampleUser)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(async (err, res) => {
          const users = await userdb.user.find({});

          expect(res.body.username).to.equal(users[1].user.username);
          expect(res.body.email).to.equal(users[1].user.email);
          done();
        });
    });

    it('should return error 400 when the user is already saved', async function (done) {
      request(app)
        .post('/signup')
        .set('Accept', 'application/json')
        .send(defaultUser.user)
        .expect('Content-Type', /json/)
        .expect(400)
        .end(async (err, res) => {
          expect(res.body.message).to.equal('User already exists!');
          done();
        });
    });
  });

  describe('POST /login', function () {
    it('should log in and get a sessionId for the user', async function (done) {
      request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send(sampleCredentials)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          const session = await sessiondb.session.find({ 'userId': '2' });

          expect(res.body).to.equal(session.id);
          done();
        });
    });

    it('should return error 401 when the credential data is not valid', async function (done) {
      request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send({
          "username": "uuuuu",
          "password": "ppppp"
        })
        .expect('Content-Type', /json/)
        .expect(401)
        .end(async (err, res) => {
          expect(res.body.message).to.equal('Invalid username or password!');
          done();
        });
    });
  });

  describe('GET /logout', function () {
    it('should delete all sessions for the current user, ', async function (done) {
      request(app)
        .get('/logout')
        .set('Accept', 'application/json')
        .set('sessionID', sampleSession.id)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          const session = await sessiondb.session.find({});

          expect(session).to.equal([]);
          done();
        });
    });

    it('should return error 401 when sessionId is not valid', async function (done) {
      request(app)
        .get('/logout')
        .set('Accept', 'application/json')
        .set('sessionID', 'xxxxxx')
        .expect('Content-Type', /json/)
        .expect(401)
        .end(async (err, res) => {
          expect(res.body.message).to.equal('Session ID missing or not registered');
          done();
        });
    });
  });
});
