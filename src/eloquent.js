const Factory = require('./db/factory');
const Hydrate = require('./db/hydrate');

class Eloquent {
  constructor() {
    this.query = null;
    this.includes = [];
    this.attributes = {};

    return new Proxy(this, {
      get: (target, key, receiver)  => {
        if (Object.keys(target.attributes).includes(key)) {
          return target.attributes[key];
        }

        return target[key];
      },
    });
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

    if (results.length >= 1) {
      return results[0];
    }
  }

  static async find(id) {
    const build = Factory
      .make(this.prototype.constructor)
      .where('id', '=', id)

    return await build.first();
  }
}

module.exports = Eloquent;
