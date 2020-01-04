const Factory = require('./db/factory');

class Eloquent {
  static find(id) {
    return Factory
      .make(this.prototype.constructor)
      .where('id', '=', id)
      .first();
  }
}

module.exports = Eloquent;
