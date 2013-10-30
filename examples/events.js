var vkApi = require('../lib/vk-api');
var connect = require('connect');
var url = require('url');

var APPID = 3961887;
var APPSECRET = 'YOUR SECRET HERE';
var REDIRECT_URL = 'http://localhost';

var VK = new vkApi({appID: APPID, appSecret: APPSECRET}, REDIRECT_URL);

var port = 3000;

connect()
    .use(connect.favicon())
    .use(connect.cookieParser())
    .use(connect.bodyParser())
    .use(function(req,res,next) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        if(query.code === undefined) {
            if(VK.token === '') {
                res.write('<a href="https://oauth.vk.com/authorize?client_id='+APPID+'&redirect_uri=http://localhost&response_type=code&v=5.2">Sign in</a>');
                res.end();
            }
        } else {
            VK.setCode(query.code);
            VK.init(function() {
                VK.api('users.get', {id: VK.userId, fields: 'nickname,screen_name', lang: 'en'});
            });
        }
        VK.on('initCall', function(err) {
            if(!err)
                res.write('Init Success');
            else
                res.write(JSON.stringify(err));
        });

        VK.on('apiCall', function(err,result) {
            if(err)
                res.write(JSON.stringify(err));
            else
                res.write('Api call success: '+JSON.stringify(result));
            res.end();
        });
    })
    .listen(port);

console.log('Listening for http requests on port ' + port);