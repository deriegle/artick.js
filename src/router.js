const path = require('path');
const Route = require('./route');

class Router {
  constructor() {
    this.routes = require(path.join(global.APP, `routes${global.EXT}`));
  }

  route(method, path) {
    const uri = path !== '/' ? `/${path}` : path;
    const methodPath = `${method} ${uri}`;

    if (typeof this.routes[`${method} ${uri}`] === 'function') {
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
