'use strict';

const util = require('../util');
const where = require('./where');
const sortBy = require('./sort');

const find = (filter, options, table) => {
  
  const conditions = model.setFilterCache(filter, options);
  const limit = options.limit && `LIMIT ${options.limit}`;
  const offset = options.offset && `OFFSET ${options.offset}`;
  const select = options.select;
  const distinct = options.distinct;
  const sort = sortBy(options.sort);
  
  return util.joinString('SELECT', distinct || select, 'FROM', table.name, conditions, limit, offset, sort);
  
};

module.exports = find;