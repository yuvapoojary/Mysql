'use strict';

function Schema(obj) {
  this.obj = obj;
};

Schema.prototype.constructor = Schema;

module.exports = Schema;