const Meta = require('./meta');

class Hydrate {
  static async from(eloquent) {
    const models = await eloquent.query;
    const results = Hydrate.base(eloquent.constructor, models);

    if (Object.keys(results).length > 0) {
      eloquent.includes.forEach((include) => {
        if (eloquent[include] === undefined) {
          throw new Error(`Attempting to eager load include [${include}], but the relationship is not defined.`);
        }

        Hydrate.eagerly(eloquent, include, results);
      });
    }

    return results;
  }

  static base(klass, models = []) {
    const results = {};

    models.forEach((model) => {
      const result = new klass();
      result.id = model.id;
      result.attributes = model;
      result.exists = true;
      results[result.id] = result;
    });

    return results;
  }

  static eagerly(eloquent, include, results) {
    const spoof = `${include}_id`;
    eloquent.attributes[spoof] = 0;

    const model = eloquent.include();

    delete eloquent.attributes[spoof];

    model.query.where = 'WHERE 1 = 1';
    model.query.bindings = {};

    results.forEach((result) => {
      result.ignore[include] = eloquent.relating.indexOf('hasMany') === 0 ? {} : null;
    });

    if (eloquent.relating === 'hasOne' || eloquent.relating === 'hasMany') {
      Hydrate.eagerlyLoadOneOrMany(eloquent.relatingKey, eloquent.relating, include, model, results);
    } else if (eloquent.relating === 'belongsTo') {
      Hydrate.eagerlyLoadBelonging(eloquent.relatingKey, include, model, results);
    } else {
      Hydrate.eagerlyLoadManyToMany(eloquent.relatingKey, eloquent.relatingTable, `${eloquent.constructor.name.toLowerCase()}_id`, include, model, results);
    }
  }

  static eagerlyLoadOneOrMany(relatingKey, relating, include, model, results) {
    const inclusions = model.whereIn(relatingKey, Object.keys(results)).get();

    Object.entries(includes).forEach(([key, inclusion]) => {
      if (relating === 'hasOne') {
        results[inclusion.relatingKey].ignore[include] = inclusion;
      } else {
        results[inclusion.relatingKey].ignore[include][inclusion.id] = inclusion;
      }
    });
  }

  static eagerlyloadbelonging(relatingKey, include, model, results) {
    const keys = [];

    results.forEach(result => keys.push(result.relatingKey));

    // -----------------------------------------------------
    // Get the related models.
    // -----------------------------------------------------

    const inclusions = model.whereIn('id', [...new Set(keys)]).get();

    // -----------------------------------------------------
    // Match the child models with their parent.
    // -----------------------------------------------------
    results.forEach(result => result.ignore[include] = inclusions[result.relatingKey]);
  }

  static eagerlyLoadManyToMany(relatingKey, relatingTable, foreignKey, include, model, results) {
    // -----------------------------------------------------
    // Reset the SELECT clause.
    // -----------------------------------------------------
    model.query.select = null;

    // -----------------------------------------------------
    // Retrieve the raw results as stdClasses.
    //
    // We also add the foreign key to the select which will allow us
    // to match the models back to their parents.
    // -----------------------------------------------------
    const inclusions = model.query.whereIn(relatingKey, Object.keys(results))
      .get(`${Meta.table(model.constructor.name)}.*`, `${relatingTable}.${foreign_key}`);

    // -----------------------------------------------------
    // Get the class name of the related model.
    // -----------------------------------------------------
    const klass = model.prototype.constructor;

    // -----------------------------------------------------
    // Create the related models.
    // -----------------------------------------------------
    inclusions.forEach((inclusion) => {
      const related = new klass();
      related.exists = true;
      related.attributes = inclusion;

      delete related.attributes[foreignKey];

      results[inclusion.foreignKey].ignore[include][inclusion.id] = related;
    });
  }
}

module.exports = Hydrate;
