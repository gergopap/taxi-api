const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user: {
        id: 'Number',
        username: 'String',
        password: 'String',
        email: 'String',
        firstname: 'String',
        lastname: 'String',
        cards: [{
            name: 'String',
            number: 'Number',
            owner: 'string',
            expires: 'string',
            security: 'number'
        }],
        phone: 'String',
        home: {
            postal: 'Number',
            city: 'String',
            street: 'String',
            number: 'String'
          },
        history: [{
            adress: 'Object',
            date: 'String',
            company:'String'
        }],
        favoritCompany: 'String'
    }
},
{ collection : 'users' });

let user = mongoose.model('user', userSchema);

module.exports = {
    user
};
