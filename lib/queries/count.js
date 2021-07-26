'use strict';

const where = require('./where');
const util = require('../util');

const count = (field = '*', filter = {}, model) => {
  
  if(typeof field === 'object') {
    filter = field;
    field = '*';
  };
  
  const conditions = where(filter);
  return util.joinString('SELECT', `COUNT(${field})`, 'FROM', model.table, conditions);
  
};

module.exports = count;