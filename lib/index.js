'use strict';

const driver = require('mysql');
const Model = require('./Model');
const Schema = require('./Schema');

function Mysql(options) {
  this.models = {};
  this.pool = null;
  this.options = Object.assign({}, options);

};


Mysql.prototype.createPool = function(config) {
  this.pool = driver.createPool(config);
};


Mysql.prototype.model = function(name, schema) {
  this.models[name] = new Model(name, new Schema(schema), this);
};


module.exports = new Mysql();