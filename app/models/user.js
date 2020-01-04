const Eloquent = require('../../src/eloquent');

class User extends Eloquent {
}

User.table = 'users';

module.exports = User;
