'use strict';

const Query = require('./Query');

const operator = (key, obj) => {

  const value = obj[key];

  if (typeof value === 'object' && value !== null) {
    const keys = Object.keys(value);
    if (keys.length > 1) throw new Error('Special operator object must have single property');
    return getOperatorStatement(key, keys[0], value[keys[0]]);
  };
  
  if(key.toLowerCase() == '$or') {
    if(!Array.isArray(value)) throw new Error('$OR operator must be an array');
    let paths = [];
    for(const item of value) {
      const string = Query.objectToSqlstring(item);
      paths.push(string);
    };
    return `(${paths.join(') OR (')})`;
  };
  
  if (typeof value === null) {
    return `${key} IS NULL`
  };

  if (typeof value === 'string' || typeof value === 'number') {
    return `${key} = '${value}'`
  };

};

const getOperatorStatement = (key, operator, value) => {
  return '';
};

module.exports = operator;