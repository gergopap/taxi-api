const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
        id: 'String',
        userId: 'Number'
});

let session = mongoose.model('session', sessionSchema);

module.exports = {
    session
}
