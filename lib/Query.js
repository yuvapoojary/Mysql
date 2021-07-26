'use strict';

const util = require('./util');
const where = require('./queries/where');
const find = require('./queries/find');

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
  this._sort = null;
  this.parseOptions(options);
};

Query.prototype.constructor = Query;

Query.prototype.parseOptions = function(options) {
  if(options.limit) this._limit = options.limit;
  if(options.offset) this._offset = options.offset;
  if(options.select) this._select = options.select;
};

Query.prototype.build = function() {
  
  const sqlstring = find(this.filter, {
    ...this.options,
    limit: this._limit,
    offset: this._offset,
    sort: this._sort,
    select: this._select
  }, this.model);
  return sqlstring;
  
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

Query.prototype.sort = function(sort) {
  this._sort = sort;
  return this;
};

Query.prototype.then = function(cb) {
  const sqlstring = this.build();
  return this.query(sqlstring, this.options).then(cb);
};

Query.prototype.distinct = function(colnames) {
  if(!colnames) throw new Error('Column name is required');
  this._distinct = util.joinString('DISTINCT', colnames.split(/[ ,]+/).join(','));
};

Query.prototype.exec = function(cb) {
  const sqlstring = this.build();
  return this.query(sqlstring, this.options, cb);
};




module.exports = Query;