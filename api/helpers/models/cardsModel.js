const mongoose = require('mongoose');

const cardsSchema = new mongoose.Schema({
    userId: 'String',
    cards: [{
        name: 'String',
        number: 'String',
        owner: 'string',
        expires: 'string',
        security: 'String'
    }]
}, 
{ collection: 'cards' });

let cards = mongoose.model('cards', cardsSchema);

module.exports = {
    cards
};
