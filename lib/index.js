'use strict';

const driver = require('mysql2');
const Table = require('./Table');

function Mysql(options) {
  this.tables = {};
  this.pool = null;
  this.options = Object.assign({}, options);

};

Mysql.prototype.Mysql = Mysql;

Mysql.prototype.getTable = function(table) {
  return this.tables[table];
};

Mysql.prototype.createPool = function(config) {
  if (config) this.options = config;
  this.pool = driver.createPool(this.options);
};

Mysql.prototype.registerTable = function(tables) {
  if (typeof tables === 'string') tables = [tables];
  tables.forEach((item) => {
    const table = new Table(item, this);
    this.tables[item] = table;
  });
};

Mysql.prototype.query = function(query, options, cb) {

  const transform = (data) => {
    const fn = options && options.transform;
    if (typeof fn == 'function') return fn(data);
    return data;
  };

  if (!this.pool) throw new Error('Mysql is not connected to the server, connect it through mysql.createPool(..)');
  if (typeof options === 'function') cb = options;
  if (typeof cb === 'function') return this.pool.query(query, (err, data) => {
    if (err) return cb(err, null);
    cb(null, transform(data));
  });

  return new Promise((resolve, reject) => {
    this.pool.query(query, (err, data) => {
      if (err) return reject(new Error(err));
      resolve(transform(data));
    });
  });

};

module.exports = new Mysql();