'use strict';

const util = require('../util');
const where = require('./where');

const Update = (filter = {}, update, options = {}, table) => {
  
  const whereclause = model.setFilterCache(filter, options);
  const limit = options.limit;
  const offset = options.offset;
  const fields = Object.keys(update);
  const values = fields.map((field) => {
      return `${field} = '${update[field]}'`;
    })
    .join(',');

  const sqlstring = util.joinString('UPDATE', table.name, 'SET', values, whereclause, limit && `LIMIT ${limit}`, options.offset && `OFFSET ${offset}`);
  return sqlstring;

};

module.exports = Update;