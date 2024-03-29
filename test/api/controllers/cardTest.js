const request = require('supertest');
const app = require('../../../app');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const cardsdb = require("../helpers/models/cardsModel");
const userdb = require('../helpers/models/userModel');
const sessiondb = require('../helpers/models/sessionModel');

const sampleCards = {
  "userId": 1,
  "cards": [{
    "name": 'Card One',
    "number": '1114567891234567',
    "owner": 'User User',
    "expires": '09/19',
    "security": '156'
  }]
};

const sampleCard = {
  "name": 'Card Two',
  "number": '2224567891234567',
  "owner": 'User User',
  "expires": '09/19',
  "security": '156'
};

const sampleUser = {
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

const sampleSession = {
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
      sampleUser
    });
    await sessiondb.session.insertMany({
      sampleSession
    });
    await cardsdb.cards.insertMany({
      sampleCards
    });
    done();
  });

  afterEach(async function () {
    await userdb.user.deleteMany({});
    await sessiondb.session.deleteMany({});
    await cardsdb.cards.deleteMany({});
  });

  describe('POST /cards', function () {
    it('should save a debit or credit card', async function (done) {
      request(app)
        .post('/cards')
        .set('Accept', 'application/json')
        .set('sessionID', sampleSession.id)
        .send(sampleCard)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          const cards = await cardsdb.cards.find({});

          expect(res.body[1].number).to.equal(cards.cards[1].number);
          expect(res.body[1].name).to.equal(cards.cards[1].name);
          done();
        });
    });

    it('should return error 400 when the card is already saved', async function (done) {
      request(app)
        .post('/cards')
        .set('Accept', 'application/json')
        .set('sessionID', sampleSession.id)
        .send(sampleCards.cards[0])
        .expect('Content-Type', /json/)
        .expect(400)
        .end(async (err, res) => {
          expect(res.body.message).to.equal('This card is already saved!');
          done();
        });
    });

    it('should retun error 400 when cards number, cards security number, or cards expire date not valid', async function (done) {
      request(app)
        .post('/cards')
        .set('Accept', 'application/json')
        .set('sessionID', sampleSession.id)
        .send(
          {
            "name": 'Card Two',
            "number": 'A2l5678912345',
            "owner": 'User User',
            "expires": '03',
            "security": 'asdasd'
          })
        .expect('Content-Type', /json/)
        .expect(400)
        .end(async (err, res) => {
          expect(res.body.message).to.equal('Invalid card data!');
          done();
        });
    });
  });

  describe('GET /cards', function () {
    it('should list all of users saved cards', async function (done) {
      request(app)
        .get('/cards')
        .set('Accept', 'application/json')
        .set('sessionID', sampleSession.id)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          const cards = await cardsdb.cards.find({});

          expect(res.body).to.equal(cards.cards);
          done();
        });
    });
  });

  describe('PUT /cards', function () {
    it('should update one of users saved cards, ', async function (done) {
      request(app)
        .put('/cards')
        .query({ cardNumber: sampleCards.cards[0].number })
        .set('Accept', 'application/json')
        .set('sessionID', sampleSession.id)
        .send(sampleCard)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          const cards = await cardsdb.cards.find({});

          expect(res.body.number).to.equal(cards.cards[0].number);
          expect(res.body.name).to.equal(cards.cards[0].name);
          done();
        });
    });

    it('should return error 404 when the updateable card is not found', async function (done) {
      request(app)
        .put('/cards')
        .set('Accept', 'application/json')
        .set('sessionID', sampleSession.id)
        .set('cardNumber', sampleCards.cards[0].number)
        .send(sampleCards.cards[0])
        .expect('Content-Type', /json/)
        .expect(404)
        .end(async (err, res) => {
          expect(res.body.message).to.equal('Card not found');
          done();
        });
    });

    it('should retun error 400 when cards number, cards security number, or cards expire date not valid', async function (done) {
      request(app)
        .put('/cards')
        .set('Accept', 'application/json')
        .set('sessionID', sampleSession.id)
        .set('cardNumber', sampleCards.cards[0].number)
        .send(
          {
            "name": 'Card Two',
            "number": 'A2l5678912345',
            "owner": 'User User',
            "expires": '03',
            "security": 'asdasd'
          })
        .expect('Content-Type', /json/)
        .expect(400)
        .end(async (err, res) => {
          expect(res.body.message).to.equal('Invalid card data!');
          done();
        });
    });
  });

  describe('DELETE /cards', function () {
    it('should update one of users saved cards, ', async function (done) {
      request(app)
        .delete('/cards')
        .set('Accept', 'application/json')
        .set('sessionID', sampleSession.id)
        .send(sampleCards.cards[0].number)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          const cards = await cardsdb.cards.find({});

          expect(res.body.number).to.equal(cards.cards[0].number);
          expect(res.body.name).to.equal(cards.cards[0].name);
          done();
        });
    });

    it('should return error 404 when the updateable card is not found', async function (done) {
      request(app)
        .delete('/cards')
        .set('Accept', 'application/json')
        .set('sessionID', sampleSession.id)
        .send(sampleCards.cards[0].number)
        .expect('Content-Type', /json/)
        .expect(404)
        .end(async (err, res) => {
          expect(res.body.message).to.equal('Card not found');
          done();
        });
    });
  });


});
