/*
 * vk-api
 * https://github.com/Andromant/node-vk
 *
 * Copyright (c) 2013 Andromant
 * Licensed under the MIT license.
 */

'use strict';

var https = require('https'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

var self = {};

/**
 * VK object.
 * You can call init function if you want to know user's ID from beginning
 * But you can still call api function after creating object
 * all functions return "self" context to make chained requests
 * List of events it emits:
 * initCall, apiCall
 */
function VK(options, redirectUri, code, token) {
    EventEmitter.call(self);
    self = this;
    if (options === undefined)
        throw 'No options passed to constructor';
    if (options.appID === undefined || options.appSecret === undefined)
        throw 'Wrong options';
    if (options.mode === 'undefined' || !(options.mode === 'oauth' || options.mode === 'sig'))
        options.mode = 'oauth';
    self.options = options;
    self.code = code || '';
    self.token = token || '';
    self.redirectUri = redirectUri || 'http://localhost';
    self.userId = 0;
}

VK.prototype = {
    API_VERSION: '5.2',
    AUTH_URL: 'https://oauth.vk.com/access_token',
    API_URL: 'https://api.vk.com/method/',
    api: function (method, params, callback) {
        if (callback === undefined || !(typeof callback === 'function'))
            callback = function () {};
        if(self.token === '')
            self.init(function() {
                self._apiCall(method,params,callback);
            });
        else
            self._apiCall(method,params,callback);

        return self;
    },
    _apiCall: function (method, params, callback) {
        var url = self.API_URL + method + '?v=' + self.API_VERSION + '&access_token=' + self.token;
        for (var key in params) {
            url += ('&' + key + '=' + params[key]);
        }
        https.get(url, function (res) {
            var apiResponse = '';
            res.setEncoding('utf-8');

            res.on('data', function (chunk) {
                apiResponse += chunk;
            });

            res.on('end', function () {
                var json = JSON.parse(apiResponse);
                if (json.error) {
                    self.emit('apiCall', json, null);
                    callback(json, null);
                } else {
                    self.emit('apiCall', null, json);
                    callback(null, json);
                }
            });
        });
    },
    setCode: function (code) {
        self.code = code;
        return self;
    },
    setToken: function (token) {
        self.token = token;
    },
    init: function (callback) {
        if (callback === undefined || !(typeof callback === 'function'))
            callback = function () {};
        var url = self.AUTH_URL + '?client_id=' + self.options.appID + '&client_secret=' + self.options.appSecret + '&code=' + self.code + '&redirect_uri=' + self.redirectUri;
        https.get(url, function (res) {
            var apiResponse = '';
            res.setEncoding('utf-8');

            res.on('data', function (chunk) {
                apiResponse += chunk;
            });

            res.on('end', function () {
                if (res.statusCode > 200) {
                    self.emit('initError', {error_code: res.statusCode, error_msg: apiResponse});
                    callback({error_code: res.statusCode, error_msg: apiResponse});
                } else {
                    var json = JSON.parse(apiResponse);
                    if (!json.access_token) {
                        self.emit('initCall', json);
                        callback(json);
                    } else {
                        self.token = json.access_token;
                        self.userId = json.user_id;
                        self.emit('initCall', null);
                        callback(null);
                    }
                }
            });
        });
        return self;
    }
};

VK.prototype.__proto__ = EventEmitter.prototype;

module.exports = VK;
