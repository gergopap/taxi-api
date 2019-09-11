const taxidb = require('./models/companyModel');

const seedDb = async () => {
  try {
    const company = await taxidb.taxicompany.findOne({name: 'Fotaxi'});
    if (!company) {
      await taxidb.taxicompany.insertMany([
        { name: 'Fotaxi', city: 'Budapest' },
        { name: '6x6 taxi', city: 'Budapest' },
        { name: 'City taxi', city: 'Budapest' },
        { name: 'Radio taxi', city: 'Szeged' },
        { name: 'Tempo taxi', city: 'Szeged' },
        { name: 'Taxi Plusz', city: 'Szeged' },
        { name: 'Tele-4 taxi', city: 'Szeged' },
        { name: 'Taxi 900', city: 'Pecs' }
      ]);
    }
  }
  catch (e) {
    console.log(e);
  }
};

module.exports = {
  seedDb: seedDb
};
