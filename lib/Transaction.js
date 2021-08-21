const { promisify } = require('util');

const Transaction = function(base) {
  this.base = base;
  this.connection = null;
};

Transaction.prototype.constructor = Transaction;

Transaction.prototype.init = async function() {
  this.connection = await this.base.pool.getConnection();
  await this.start();
  return this;
};

Transaction.prototype.query = function(sql, options = {}) {
  return this.base.query(sql, {
    ...options,
    connection: this.connection
  });
};

Transaction.prototype.start = function() {
  return this.query('START TRANSACTION');
};

Transaction.prototype.commit = function() {
   return this.query('COMMIT');
};

Transaction.prototype.rollback = function() {
   return this.query('ROLLBACK')
};

module.exports = Transaction;