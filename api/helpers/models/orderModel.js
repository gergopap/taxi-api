const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
order: {
        userId: 'String',
        adress: 'Object',
        date: 'String',
        company: 'String'
    }
},
{ collection : 'orders' });

let order = mongoose.model('order', orderSchema);

module.exports = {
    order
};
