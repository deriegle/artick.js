const Query = require('./db/query');
const Config = require('./config');
const DBConnector = require('./db/connector');

const PDO = {
  FETCH_CLASS: 'FETCH_CLASS',
};

class DB {
  constructor() {
    this.connections = {};
  }

  connection(connection) {
    if (!connection) {
      connection = Config.get('db.default');
    }

    if (!this.connections[connection]) {
      const config = Config.get('db.connections');

      if (!config[connection]) {
        throw new Error(`Database connection [${connection}] is not defined.`);
      }

      this.connections[connection] = Connector.connect(config[connection]);
    }

    return this.connections[connection];
  }

  query(sql, bindings = [], connection = null) {
    const query = this.connection(connection).prepare(sql);
    const result = query.execute(bindings);

		// ---------------------------------------------------
		// For SELECT statements, return the results in an
		// array of stdClasses.
		//
		// For UPDATE and DELETE statements, return the number
		// or rows affected by the query.
		//
		// For INSERT statements, return a boolean.
		// ---------------------------------------------------
    //
    if (sql.toUpperCase().indexOf('SELECT') === 0) {
      // PDO.FETCH_CLASS does not exist in Javascript (Find equivalent)

      return query.fetchAll(PDO.FETCH_CLASS, 'stdClass');
    }

    if (sql.toUpperCase().indexOf('UPDATE') === 0 || sql.toUpperCase().indexOf('DELETE') === 0) {
      return query.rowCount();
    }

    return result;
  }

  table(table, connection) {
    return new Query(table, connection);
  }
}

module.exports = new DB();
