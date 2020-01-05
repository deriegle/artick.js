const Query = require('../db');
const Meta = require('./meta');

class Warehouse {
  static store(eloquent) {
    const model = eloquent.constructor.name;

    eloquent.query = Query.table(Meta.table(model));

    if (model.hasOwnProperty('timestamps') && model.timestamps) {
      Warehouse._timestamp(eloquent);
    }

		// -----------------------------------------------------
		// If the model exists in the database, update it.
		// Otherwise, insert the model and set the ID.
		// -----------------------------------------------------
    if (eloquent.exists) {
      return eloquent.query.where('id', '=', eloquent.attributes.id).update(eloquent.dirty);
    }

    eloquent.attributes.id = eloquent.query.insertGetId(eloquent.attributes);
		eloquent.exists = true;
  }

	static _timestamp(eloquent) {
		eloquent.updatedAt = new Date();

		if (!eloquent.exists) {
			eloquent.createdAt = eloquent.updatedAt;
		}
	}
}

module.exports = Warehouse;
