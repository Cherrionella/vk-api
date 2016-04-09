# vk-api [![Build Status](https://secure.travis-ci.org/Andromant/vk-api.png?branch=master)](http://travis-ci.org/Andromant/vk-api)

VK API wrapper for NodeJS

Feel free to use it.
If you have any wishes, you can post it there on GitHub

## Getting Started
Install the module with: `npm install vk-api`

```javascript
var vk_api = require('vk-api');
var VK = new vk_api({appID: APPID, appSecret: APPSECRET}, REDIRECT_URL);
VK.api('users.get', {id: 1234, lang: 'en'}, function(err,result) {
    //Some processing
});
```

=======

Or if you want to take User id

```javascript
var vk_api = require('vk-api');
var VK = new vk_api({appID: APPID, appSecret: APPSECRET}, REDIRECT_URL);
VK.init(function(err) {
    VK.api('users.get', {id: VK.userId, lang: 'en'}, function(err,result) {
        //Some processing
    });
});
```

=======

Authorization with access token

```javascript
var vk_api = require('vk-api');
var VK = new vk_api({appID: APPID, appSecret: APPSECRET}, null, null, ACCESS_TOKEN);
VK.init(function(err) {
    VK.api('users.get', {id: VK.userId, lang: 'en'}, function(err,result) {
        //Some processing
    });
});
```

## Documentation
_(Coming soon)_

## Examples
See examples directory

## Release History
0.1.0 - 10/30/2013

## License
Copyright (c) 2013 Andromant  
Licensed under the MIT license.
