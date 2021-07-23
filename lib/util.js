'use strict';

const operators = require('./Operators');

const objectToSqlstring = (obj) => {
  const fieldAndValues = [];
  for (const key in obj) {
    const string = operators(key, obj);
    fieldAndValues.push(string);
  };
  return fieldAndValues.join(' AND ');
};

module.exports = {
  objectToSqlstring
};