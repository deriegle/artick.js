const View = require('../src/view');

module.exports = {
  'GET /': () => View.make('home/index'),
  'GET /help': () => View.make('help/index'),
  'GET /faq': () => View.make('help/faq'),
};
