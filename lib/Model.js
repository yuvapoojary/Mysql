'use strict';

function Model(name, schema, base) {
  this.base = base;
  this.table = name;
  this.schema = schema;
};

Model.prototype.constructor = Model;

Model.prototype.query = function(query, options, cb) {
  
  if(!this.base.pool) throw new Error('Mysql is not connected to the server, connect it through mysql.createPool(..)');
  if (typeof options === 'function') cb = options;
  
  if (typeof cb === 'function') return this.base.pool(query, cb);
  
  return new Promise((resolve, reject) => {
    this.base.pool(query, (err, data) => {
      if (err) return reject(new Error(err));
      resolve(data);
    });
  });
  
};

Model.prototype.insertOne = function(obj, options = {}, cb) {

  const fields = Object.keys(obj).join(',');
  const values = Object.values(obj).join(',');
  const query = 'INSERT INTO ' + this.table + ' (' + fields + ') ' + 'values(' + values + ')';
  return this.query(arguments);

};

module.exports = Model;