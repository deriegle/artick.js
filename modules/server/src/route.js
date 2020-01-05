const Response = require('./Response');

class Route {
  constructor(route, parameters = []) {
    this.route = route;
    this.parameters = parameters;
  }

  async call() {
    let response = null;

    if (typeof this.route === 'function') {
      response = await this.route.call(this.parameters);
    } else if (typeof this.route === 'object') {
			// --------------------------------------------------------------
			// Call the "before" route filters.
			// --------------------------------------------------------------
      // $response = isset($this->route['before']) ? Filter::call($this->route['before']) : null;
      //
      //
      if (!response && this.route.do) {
        response = this.route.do.call(this.parameters);
      }
    }

    if (!(response instanceof Response)) {
      response = new Response(response);
    }

		// --------------------------------------------------------------
		// Call the "after" route filters.
		// --------------------------------------------------------------
    // if (is_array($this->route) and isset($this->route['after'])) {
    //  Filter::call($this->route['after'], array($response));
    // }

    return response;
  }
}

module.exports = Route;
