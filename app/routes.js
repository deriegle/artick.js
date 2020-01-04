const User = require('./models/user');
const View = require('../src/view');

module.exports = {
  'GET /': () => {
    const user = User.find(2);

    return View.make('home/index', {
      userId: user.id,
    });
  },
  'GET /help': () => View.make('help/index'),
  'GET /faq': () => View.make('help/faq'),
};
