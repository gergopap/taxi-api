"use strict";

const userdb = require("../helpers/models/userModel");
const errorHandler = require("../helpers/errorHandler/errorhandler");
const { requestError, notFoundError } = require('../helpers/errorHandler/errors');

function getCards(req, res) {
  return getCardsAsync(req, res);
}

const getCardsAsync = async (req, res) => {
  try {
    const user = await userdb.user.findOne({
      "user.id": req.app.locals.userId
    });
    const cards = user.user.cards;
    if (!user) {
      throw new notFoundError("Users cards not found");
    }
    res.status(200).json(cards);
  } catch (e) {
    errorHandler(e, res);
  }
};

function saveCard(req, res) {
  return saveCardAsync(req, res);
}

const saveCardAsync = async (req, res) => {
  const card = req.swagger.params["cardData"].value;
  try {
    if (card.number.length != 16 || card.security.length != 3 || card.expires.length != 5) {
      throw new requestError("Invalid card data!");
    }
    const user = await userdb.user.findOne({
      "user.id": req.app.locals.userId
    });
    if (!user) {
      throw new notFoundError("Something went wrong");
    }
    if (user.user.cards === []) {
      user.user.cards = [card];
    } else {
      user.user.cards.push(card);
    }
    await userdb.user.updateMany({ "user.id": req.app.locals.userId }, { $set: { "user.cards": user.user.cards } });
    res.status(201);
    res.json({ card });
  } catch (e) {
    errorHandler(e, res);
  }
};

function deleteCard(req, res) {
  return deleteCardAsync(req, res);
}

const deleteCardAsync = async (req, res) => {
  const cardNumber = req.swagger.params["cardNumber"].value;
  try {
    const user = await userdb.user.findOne({
      "user.id": req.app.locals.userId
    });
    if (!user) {
      throw new notFoundError("Something went wrong");
    }
    let cards = user.user.cards;

    for (let i = 0; i < cards.length; i++) {
      if (cards[i].number == cardNumber) {
        cards.splice(i, 1);
      }
    }
    user.user.cards = cards;
    await userdb.user.updateMany({ "user.id": req.app.locals.userId }, { $set: { "user.cards": user.user.cards } });
    res.status(200);
    res.json(cards);
  } catch (e) {
    errorHandler(e, res);
  }
};

function updateCard(req, res) {
  return updateCardAsync(req, res);
}

const updateCardAsync = async (req, res) => {
  const cardNumber = req.swagger.params["cardNumber"].value;
  const newCard = req.swagger.params["newCardData"].value;
  try {
    if (newCard.number.length != 16 || newCard.security.length != 3 || newCard.expires.length != 5) {
      throw new requestError("Invalid card data!");
    }
    const user = await userdb.user.findOne({
      "user.id": req.app.locals.userId
    });
    if (!user) {
      throw new notFoundError("Something went wrong");
    }
    let cards = user.user.cards;

    for (let i = 0; i < cards.length; i++) {
      if (cards[i].number == cardNumber) {
        cards[i] = newCard;
      }
    }
    user.user.cards = cards;
    await userdb.user.updateMany({ "user.id": req.app.locals.userId }, { $set: { "user.cards": user.user.cards } });
    res.status(200);
    res.json(newCard);
  } catch (e) {
    errorHandler(e, res);
  }
};

module.exports = {
  getCards: getCards,
  saveCard: saveCard,
  deleteCard: deleteCard,
  updateCard: updateCard
};
