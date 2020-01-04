const Config = require('../config');
const System = require('../system');

class Query {
  constructor(table, connection) {
    this._connection = connection || Config.get('db.default');
    this.table = table;
    this.from = `FROM ${this.wrap(this.table)}`;
  }

  static table(table, connection) {
    return new Query(table, connection);
  }

  distinct() {
    this.distinct = true;
    return this;
  }

  select() {
    const initialSelect = this.distinct ? 'SELECT DISTINCT ' : 'SELECT ';
    const columns = arguments.map((column) => this.wrap(column)).join(', ');
    this._select = initialSelect + columns;
    return this;
  }

  join(table, column1, operator, column2, type = 'INNER') {
    this.from += `${this.from} ${type} JOIN ${this.wrap(table)} ON ${this.wrap(column1)} ${operator} ${this.wrap(column2)}`;
    return this;
  }

  leftJoin(table, column1, operator, column2) {
    return this.join(table, column1, operator, column2, 'LEFT');
  }

  rawWhere(where, bindings = [], connector = 'AND') {
    this._where = `${this._where} ${connector} ${where}`;
    this.bindings = this.bindings.concat(bindings);

    return this;
  }

  rawOrWhere(where, bindings = []) {
    return this.rawWhere(where, bindings, 'OR');
  }

  where(column, operator, value, connector = 'AND') {
    this._where = `${this._where} ${connector} ${this.wrap(column)} ${operator} ?`;
    this.bindings = Array.of(value);

    return this;
  }

  orWhere(column, operator, value) {
    return this.where(column, operator, value, 'OR');
  }

  whereIn(column, values, connector = 'AND') {
    this._where = `${this._where} ${connector} ${this.wrap(column)} IN (${this.parameterize(values)})`;
    this.bindings = this.bindings.concat(values);

    return this;
  }

  orWhereIn(column, values) {
    return this.whereIn(column, values, 'OR');
  }

  whereNotIn(column, values, connector = 'AND') {
    this._where = `${this._where} ${connector} ${this.wrap(column)} NOT IN (${this.parameterize(values)})`;
  }

  orWhereNotIn(column, values) {
    return this.whereNotIn(column, values, 'OR');
  }

  whereNull(column, connector = 'AND') {
    this._where = `${this._where} ${connector} ${this.wrap(column)} IS NULL`;
    return this;
  }

  orWhereNull(column) {
    return this.whereNull(column, 'OR');
  }

  whereNotNull(column, connector = 'AND') {
    this._where = `${this._where} ${connector} ${this.wrap(column)} IS NOT NULL`;
    return this;
  }

  orWhereNotNull(column) {
    return this.whereNotNull(column, 'OR');
  }

  orderBy(column, direction) {
    this.ordering = `${this.wrap(column)} ${direction.toUpperCase()}`;
    return this;
  }

  skip(value) {
    this.offset = value;
    return this;
  }

  take(value) {
    this.limit = value;
    return this;
  }

  find(id) {
    this.where('id', '=', id);

    return this.first();
  }

  first() {
    this.take(1);

    const results = this.get(arguments);

		return results.length > 0 ? results[0] : null;
  }

	get() {
    if (!this._select) {
    }

    return 
		// ---------------------------------------------------
		// Initialize the SELECT clause if it's null.
		// ---------------------------------------------------
		if (is_null($this->select))
		{
			call_user_func_array(array($this, 'select'), (count(func_get_args()) > 0) ? func_get_args() : array('*'));
		}

		return \System\DB::query(Query\Compiler::select($this), $this->bindings, $this->connection);
	}

	parameterize(values) {
    const questionArray = new Array(values.length).fill('?');

    return questionArray.join(', ');
	}

	wrap(value, wrap = '"') {
		// ---------------------------------------------------
		// If the application is using MySQL, we need to use
		// a non-standard keyword identifier.
		// ---------------------------------------------------
    if (this.usingMySQLDatabase) {
			wrap = '`';
    }

		// ---------------------------------------------------
		// Wrap the element in keyword identifiers.
		// ---------------------------------------------------
    return value
      .split('.')
      .map((segment) => segment !== '*' ? `${wrap}${segement}${wrap}` : segement)
      .join('.');
	}
}

	/**
	 * The database connection name.
	 * @var string
	 */
	private $connection;

	/**
	 * The SELECT clause.
	 * @var string
	 */
	public $select;

	/**
	 * Indicates if the query should return distinct results.
	 * @var bool
	 */
	public $distinct = false;

	/**
	 * The FROM clause.
	 * @var string
	 */
	public $from;

	/**
	 * The table name.
	 * @var string
	 */
	public $table;

	/**
	 * The WHERE clause.
	 * @var string
	 */
	public $where = 'WHERE 1 = 1';

	/**
	 * The ORDER BY columns.
	 * @var array
	 */
	public $orderings = array();

	/**
	 * The LIMIT value.
	 * @var int
	 */
	public $limit;

	/**
	 * The OFFSET value.
	 * @var int
	 */
	public $offset;

	/**
	 * The query value bindings.
	 * @var array
	 */
	public $bindings = array();
