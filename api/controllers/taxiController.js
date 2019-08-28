"use strict";

const userdb = require("../helpers/models/userModel");
const companys = require("../helpers/models/companyModel");
const orderdb = require('../helpers/models/orderModel');
const errorHandler = require("../helpers/errorHandler/errorhandler");
const { notFoundError, requestError } = require('../helpers/errorHandler/errors');

function orderTaxi(req, res) {
  return orderTaxiAsync(req, res);
}

const orderTaxiAsync = async (req, res) => {
  const toHome = req.swagger.params["toHome"].value;
  const position = req.swagger.params["position"].value;

  const executeOrder = async (order, location, user) => {
    const localcompanies = await companys.taxicompany.find({ "city": location });

    if (!localcompanies) {
      throw new requestError("Your position is not accessible!");
    }
    order.date = new Date;
    for (let i = 0; i < localcompanies.length; i++) {
      if (user.user.favoritCompany == localcompanies[i]) {
        order.company = user.user.favoritCompany;
      }
      order.company = localcompanies[0];
    }
  };

  try {
    let location = '';
    let order = {};
    const user = await userdb.user.findOne({
      "user.id": req.app.locals.userId
    });

    if (!user) {
      throw new notFoundError("Something went wrong");
    }

    if (toHome) {
      location = user.user.home.city;
      order.adress = user.user.home;
      executeOrder(order, location, user);
    } else {
      location = position.city;
      order.adress = position;
      executeOrder(order, location, user);
    }
    let orders = user.user.history;
    orders.push(order);
    await userdb.user.updateMany({ "user.id": req.app.locals.userId }, { $set: { "user.history": orders } });
    order.userId = user.user.id;
    await orderdb.order.insertMany({ order });
    res.status(200);
    res.json( order );
  } catch (e) {
    errorHandler(e, res);
  }
};

function orderHistory(req, res) {
  return orderHistoryAsync(req, res);
}

const orderHistoryAsync = async (req, res) => {
  try {
    const user = await userdb.user.findOne({ "user.id": req.app.locals.userId });
    const history = user.user.history;
    if (!user || !history) {
      throw new notFoundError ("Something went wrong");
    }
    res.status(200);
    res.json( history );
  } catch (e) {
    errorHandler(e, res);
  }
};

function updateFavorite(req, res) {
  return updateFavoriteAsync(req, res);
}

const updateFavoriteAsync = async (req, res) => {
  const newFavorite = req.swagger.params["CompanyName"].value;
  try {
    const favTaxiCompany = await companys.taxicompany.find({ "name": CompanyName });
    if (!favTaxiCompany) {
      throw new notFoundError('This company is not our partner');
    }
    await userdb.user.updateMany({ "user.id": req.app.locals.userId }, { $set: { "user.favoritCompany": newFavorite } });
    res.status(200);
    res.json( newFavorite );
  } catch (e) {
    errorHandler(e, res);
  }
};

module.exports = {
  orderTaxi: orderTaxi,
  orderHistory: orderHistory,
  updateFavorite: updateFavorite
};
