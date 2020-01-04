const Inflector = require('../inflector');

class Meta {
	static table(klass) {
    return klass.hasOwnProperty('table')
      ? klass.table
      : Inflector.plural(klass).toLowerCase();
	}
}
