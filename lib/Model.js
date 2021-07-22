'use strict';

function Model(name, schema, base) {
  this.base = base;
  this.table = name;
  this.schema = schema;
};

Model.prototype.constructor = Model;


Model.prototype.insertOne = function(obj, options = {}, cb) {
  
  const fields = Object.keys(obj).join(',');
  const values = Object.values(obj).join(',');
  const query = 'INSERT INTO ' + this.table + ' (' + fields + ') ' + 'values(' + values + ')';
  this.base.pool.query(query, cb);
  
};

module.exports = Model;