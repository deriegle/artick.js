const Eloquent = require('../../src/eloquent');
const Account = require('./account');

class User extends Eloquent {
  account() {
    return this.belongsTo(Account);
  }
}

User.table = 'users';

module.exports = User;
