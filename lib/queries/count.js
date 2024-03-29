'use strict';

const where = require('./where');
const util = require('../util');

const count = (field = '*', filter = {}, table) => {
  
  if(typeof field === 'object') {
    filter = field;
    field = '*';
  };
  
  const conditions = where(filter);
  return util.joinString('SELECT', `COUNT(${field}) AS count`, 'FROM', table.name, conditions);
  
};

module.exports = count;