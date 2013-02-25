var express = require('express');
var http = require('http');

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(express.static(__dirname + '/public/'));
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port', app.get('port'));
});
