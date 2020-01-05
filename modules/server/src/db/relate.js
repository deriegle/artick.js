const Factory = require('./factory');

class Relate {
  static hasOne(model, eloquent) {
    eloquent.relating = 'hasOne';

    return Relate.hasOneOrMany(model, eloquent);
  }

  static hasMany(model, eloquent) {
    eloquent.relating = 'hasMany';

    return Relate.hasOneOrMany(model, eloquent);
  }

  static hasOneOrMany(model, eloquent) {
    eloquent.relatingKey = `${eloquent.constructor.name.toLowerCase()}_id`;

    return Factory.make(model).where(eloquent.relating_key, '=', eloquent.id);
  }

  static belongsTo(caller, model, eloquent) {
    eloquent.relating = 'belongsTo';
    eloquent.relatingKey = `${caller.function}_id`;

    return Factory
      .make(model)
      .where('id', '=', eloquent.attributes[eloquent.relatingKey]);
  }

  static hasManyAndBelongsTo(model, eloquent) {
    const models = [model.toLowerCase(), eloquent.constructor.name].sort();
    // Intermediate table name
    eloquent.relating = 'hasManyAndBelongsTo';
    eloquent.relatingTable = models.join('_');
    eloquent.relatingKey = `${eloquent.relatingTable}.${eloquent.constructor.name}_id`;

    return Factory
      .make(model)
      .select(Meta.table(model) + '.*')
      .join(
        eloquent.relatingTable,
        `${Meta.table(model)}.id`,
        '=',
        `${eloquent.relatingTable}.${model.toLowerCase()}_id`
      )
      .where(eloquent.relatingKey, '=', eloquent.id);
  }
}

module.exports = Relate;
