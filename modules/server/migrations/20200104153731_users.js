
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('users', function(table) {
    table.increments();
    table.string('email');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
