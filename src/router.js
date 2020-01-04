const path = require('path');
const Route = require('./route');
const environment = require('./environment');

class Router {
  constructor() {
    this.routes = require(path.join(environment.APP_PATH, `routes${environment.EXT}`));
  }

  route(method, uri) {
    const methodPath = `${method} ${uri}`;

    if (typeof this.routes[methodPath] === 'function') {
      return new Route(this.routes[methodPath]);
    }

    Object.entries(this.routes).forEach(([keys, callback]) => {
      if (keys.indexOf('(') !== -1 || keys.indexOf(',') !== -1) {
        keys.split(', ').forEach((route) => {
          const regexFormattedRoute = route.replace(':any', '.+').replace(':num', '[0-9]+');
          const regex = new RegExp(`^${regexFormattedRoute}$`);

          if (methodPath.match(regex)) {
            return new Route(callback, this._parameters(uri.split('/'), route.split('/')));
          }
        });
      }
    });
  }

  _parameters(uriSegments, routeSegments) {
    const parameters = {};
    return parameters;
  }
};

module.exports = new Router();
