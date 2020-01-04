const View = require('../src/view');

module.exports = {
  'GET /': () => View.make('home/index'),
};
