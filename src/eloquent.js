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

    console.log({
      firstResults: results,
    });

    if (results.length >= 1) {
      return results[0];
    }
  }

  static async find(id) {
    const build = Factory
      .make(this.prototype.constructor)
      .where('id', '=', id)

    const result = await build.first();

    console.log({
      findResult: result,
    });

    return result;
  }
}

module.exports = Eloquent;
