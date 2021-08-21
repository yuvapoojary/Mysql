const { promisify } from 'util';

const Transaction = function(base) {
  this.base = base;
  this.connection = null;
};

Transaction.prototype.constructor = Transaction;

Transaction.prototype.init = async function() {
  const getConnection = promisify(this.base.pool.getConnection.bind(this.base.pool));
  this.connection = await getConnection();
  await this.start();
  return this;
};

Transaction.prototype.query = function(...args) {
  return this.connection.query(...args);
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