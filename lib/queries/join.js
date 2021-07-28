'use strict';

const util = require('../util');
const select = require('./select');
const sort = require('./sort');

const Join = (conditions, options) => {
  
  const limit = options.limit && `LIMIT ${options.limit}`;
  const offset = options.offset && `OFFSET ${options.offset}`;
  const sortBy = options.sort && sort(options.sort);
  
  return util.joinString('SELECT', select(options.select) || '*', 'FROM', options.table, options.type, 'JOIN', options.joinTable, 'ON', conditions.join(' AND '), limit, offset, sortBy);
  
};

module.exports = Join;