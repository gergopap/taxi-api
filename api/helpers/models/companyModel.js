const mongoose = require('mongoose');

const taxicompanySchema = new mongoose.Schema({
    name: 'String',
    city: 'String'
},
    { collection: 'taxicompanies' });

let taxicompany = mongoose.model('taxicompany', taxicompanySchema);

module.exports = {
    taxicompany
};
