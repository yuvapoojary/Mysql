'use strict';

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
  joinString,
  isJson
};