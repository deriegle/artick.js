class BaseModel {
  constructor() {
	/**
	 * Indicates if the model exists in the database.
	 * @var bool
	 */
    this.exists = false;
	/**
	 * The model attributes.
	 * @var array
	 */
    this.attributes = {};
	/**
	 * The model's dirty attributes.
	 *
	 * @var array
	 */
    this.dirty = {};
	/**
	 * The model's ignored attributes.
	 *
	 * Ignored attributes will not be saved to the database, and
	 * are primarily used to hold relationships.
	 *
	 * @var array
	 */
    this.ignore = [];
	/**
	 * The relationships that should be eagerly loaded.
	 *
	 * @var array
	 */
    this.includes = [];

	/**
	 * The relationship type the model is currently resolving.
	 *
	 * @var string
	 */
    this.relating = null;

	/**
	 * The foreign key of the "relating" relationship.
	 *
	 * @var string
	 */
	this.relating_key = null;

	/**
	 * The table name of the model being resolved. Used during many-to-many eager loading.
	 *
	 * @var string
	 */
	this.relating_table = null;

	/**
	 * The model query instance.
	 *
	 * @var Query
	 */
	this.query = null;
  }

	/**
	 * Create a new model instance and set the relationships
	 * that should be eagerly loaded.
	 *
	 * @return mixed
	 */

   static with() {
      const model = Factory.make(getCalledClass()); 
      // -----------------------------------------------------
      // Set the eager relationships.
      // -----------------------------------------------------
      model.includes = arguments;
      return model;
   }

	/**
	 * Get a model by the primary key.
	 *
	 * @param  int  $id
	 * @return mixed
	 */
	static find(id) {
		return Factory.make(get_called_class()).where('id', '=', id).first();
	}

	/**
	 * Get an array of models from the database.
	 *
	 * @return array
	 */
  _get() {
    return Hydrate.from(this);
  }

	/**
	 * Get the first model result
	 *
	 * @return mixed
	 */
	_first() {
		// -----------------------------------------------------
		// Load the hydrated models.
		// -----------------------------------------------------
		const results = Hydrate.from(this.take(1));

		// -----------------------------------------------------
		// Return the first result.
		// -----------------------------------------------------
    if (results.length > 0) {
      return results[0];
		}
	}

	/**
	 * Retrieve the query for a 1:1 relationship.
	 *
	 * @param  string  $model
	 * @return mixed
	 */
	hasOne(model) {
		return Relate.hasOne(model, this);
	}

	/**
	 * Retrieve the query for a 1:* relationship.
	 *
	 * @param  string  $model
	 * @return mixed
	 */
	hasMany(model) {
		return Relate.hasMany(model, this);
	}

	/**
	 * Retrieve the query for a 1:1 belonging relationship.
	 *
	 * @param  string  $model
	 * @return mixed
	 */
	belongsTo(model) {
		// -----------------------------------------------------
		// Get the calling function name.
		// -----------------------------------------------------
    const [_, caller] = debug_backtrace(false);

		return Relate.belongsTo(caller, model, this);
	}

	/**
	 * Retrieve the query for a *:* relationship.
	 *
	 * @param  string  $model
	 * @return mixed
	 */
	hasManyAndBelongsTo(model) {
		return Relate.hasManyAndBelongsTo(model, this);
	}

	/**
	 * Save the model to the database.
	 *
	 * @return void
	 */
	save() {
		Warehouse.store(this);
	}

	/**
	 * Magic method for retrieving model attributes.
	 */
	public function __get($key)
	{
		// -----------------------------------------------------
		// Check the ignored attributes first.
		// -----------------------------------------------------
		if (array_key_exists($key, $this->ignore))
		{
			return $this->ignore[$key];
		}

		// -----------------------------------------------------
		// Is the attribute actually a relationship?
		// -----------------------------------------------------
		if (method_exists($this, $key))
		{
			// -----------------------------------------------------
			// Get the query / model for the relationship.
			// -----------------------------------------------------
			$model = $this->$key();

			// -----------------------------------------------------
			// Return the relationship results.
			// -----------------------------------------------------
			return ($this->relating == 'has_one' or $this->relating == 'belongs_to')
													? $this->ignore[$key] = $model->first()
													: $this->ignore[$key] = $model->get();
		}

		// -----------------------------------------------------
		// Check the "regular" attributes.
		// -----------------------------------------------------
		return (array_key_exists($key, $this->attributes)) ? $this->attributes[$key] : null;
	}

	/**
	 * Magic Method for setting model attributes.
	 */
	public function __set($key, $value)
	{
		// -----------------------------------------------------
		// Is the key actually a relationship?
		// -----------------------------------------------------
		if (method_exists($this, $key))
		{
			$this->ignore[$key] = $value;
		}
		else
		{
			// -----------------------------------------------------
			// Add the value to the attributes.
			// -----------------------------------------------------
			$this->attributes[$key] = $value;
			$this->dirty[$key] = $value;
		}
	}

	/**
	 * Magic Method for determining if a model attribute is set.
	 */
	public function __isset($key)
	{
		return (array_key_exists($key, $this->attributes) or array_key_exists($key, $this->ignore));
	}

	/**
	 * Magic Method for unsetting model attributes.
	 */
	public function __unset($key)
	{
		unset($this->attributes[$key]);
		unset($this->ignore[$key]);
		unset($this->dirty[$key]);
	}

	/**
	 * Magic Method for handling dynamic method calls.
	 */
	public function __call($method, $parameters)
	{
		// -----------------------------------------------------
		// Is the "get" method being called?
		// -----------------------------------------------------
		if ($method == 'get')
		{
			return $this->_get();
		}

		// -----------------------------------------------------
		// Is the "first" method being called?
		// -----------------------------------------------------
		if ($method == 'first')
		{
			return $this->_first();
		}

		// -----------------------------------------------------
		// If the method is an aggregate function, just return
		// the aggregate value from the query.
		// -----------------------------------------------------
		if (in_array($method, array('count', 'sum', 'min', 'max', 'avg')))
		{
			return call_user_func_array(array($this->query, $method), $parameters);
		}

		// -----------------------------------------------------
		// Pass the method call to the query instance.
		// -----------------------------------------------------
		call_user_func_array(array($this->query, $method), $parameters);

		return $this;
	}

	/**
	 * Magic Method for handling dynamic static method calls.
	 */
	public static function __callStatic($method, $parameters)
	{
		// -----------------------------------------------------
		// Create a new model instance.
		// -----------------------------------------------------
		$model = Eloquent\Factory::make(get_called_class());

		// -----------------------------------------------------
		// Do we need to return the entire table?
		// -----------------------------------------------------
		if ($method == 'get')
		{
			return $model->_get();
		}

		// -----------------------------------------------------
		// Do we need to return the first model from the table?
		// -----------------------------------------------------
		if ($method == 'first')
		{
			return $model->_first();
		}

		// -----------------------------------------------------
		// If the method is an aggregate function, just return
		// the aggregate value from the query.
		// -----------------------------------------------------
		if (in_array($method, array('count', 'sum', 'min', 'max', 'avg')))
		{
			return call_user_func_array(array($model->query, $method), $parameters);
		}

		// -----------------------------------------------------
		// Pass the method call to the query instance.
		// -----------------------------------------------------
		call_user_func_array(array($model->query, $method), $parameters);

		return $model;
	}

}
