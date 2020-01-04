const Factory = require('./db/factory');
const Hydrate = require('./db/hydrate');

class Eloquent {
  constructor() {
    this.query = null;
    this.includes = [];
  }

  where() {
    this.query.where(...arguments);
    return this;
  }

  take(limit) {
    this.query.limit(limit);
    return this;
  }

  async first() {
    const results = await Hydrate.from(this.take(1));

    if (results.length > 1) {
      return results[0];
    }
  }

  static find(id) {
    return Factory
      .make(this.prototype.constructor)
      .where('id', '=', id)
      .first();
  }
}

module.exports = Eloquent;
