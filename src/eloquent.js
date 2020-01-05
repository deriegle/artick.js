const Factory = require('./db/factory');
const Relate = require('./db/relate');
const Hydrate = require('./db/hydrate');
const Warehouse = require('./db/warehouse');

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

  hasOne(model) {
    return Relate.hasOne(model, this);
  }

  hasMany(model) {
    return Relate.hasMany(model, this);
  }

  belongsTo(model) {
    const caller = this.constructor;

    return Relate.belongsTo(caller, model, this);
  }

  hasManyAndBelongsTo(model) {
    return Relate.hasManyAndBelongsTo(model, this);
  }

  save() {
    return Warehouse.store(this);
  }

  static async find(id) {
    const build = Factory
      .make(this.prototype.constructor)
      .where('id', '=', id)

    return await build.first();
  }
}

module.exports = Eloquent;
