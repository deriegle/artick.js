const Meta = require('./meta');
const Query = require('../db');

class Factory {
  static make(klass) {
    const model = new klass;

    const tableName = Meta.table(klass);

    model.query = Query(tableName);

    return model;
  }
}

module.exports = Factory;
