'use strict';

const operators = require('./Operators');
const util = require('./util');

function Query(conditions, options, model, command) {
  this.model = model;
  this.schema = model.schema;
  this.table = model.table;
  this.query = model.query.bind(model);
  this.options = options;
  this.raw = null;
  this._select = '*';
  this.filter = conditions;
  this.conditions = '';
  this._lean = false;
  this._limit = null;
  this._offset = 0;
};

Query.prototype.constructor = Query;

Query.prototype.build = function() {
  const condition = util.objectToSqlstring(this.filter);
  return `SELECT ${this._select} FROM ${this.table} WHERE ${condition} ${this._limit ? 'LIMIT ' + this._limit : ''} OFFSET ${this._offset}`;
};

Query.prototype.lean = function() {
  this.lean = true;
  return this;
};

Query.prototype.select = function(obj) {
  let fields = [];

  if (typeof obj == 'object') {
    fields = Object.keys(obj);
  };

  if (typeof obj == 'string') {
    fields = obj.split(' ');
  };

  if (fields.length) {
    this._select = fields.join(',');
  };

  return this;

};

Query.prototype.limit = function(limit) {
  this._limit = limit;
  return this;
};

Query.prototype.skip = function(offset) {
  this._offset = offset;
  return this;
};

Query.prototype.exec = function(cb) {
  const sqlstring = this.build();
  return this.query(sqlstring, cb);
};




module.exports = Query;