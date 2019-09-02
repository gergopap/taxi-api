const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user: {
        id: 'Number',
        username: 'String',
        password: 'String',
        email: 'String',
        firstname: 'String',
        lastname: 'String',
        phone: 'String',
        home: {
            postal: 'Number',
            city: 'String',
            street: 'String',
            number: 'String'
          },
        favoriteCompany: 'String',
        currentLocation: {
            postal: 'Number',
            city: 'String',
            street: 'String',
            number: 'String'
          }
    }
},
{ collection : 'users' });

let user = mongoose.model('user', userSchema);

module.exports = {
    user
};
