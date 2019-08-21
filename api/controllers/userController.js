'use strict';

const userdb = require('../helpers/models/userModel');
const session = require('../helpers/models/sessionModel')

function signupUser(req, res) {
    return signupAsync(req, res);
}

const signupAsync = async (req, res) => {
    let user = req.swagger.params['user'].value;
    let newUser = await userdb.user.findOne({
        "user.email": user.email
    });
    if (newUser) {
        console.log(newUser)
        return res.status(400).json({
            Error: "User already exists!"
        });
    } else {
        user.id = await userdb.user.count() + 1;
        user.queue = [];
        await userdb.user.insertMany({
            user
        });
    }
    if (user.queue) {
        user.password = '*****';
        return res.status(201).json(user);
    } else {
        return res.status(400).json({
            Error: "User already exists!"
        });
    }
};

function loginUser(req, res) {
    return loginAsync(req, res);
}

const loginAsync = async (req, res) => {
    const credentials = req.swagger.params['credentials'].value;
    const user = await userdb.user.findOne({
        "user.userName": credentials.userName
    });
    if (user != null) {
        if (user.user.password === credentials.password) {
            let sessionId = await Math.floor(100000 + Math.random() * 900000);
            await session.session.insertMany({
                "id": sessionId,
                "userId": user.user.id
            });
            if (sessionId) {
                return res.status(200).json(sessionId);
            } else {
                return res.status(400).send({
                    Error: "Something went wrong!"
                });
            }
        } else {
            return res.status(400).send({
                Error: "Invalid username or password!2"
            });
        }
    } else {
        return res.status(400).send({
            Error: "Invalid username or password!3"
        });
    }
};

function logoutUser(req, res) {
    return logoutAsync(req, res);
}

const logoutAsync = async (req, res) => {
    let xSessionID = req.swagger.params['X-Session-ID'].value;
    let sessionId = Number(xSessionID);
    console.log('dfs')
    await session.session.deleteOne({
        "id": sessionId
    }).then((result) => { //vagy deleteMany
        console.log(result)
        if (result) {
            console.log(result)
            return res.status(200);
        } else {
            return res.status(400).send({
                Error: "Already logged out."
            });
        }
    });
};

module.exports = {
    signupUser: signupUser,
    loginUser: loginUser,
    logoutUser: logoutUser
};