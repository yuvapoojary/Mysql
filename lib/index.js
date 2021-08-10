'use strict';

const driver = require('mysql2');
const Table = require('./Table');

function Mysql(options) {
  this.tables = {};
  this.pool = null;
  this.options = Object.assign({}, options);

};

Mysql.prototype.getTable = function(table) {
   return this.tables[table];
};

Mysql.prototype.createPool = function(config) {
 if(config) this.options = config;
  this.pool = driver.createPool(this.options);
};

Mysql.prototype.registerTable = function(tables) {
  if (typeof tables === 'string') tables = [tables];
  tables.forEach((item) => {
    const table = new Table(item, this);
    this.tables[item] = table;
  });
};

module.exports = new Mysql();