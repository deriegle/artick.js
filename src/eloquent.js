const Factory = require('./db/factory');

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

  static find(id) {
    return Factory
      .make(this.prototype.constructor)
      .where('id', '=', id)
      .first();
  }
}

module.exports = Eloquent;
