'use strict';

angular.module('easyForms').
  factory('efUtils', function() {

    var utils = {};

    utils.isResource = function(obj) {
      return obj.save != undefined && obj.query != undefined && obj.get != undefined;
    };

    utils.isRestangularResource = function(obj) {
      return obj.restangularCollection != undefined;
    };

    utils.isRestangularCollection = function(obj) {
      return obj.restangularCollection == true;
    };

    return utils;

  });