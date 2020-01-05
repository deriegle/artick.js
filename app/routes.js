const User = require('./models/user');
const View = require('../src/view');

module.exports = {
  'GET /': async () => {
    const user = await User.find(1);

    return View.make('home/index', {
      user,
    });
  },
  'GET /help': () => View.make('help/index'),
  'GET /faq': () => View.make('help/faq'),
};
