'use strict';

const operators = require('./Operators');

function Query(conditions, options, model, command) {
  this.model = model;
  this.schema = model.schema;
  this.table = model.table;
  this.query = model.query.bind(model);
  this.options = options;
  this.raw = null;
  this.select = '*';
  this.filter = conditions;
  this.conditions = '';
  this.lean = false;
  this.limit = null;
  this.offset = 0;
};

Query.prototype.constructor = Query;

Query.prototype.build = function() {
  const condition = Query.objectToSqlstring(this.filter);
  return `SELECT ${this.select} FROM ${this.table} WHERE ${condition} ${this.limit ? 'LIMIT ' + this.limit : ''} OFFSET ${this.offset}`;
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
  
  fields = ['*'];
  
  this.select = fields.join(',');
  return this;

};

Query.prototype.limit = function(limit) {
  this.limit = limit;
  return this;
};

Query.prototype.skip = function(offset) {
  this.offset = offset;
  return this;
};

Query.prototype.exec = function(cb) {
  const sqlstring = this.build();
  return this.query(sqlstring, cb);
};

Query.objectToSqlstring = (obj) => {
  const fieldAndValues = [];
  for(const key in obj) {
    const string = operators(key, obj);
    fieldAndValues.push(string);
  };
  return fieldAndValues.join(' AND ');
};


module.exports = Query;