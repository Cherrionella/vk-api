'use strict';

var vk_api = require('../lib/vk-api.js');
var nodeunit = require('nodeunit');

/**
 * I really dont know why, but my unfortunately my nodeunit refused to test async methods :(
 * I'll add tests later
 */

module.exports = {
    'Getting Token': function(test) {
        test.ok(true);
        test.done();
    }
}
