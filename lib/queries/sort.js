'use strict';

const sort = (obj) => {
  
  const fields = [];

  if (typeof obj === 'string') {
    const array = obj.split(' ');
    for (const item of array) {
      const field = item.slice(1);
      if (item.startsWith('+')) fields.push(`${field} ASC`);
      if (item.startsWith('-')) fields.push(`${field} DESC`);
    };
  };

  if (typeof obj === 'object') {
    for (const field in obj) {
      const value = obj[field];
      if ([1, '1', 'asc', 'ascending'].includes(value)) fields.push(`${field} ASC`);
      if ([-1, '-1', 'desc', 'descending'].includes(value)) fields.push(`${field} DESC`);
    };
  };

  const string = fields.length ? `ORDER BY ${fields.join(',')}` : null;

  return string

};

module.exports = sort;