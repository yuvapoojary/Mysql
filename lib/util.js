'use strict';

const operators = require('./Operators');

const objectToSqlstring = (obj) => {
  const fieldAndValues = [];
  for (const key in obj) {
    const string = operators(key, obj, objectToSqlstring);
    fieldAndValues.push(string);
  };
  return fieldAndValues.join(' AND ');
};

const joinString = (...args) => {
  let finalstring = [];
  for(const string of args) {
    if(string) finalstring.push(string);
  };
  return finalstring.join(' ');
};

const isJson = (value) => { 
  if(typeof value === 'object') {
    return true;
  };
};

module.exports = {
  objectToSqlstring,
  joinString,
  isJson
};