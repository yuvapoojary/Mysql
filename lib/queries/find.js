'use strict';

const util = require('../util');
const where = require('./where');
const sortBy = require('./sort');

const find = (filter, options, model) => {
  
  const key = JSON.stringify(filter);
  const conditions = model.queryCache[key] || where(filter);
  const limit = options.limit && `LIMIT ${options.limit}`;
  const offset = options.offset && `OFFSET ${options.offset}`;
  const select = options.select;
  const distinct = options.distinct;
  const sort = sortBy(options.sort);
  model.queryCache[key] = conditions;
  
  return util.joinString('SELECT', distinct || select, 'FROM', model.table, conditions, limit, offset, sort);
  
};

module.exports = find;