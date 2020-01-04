const Meta = require('./meta');
const Query = require('../db');

class Factory {
  static make(klass) {
    const model = new klass;

    const tableName = Meta.table(klass);

    console.log(`CREATING NEW QUERY FOR TABLE: ${tableName}`);

    model.query = Query(tableName);

    return model;
  }
}

module.exports = Factory;
