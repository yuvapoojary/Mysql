'use strict';

const util = require('./util');
const Query = require('./Query');
const Join = require('./Join');
const where = require('./queries/where');
const update = require('./queries/update');
const count = require('./queries/count');

function Table(name, base) {
  this.base = base;
  this.table = name;
  this.queryCache = {};
};

Table.prototype.constructor = Table;


Table.prototype.setFilterCache = function (filter, options = {})  {
  if (options.cache === false) return where(filter);
  const key = JSON.stringify(filter);
  const cached = this.queryCache[key];
  if (cached) return cached;
  const value = where(filter);
  this.queryCache[key] = value;
  return value;
};

Table.prototype.query = function(query, options, cb) {

  const transform = (data) => {
    const fn = options && options.transform;
    if (typeof fn == 'function') return fn(data);
    return data;
  };

  if (!this.base.pool) throw new Error('Mysql is not connected to the server, connect it through mysql.createPool(..)');
  if (typeof options === 'function') cb = options;
  if (typeof cb === 'function') return this.base.pool.query(query, (err, data) => {
    if (err) return cb(err, null);
    cb(null, transform(data));
  });

  return new Promise((resolve, reject) => {
    this.base.pool.query(query, (err, data) => {
      if (err) return reject(new Error(err));
      resolve(transform(data));
    });
  });

};

Table.prototype.insertOne = function(obj, options = {}, cb) {

  const fields = Object.keys(obj).join(',');
  const values = Object.values(obj).join('",');
  const query = 'INSERT INTO ' + this.table + ' ("' + fields + '") ' + 'values(' + values + ')';
  return this.query(query, options, cb);

};

Table.prototype.findOne = function(filter, options = {}, cb) {
  return new Query(filter, {
    transform: (data) => (data && data[0]) || null,
    ...options
  }, this);
};

Table.prototype.find = function(filter, options) {
  return new Query(filter, options, this);
};

Table.prototype.updateOne = function(filter, update, options, cb) {
  return this.updateMany(filter, update, {
    ...options,
    limit: 1
  }, cb);
};

Table.prototype.updateMany = function(filter, updateObj, options, cb) {
  if (typeof options == 'function') {
    options = {};
    cb = options;
  };
  const sqlstring = update(filter, updateObj, options, this);
  return this.query(sqlstring, options, cb);
};

Table.prototype.count = function(field, filter, cb) {
  const sqlstring = count(field, filter, this);
  const transform = (data) => (data[0] && data[0].count) || null;
  return this.query(sqlstring, { transform }, cb);
};

Table.prototype.join = function(table) {
  return new Join(table, this);
};

Table.prototype.getColumns = function(select = '*', cb) {
  const sqlstring = util.joinString('SELECT', select, 'FROM', 'INFORMATION_SCHEMA.COLUMNS', 'WHERE TABLE_SCHEMA = ',`'${this.base.options.database}'`, 'AND', 'TABLE_NAME=', `'${this.table}'`);
  return this.query(sqlstring, {}, cb);
};

module.exports = Table;