'use strict';

const operators = require('./Operators');
const util = require('./util');
const where = require('./queries/where');

function Query(conditions, options = {}, model, command) {
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
  this.parseOptions(options);
};

Query.prototype.constructor = Query;

Query.prototype.parseOptions = function(options) {
  if(options.limit) this._limit = options.limit;
  if(options.offset) this._offset = options.offset;
  if(options.select) this._select = options.select;
};

Query.prototype.build = function(raw) {
  const condition = where(this.filter);
  const limit = this._limit && 'LIMIT ' + this._limit;
  const offset = this._offset && 'OFFSET ' + this._offset;
  
  if(raw) return {
    condition,
    limit,
    offset,
    select: this._select
  };
  return util.joinString('SELECT', this._select, 'FROM', this.table, condition, limit, offset);
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

Query.prototype.then = function() {
  const sqlstring = this.build();
  return this.query(sqlstring, this.options);
};

Query.prototype.exec = function(cb) {
  const sqlstring = this.build();
  return this.query(sqlstring, this.options, cb);
};




module.exports = Query;