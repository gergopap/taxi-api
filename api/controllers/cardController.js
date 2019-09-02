"use strict";

const cardsdb = require("../helpers/models/cardsModel");
const errorHandler = require("../helpers/errorHandler/errorhandler");
const { requestError, serverError, notFoundError } = require('../helpers/errorHandler/errors');

function getCards(req, res) {
  return getCardsAsync(req, res);
}

const getCardsAsync = async (req, res) => {
  try {
    const cards = await cardsdb.cards.findOne({
      "userId": req.app.locals.userId
    });
    if (!cards) {
      throw new serverError("Users cards not found");
    }
    console.log(cards.cards)
    res.status(200).json(cards.cards);
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
    if (card.number.length != 16 || card.security.length != 3 || card.expires.length != 5 || !card.number.match(/^-{0,1}\d+$/) || !card.security.match(/^-{0,1}\d+$/)) {
      throw new requestError("Invalid card data!");
    }
    let cards = await cardsdb.cards.findOne({
      "userId": req.app.locals.userId
    });
    if (!cards) {
      cards = {
        userId: req.app.locals.userId,
        cards: [card]
      };
      await cardsdb.cards.insertMany(cards);
    } else {
      for (let i = 0; i < cards.cards.length; i++) {
        if (card.number == cards.cards[i].number) {
          throw new requestError("This card is already saved!");
        }
      }
      cards.cards.push(card);
      await cards.save();
    }
    const updatedCards = await cardsdb.cards.find({"userId": req.app.locals.userId});
    res.status(201);
    res.json(updatedCards[0].cards);
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
    let cards = await cardsdb.cards.findOne({
      "userId": req.app.locals.userId
    });
    if (!cards) {
      throw new serverError("Users cards not found");
    }

    const checkCards = (card) => {
      return card.number == cardNumber;
    }
    let index = await cards.cards.findIndex(checkCards);

    if (index == -1) {
      throw new notFoundError("Card not found");
    }

    delete cards.cards[index];

    const filteredCards = cards.cards.filter((card) => {
      return card != null;
    });
    await cardsdb.cards.updateMany( {"userId": req.app.locals.userId}, {  $set: {"cards": filteredCards } } );
    res.status(200);
    res.json(filteredCards);
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
    if (newCard.number.length != 16 || newCard.security.length != 3 || newCard.expires.length != 5 || !newCard.number.match(/^-{0,1}\d+$/) || !newCard.security.match(/^-{0,1}\d+$/)) {
      console.log(newCard.number + newCard.security + newCard.expires);
      throw new requestError("Invalid card data!");
    }
    let cards = await cardsdb.cards.findOne({
      "userId": req.app.locals.userId
    });
    if (!cards) {
      throw new serverError("Something went wrong");
    }

    const checkCards = (card) => {
      return card.number == cardNumber;
    }
    let index = cards.cards.findIndex(checkCards);

    if (index == -1) {
      throw new notFoundError("Card not found");
    }

    cards.cards[index] = newCard;

    /* await cardsdb.cards.updateMany( {"userId": req.app.locals.userId}, {  $set: {"cards": filteredCards } } ); */
    /* for (let i = 0; i < cards.cards.length; i++) {
      if (cardNumber == cards.cards[i].number) {
        cards.cards[i] = newCard;
      } else {
        throw new notFoundError("Card not found");
      }
    } */
    /* await userdb.user.updateMany({ "user.id": req.app.locals.userId }, { $set: { "user.cards": user.user.cards } }); */
    cards.save();
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
