const Meta = require('./meta');
const Query = require('../db');

class Factory {
  static make(klass) {
    const model = new klass;

    model.query = Query.table(Meta.table(klass));
  }
}

module.exports = Factory;
