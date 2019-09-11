"use strict";

const userdb = require("../helpers/models/userModel");
const companies = require("../helpers/models/companyModel");
const orderdb = require('../helpers/models/orderModel');
const errorHandler = require("../helpers/errorHandler/errorhandler");
const { serverError, requestError } = require('../helpers/errorHandler/errors');

function updatePosition(req, res) {
  return updatePositionAsync(req, res);
}

const updatePositionAsync = async (req, res) => {
  const position = req.swagger.params["position"].value;
  const toHome = position.home;
  const address = position.address;
  console.log(toHome)

  try {
    let location = '';
    const user = await userdb.user.findOne({
      "user.id": req.app.locals.userId
    });

    if (!user) {
      throw new serverError("Something went wrong");
    }

    if (toHome) {
      location = user.user.home.city;
      user.user.currentLocation = user.user.home;
    } else {
      location = address.city;
      user.user.currentLocation = address;
    }
    const localcompanies = await companies.taxicompany.find({ "city": location });
    if (!localcompanies[0] ) {
      throw new requestError("Sorry, there are not any taxis at your position!");
    }
    let companyNames = [];
    for (let i = 0; i< localcompanies.length; i++) {
      companyNames[i] = localcompanies[i].name;
    }
    await userdb.user.updateMany({ "user.id": req.app.locals.userId }, { $set: { "user.currentLocation": user.user.currentLocation } });
    res.status(200);
    res.json(companyNames);
  } catch (e) {
    errorHandler(e, res);
  }
};

function orderTaxi(req, res) {
  return orderTaxiAsync(req, res);
}

const orderTaxiAsync = async (req, res) => {
  const companyparam = req.swagger.params["company"].value;
  const favorite = companyparam.favorite;
  const company = companyparam.companyName;

  try {
    let order = {};
    const user = await userdb.user.findOne({
      "user.id": req.app.locals.userId
    });
    if (!user) {
      throw new serverError("Something went wrong");
    }
    order.address = user.user.currentLocation;

    const localcompanies = await companies.taxicompany.find({ "city": order.address.city });
    if (!localcompanies) {
      throw new requestError("Sorry, your position is not accessible!");
    }
    let companyNames = [];
    for (let i = 0; i< localcompanies.length; i++) {
      companyNames[i] = localcompanies[i].name;
    }

    const checkValidCompany = (tc) => {
      const checkCompany = (comp) => {
        return comp == tc;
      };
      let currentCompany = companyNames.filter(checkCompany);
      if(!currentCompany[0]) {
        throw new requestError("Please choose a company from the avaliable companies!"); 
      }
    };

    if (favorite) {
      checkValidCompany(user.user.favoriteCompany);
      order.company = user.user.favoriteCompany;
    } else {
      checkValidCompany(company);
      order.company = company;
    }
    order.userId = user.user.id;
    order.date = new Date();
    console.log(order)
    await orderdb.order.insertMany({ order });
    res.status(200);
    res.json(order);
  } catch (e) {
    errorHandler(e, res);
  }
};

function orderHistory(req, res) {
  return orderHistoryAsync(req, res);
}

const orderHistoryAsync = async (req, res) => {
  try {
    const userId = req.app.locals.userId
    const history = await orderdb.order.find({ "order.userId": userId }); 
    if (!history) {
      throw new serverError("Something went wrong");
    }
    res.status(200);
    res.json(history);
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
    console.log(newFavorite)
    const favTaxiCompany = await companies.taxicompany.find({ "name": newFavorite.CompanyName });
    console.log(favTaxiCompany)
    if (!favTaxiCompany[0]) {
      throw new requestError('This company is not our partner');
    }
    console.log(newFavorite)
    await userdb.user.updateMany({ "user.id": req.app.locals.userId }, { $set: { "user.favoriteCompany": newFavorite.CompanyName } });
    res.status(200);
    res.json(newFavorite);
  } catch (e) {
    errorHandler(e, res);
  }
};

module.exports = {
  orderTaxi: orderTaxi,
  orderHistory: orderHistory,
  updateFavorite: updateFavorite,
  updatePosition: updatePosition
};
