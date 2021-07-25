'use strict';

const util = require('../util');

const extract = (key, value) => {

  if (key.includes('.')) {
    return jsonExtract(key, value);
  };

  if (key.startsWith('$')) {
    return SpecialOperator(key, value);
  };

  if (value === null) {
    return `${key} IS NULL`;
  };

  return `${key} = "${value}"`;

};

const Where = (filter, sub = false) => {
  let strings = [];
  for(const key in filter) {
    const value = extract(key, filter[key]);
    if(value) strings.push(value);
  };
  const condition = strings.join(' AND ');
  if(sub) return condition;
  return 'WHERE ' + condition;
};

const SpecialOperator = (operator, value) => {

  if (operator.toLowerCase() == '$or') {
    if (!Array.isArray(value)) throw new Error('$OR operator must be an array');
    let paths = [];
    for (const item of value) {
      const string = Where(item, true);
      paths.push(string);
    };
    return `(${paths.join(') OR (')})`;
  };

};

const jsonExtract = (key, value) => {
  
};

module.exports = Where;