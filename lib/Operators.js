'use strict';

const operator = (key, obj, toSqlstring) => {

  const value = obj[key];
  
  if(key.toLowerCase() == '$or') {
    if(!Array.isArray(value)) throw new Error('$OR operator must be an array');
    let paths = [];
    for(const item of value) {
      const string = toSqlstring(item);
      paths.push(string);
    };
    return `(${paths.join(') OR (')})`;
  };
  
  if (value === null) {
    return `${key} IS NULL`
  };

  if (typeof value === 'string' || typeof value === 'number') {
    return `${key} = '${value}'`
  };
  
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const keys = Object.keys(value);
    if (keys.length > 1) throw new Error('Special operator object must have single property');
    return getOperatorStatement(key, keys[0], value[keys[0]]);
  };
  
  throw new Error('Query was not handled by the library');

};

const getOperatorStatement = (key, operator, value) => {
  return '';
};

module.exports = operator;