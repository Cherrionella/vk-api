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
            VK.init(function(err) {
                res.write('Code: '+query.code+'<br/>');
                if(!err) {
                    VK.api('users.get', {id: VK.userId, fields: 'nickname,screen_name', lang: 'en'}, function(err, result) {
                        if(err)
                            res.write('<p color="red">Error during api call: '+err.error.code+' '+err.error.error_msg);
                        else {
                            res.write('Success Call: ' + JSON.stringify(result));
                        }
                        res.end();
                    });
                }
                else {
                    res.write(JSON.stringify(err));
                    res.end();
                }
            });
        }
    })
    .listen(port);

console.log('Listening for http requests on port ' + port);