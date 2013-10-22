'use strict';

angular.module('easyForms').
  factory('efUtils', function() {

    var utils = {};

    utils.isResource = function(obj) {
      return obj.save != undefined && obj.query != undefined;
    };

    return utils;

  });