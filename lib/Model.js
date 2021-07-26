'use strict';

const util = require('./util');
const Query = require('./Query');
const where = require('./queries/where');
const find = require('./queries/find');

function Model(name, schema, base) {
  this.base = base;
  this.table = name;
  this.schema = schema;
  this.queryCache = {};
};

Model.prototype.constructor = Model;

Model.prototype.query = function(query, options, cb) {

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

Model.prototype.insertOne = function(obj, options = {}, cb) {

  const fields = Object.keys(obj).join(',');
  const values = Object.values(obj).join('",');
  const query = 'INSERT INTO ' + this.table + ' ("' + fields + '") ' + 'values(' + values + ')';
  return this.query(query, options, cb);

};

Model.prototype.findOne = function(filter, options = {}, cb) {
  return new Query(filter, {
    transform: (data) => (data && data[0]) || null,
    ...options
  }, this);
};

Model.prototype.find = function(filter, options) {
  return new Query(filter, options, this);
};

Model.prototype.updateOne = function(filter, update, options, cb) {
  return this.update(filter, update, {
    ...options,
    limit: 1
  }, cb);
};

Model.prototype.update = function(filter, update, options, cb) {
  if (typeof options == 'function') {
    options = {};
    cb = options;
  };
  const sqlstring = find(filter, update, options, this);
  return this.query(sqlstring, options, cb);
};

module.exports = Model;