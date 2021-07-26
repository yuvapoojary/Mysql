'use strict';

const util = require('../util');
const where = require('./where');

const update = (filter = {}, update, options = {}, model) => {

  const whereclause = where(filter);
  const limit = options.limit;
  const offset = options.offset;
  const fields = Object.keys(update);
  const values = fields.map((field) => {
      return `${field} = '${update[field]}'`;
    })
    .join(',');

  const sqlstring = util.joinString('UPDATE', model.table, 'SET', values, whereclause, limit && `LIMIT ${limit}`, options.offset && `OFFSET ${offset}`);
  return sqlstring;

};

module.exports = update;