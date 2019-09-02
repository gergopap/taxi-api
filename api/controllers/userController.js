'use strict';

const userdb = require('../helpers/models/userModel');
const session = require('../helpers/models/sessionModel');
const errorHandler = require('../helpers/errorHandler/errorhandler');
const { authError, requestError, serverError } = require('../helpers/errorHandler/errors');

function signupUser(req, res) {
    return signupAsync(req, res);
}

const signupAsync = async (req, res) => {
    let user = req.swagger.params['user'].value;
    try {
        const newUser = await userdb.user.findOne({
            "user.email": user.email
        });
        const userName = await userdb.user.findOne({
            "user.username": user.username
        });
        if (newUser || userName) {
            throw new requestError('User already exists');
        }
        user.id = await userdb.user.count() + 1;
        user.favoriteCompany = '';
        user.currentLocation = {};
        await userdb.user.insertMany({
            user
        });
        delete user.password;
        delete user.id;
        delete user.favoriteCompany;
        delete user.currentLocation;
        console.log(user)
        res.status(201).json( user );
    } catch (e) {
        errorHandler(e, res);

    }

};

function loginUser(req, res) {
    return loginAsync(req, res);
}

const loginAsync = async (req, res) => {
    const credentials = req.swagger.params['credentials'].value;
    try {
        const currentUser = await userdb.user.findOne({
            "user.username": credentials.username
        });
        if (!currentUser || currentUser.user.password !== credentials.password) {
            throw new authError('Invalid username or password!');
        }
        let sessionId = await Math.floor(100000 + Math.random() * 900000);
        await session.session.insertMany({
            "id": sessionId,
            "userId": currentUser.user.id
        });
        if (!sessionId) {
            throw new serverError('Something went wrong!');
        }
        return res.status(200).json( sessionId );
    } catch (e) {
        errorHandler(e, res);

    }
};

function logoutUser(req, res) {
    return logoutAsync(req, res);
}

const logoutAsync = async (req, res) => {
    const userId = req.app.locals.userId;
    try {
        await session.session.deleteMany({
            "userId": userId
        });
        res.status(200).json({ 'Logout': 'Success'});
    } catch (e) {
        errorHandler(e, res);
    }
};

module.exports = {
    signupUser: signupUser,
    loginUser: loginUser,
    logoutUser: logoutUser
};
