var ws = require('ws').Server;
var fs = require('fs');
var eventEmitter = require('events').EventEmitter;
var Notify = require('fs.notify');
var path = require('path');

var timeout;
var dirs = ['views', 'public'];
var fileRegex = /\.(html|ejs|css|js|sass)$/i;

var emitter = new eventEmitter;
var wss = new ws({port: 9000});
var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                }
                else {
                    if (fileRegex.test(file)) {
                        results.push(file);
                    }
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

dirs.forEach(function(dir) {
    walk(dir, function(err, files) {
        var notifications = new Notify(files);
        notifications.on('change', function(file) {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                emitter.emit('reload');
            }, 500);
        });
    });
});

wss.on('connection', function(ws) {
    emitter.once('reload', function() {
        ws.send(JSON.stringify({r:Date.now().toString()}), function(e) {
            if (!e) return;
            console.log(e);
        });
    });
});

console.log('Start watching on 127.0.0.1:9000 on ' + dirs.join(', '));
