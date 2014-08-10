var title = 'Muqq Platform';
//var AWS = require('aws-sdk');
//var uuid = require('node-uuid');
//var request = require('request');
//var fs = require('fs'); 
//AWS.config.loadFromPath('./config.json');

exports.index = function(req, res) {
    res.render('layout', {title: title, content:'home'});
};

/*
exports.readFile = function(req, res) {
  //console.log(req);
  var tempPath = req.files.file.path;
  fs.readFile(tempPath, 'utf8', function(err,data){
    if (err){
      throw err;
    }
    var array = [] ;
    
    data = data.replace(/\n/g,"");
    console.log(data);
    var lines = data.split('\r');
    lines.forEach(function(obj){

      
      var jsondata = obj.toString().split('\t');

      var newobj = {
        catid : jsondata[0],
        prodid : jsondata[1],
        et : jsondata[2],
        serial : jsondata[3]
      }
      array.push(newobj);
    });
    //console.log(JSON.stringify(array));
  res.write(JSON.stringify(array));
  res.end();
  });
};
*/
/**
 * CMS pages
 */
exports.StoreManagement = function(req, res) {
    res.render('layout', {title: title, content:'StoreManagement'});
};
exports.StoreManagementDetail = function(req, res) {
    res.render('layout', {title: title, content:'StoreManagementDetail'});
};
exports.NewsPage = function(req, res) {
    res.render('layout', {title: title, content:'NewsPage'});
};