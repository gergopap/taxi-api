const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: 'String',
    history: [{
        address: 'Object',
        date: 'String',
        company: 'String'
    }]
}, 
{ collection: 'history' });

let history = mongoose.model('history', historySchema);

module.exports = {
    history
};
