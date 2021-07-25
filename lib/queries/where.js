'use strict';

const util = require('../util');

const extract = (key, value) => {

  if (key.includes('.')) {
    return jsonExtract(key, value);
  };

  if (key.startsWith('$')) {
    return SpecialOperators(key, value);
  };

  if (value === null) {
    return `${key} IS NULL`;
  };
  
  if(util.isJson(value)) {
     return FieldOperators(key, value);
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

const SpecialOperators = (operator, value) => {

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

const FieldOperators = (key, obj) => {
  const strings = [];
  for(const field in obj) {
    const value = obj[field];
    
    if(field === '$gt') {
      strings.push(util.joinString(key, '>', `'${value}'`));
    };
    
    if (field === '$lt') {
      strings.push(util.joinString(key, '<', `'${value}'`));
    };
    
    if (field === '$gte') {
      strings.push(util.joinString(key, '>=', `'${value}'`));
    };
    
    if(field === '$lte') {
      strings.push(util.joinString(key, '<=', `'${value}'`));
    };
    
    if(field === '$ne') {
      strings.push(util.joinString(key, '!='< `'${value}'`));
    };
    
    if(field === '$btw') {
      strings.push(util.joinString(key, 'BETWEEN', `${value[0]} AND ${value[1]}`));
    };
    
    if(field === '$like') {
      strings.push(util.joinString(key, 'LIKE', `'${value}'`));
    };
    
    if(field === '$in') {
      strings.push(util.joinString(key, 'IN', `(${value.join(',')})`))
    };
    
    
  };
  
  return strings.join(' AND ');
};

const jsonExtract = (key, value) => {
  
  const [field, property] = key.split('');
  const newkey = `${key}->>'${property}'`;
  return Where({ newkey: value }, true);
};

module.exports = Where;