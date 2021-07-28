'use strict';

const Select = (obj) => {
  
  let fields = [];
  
  if (typeof obj == 'object') {
    fields = Object.keys(obj);
  };

  if (typeof obj == 'string') {
    fields = obj.split(/[ ,]+/);
  };

  if (fields.length) {
    return fields.join(',');
  };
  
};

module.exports = Select;