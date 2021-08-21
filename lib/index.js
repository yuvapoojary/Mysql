'use strict';

const driver = require('mysql2/promise');
const Table = require('./Table');
const Transaction = require('./Transaction');

function Mysql(options) {
  this.tables = {};
  this.pool = null;
  this.options = Object.assign({}, options);

};

Mysql.prototype.Mysql = Mysql;

Mysql.prototype.Transaction = Transaction;

Mysql.prototype.getTable = function(table) {
  return this.tables[table];
};

Mysql.prototype.createPool = async function(config) {
  if (config) this.options = config;
  this.pool = await driver.createPool(this.options);
};

Mysql.prototype.registerTable = function(tables) {
  if (typeof tables === 'string') tables = [tables];
  tables.forEach((item) => {
    const table = new Table(item, this);
    this.tables[item] = table;
  });
};

Mysql.prototype.query = function(query, options = {}) {
  
  const connection = options.connection || this.pool;
  const transform = (data) => {
    const fn = options && options.transform;
    if (typeof fn == 'function') return fn(data);
    return data;
  };
  

  if (!connection) throw new Error('Mysql is not connected to the server, connect it through mysql.createPool(..)');
  return connection.query(query)
  .then(([rows, coloums]) => transform(rows));
  
};

Mysql.prototype.startTransaction = async function() {
  const transaction = new Transaction(this);
  await transaction.init();
  return this;
};

module.exports = new Mysql();