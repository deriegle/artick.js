const User = require('./models/user');
const View = require('../src/view');

module.exports = {
  'GET /': () => {
    const user = User.find(1);

    return View.make('home/index', {
      userId: 1,
    });
  },
  'GET /help': () => View.make('help/index'),
  'GET /faq': () => View.make('help/faq'),
};
