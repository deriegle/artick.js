const Factory = require('./db/factory');
const Hydrate = require('./db/hydrate');

class Eloquent {
  constructor() {
    this.query = null;

    return new Proxy(this, {
      get: (target, objectKey) => {
        if (target.hasOwnProperty(objectKey)) {
          return target[objectKey];
        }

        console.log(target.query);

        if (target.query && target.query.hasOwnProperty(objectKey)) {
          return target.query[objectKey];
        }

        throw new Error(`Could not find [${objectKey}] on ${target}`);
      },
    });
  }

  _first() {
    const results = Hydrate.from(this.take(1));

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
