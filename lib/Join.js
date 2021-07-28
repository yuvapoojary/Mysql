'use strict';

const util = require('./util');
const join = require('./queries/join');

function Join(table, model) {
  this.type = 'INNER';
  this.model = model;
  this.table = model.table;
  this.joinTable = table;
  this.conditions = [];
  this._select = '*';
};

Join.prototype.constructor = Join;

Join.prototype.left = function() {
  this.type = 'LEFT';
  return this;
};

Join.prototype.right = function() {
  this.type = 'RIGHT';
  return this;
};

Join.prototype.inner = function() {
  this.type = 'INNER';
  return this;
};

Join.prototype.select = function(obj) {
  this._select = obj;
  return this;
};

Join.prototype.sort = function(obj) {
  this._sort = obj;
  return this;
};

Join.prototype.where = function(field, operator, value)  {
  this.conditions.push(`${field} ${operator} ${value}`);
  return this;
};

Join.prototype.build = function() {
  const sqlstring = join(this.conditions, {
    table: this.table,
    joinTable: this.joinTable,
    type: this.type,
    limit: this._limit,
    offset: this._offset,
    sort: this._sort,
    select: this._select,
  });
  return sqlstring;
};

Join.prototype.exec = function(cb) {
  const sqlstring = this.build();
  return this.model.query(sqlstring, {}, cb);
};

Join.prototype.then = function(cb) {
   return this.exec().then(cb);
};

Join.prototype.limit = function(value) {
   this._limit = value;
};

Join.prototype.skip = function(value) {
  this._offset = value;
};

module.exports = Join;