'use strict';

var apiServer = 'http://54.199.238.145:8080/api/'; // Staging

var opApp = angular.module('opApp', [
    'angularFileUpload',
    '$strap.directives',
    'opControllers'
], function($locationProvider) {
    $locationProvider.html5Mode(true);
});

var opControllers = angular.module('opControllers', []);


// Nav controller
opControllers.controller('op-nav-control', ['$scope', 
    function($scope) {
        $scope.onNav = function(path) {
            window.location.href = path;
        }
    }
]);


opControllers.controller('op-home-control', ['$scope', '$http',
    function($scope, $http) {

    }
]);

opControllers.controller('op-store-control', ['$scope', '$http','$fileUploader', '$model',
    function($scope, $http, $fileUploader, $model) {
        var fetchStores = function(){
            $model.Store.fetchStores(function(err, data){
                if(err) errorAlert(err);
                else{
                    $scope.stores = data ; 
                    $scope.isCreate = true;
                    $scope.Store = {};
                    $('#showFilename').text("");
                    $('#account').prop('readonly', false);
                }
            });            
        }

        var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,          // to automatically update the html. Default: $rootScope
            //'/uploadProduct',
        });

        uploader.bind('afteraddingfile', function (event, item) {
            console.log(item);
            var reader = new FileReader();
            reader.onload = onLoadFile ;
            reader.readAsDataURL(item.file);
            function onLoadFile(event){
                $scope.$apply(function() {
                    checkItem($scope, "fileItem");
                    $scope.fileItem = item;
                    $scope.fileItem.url = apiServer + 'UploadImage?s3Path=icon/&contentType=' + item.file.type +'&fileExtension=' + item.file.type.replace('image/','.');
                    console.log($scope.fileItem.url);
                    $scope.Store.icon = event.target.result;
                });
            }
        });  

        uploader.bind('complete', function (event, xhr, item, response) {
            console.log(response);
            response.url = response.url.replace(/"/g,'') ;
            var url = apiServer + ($scope.isCreate ? 'CreateStore' : 'UpdateStore'); 
            $scope.Store.icon = response.url ;
            postData(url);
        });

        function postData(url) {
            $model.postData(url, $scope.Store, config, function(err, res){
                if(err) errorAlert(err);
                else{
                    console.log(res);
                    fetchStores();
                }
            });
        } 

        $scope.dataUpdate = function(storeid){
            $scope.isCreate = false ;
            checkItem($scope, "fileItem");
            $('#showFilename').text("");
            $('#account').prop('readonly', true);
            var findArray = _.findIndex($scope.stores, {'storeid':storeid});
            $scope.Store = _.clone($scope.stores[findArray]);
            window.location.href = '#top';
        }

        $scope.submita = function(){
            if (!checkStore($scope.Store)) errorAlert('請輸入完整');
            else{
                if ($scope.fileItem.file) {        
                    $scope.fileItem.upload();
                }
                else {
                    postData(apiServer +'UpdateStore');
                }     
            }
        }

        $scope.createForm = function(){
            $scope.isCreate = true ;
            $('#account').prop('readonly', false);
            checkItem($scope, "fileItem");
            $scope.Store = {}; 
            $('#showFilename').text("");
        }

        fetchStores();
        $('#account').prop('readonly', false);
        $scope.fileItem = {};
        $scope.isCreate = true ;
        $('#btn-upload').click(function(e){
            e.preventDefault();
            $('#fileUpload').click();
        });
        $('#fileUpload').on('change',function(){
            var filename = $(this).val();
            $('#showFilename').text(filename);
        });
    }
]);
opControllers.controller('op-storeDetail-control', ['$scope', '$http','$fileUploader', '$model',
    function($scope, $http, $fileUploader, $model) {
        var fetchStores = function(){
            $model.Store.fetchStores(function(err, data){
                if(err) errorAlert(err);
                else{
                    $scope.details = data ;
                    $scope.storeDetails = data[0];
                    $scope.Store = {};
                    $scope.Store.storeid = $scope.storeDetails.storeid ;
                    fetchShops() ;
                    $('#name').prop('readonly', false);
                }
            });            
        }

        var fetchShops = function(){
            $model.StoreDetail.fetchShops($scope.Store.storeid, function(err, data){
                if (err) errorAlert(err);
                else{
                    $scope.stores = data ;
                    $('#showFilename').text("");
                    $('#showFilename1').text("");
                    $scope.Store.address = "";
                    $scope.Store.number = "" ;
                    checkItem($scope, "imageItem");
                    checkItem($scope, "detailItem");
                }
            });
        }
        $scope.createForm = function(){
            $scope.isCreate = true ;
            $('#name').prop('readonly', false);
            checkItem($scope, "imageItem");
            checkItem($scope, "detailItem");
            $scope.Store = {}; 
            $('#showFilename').text("");
            $('#showFilename1').text("");
            $scope.Store.storeid = $scope.storeDetails.storeid ;
        }
        $scope.selectStore = function(){
            $scope.Store.storeid = $scope.storeDetails.storeid ;
            fetchShops();
        }

        var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,          // to automatically update the html. Default: $rootScope
            //'/uploadProduct',
        });

        uploader.bind('afteraddingfile', function (event, item) {
            console.log(item);
            var reader = new FileReader();
            reader.onload = onLoadFile ;
            reader.readAsDataURL(item.file);
            function onLoadFile(event){
                $scope.$apply(function() {
                    if (item.name =="image"){
                        checkItem($scope, "imageItem");
                        $scope.imageItem = item;
                        $scope.imageItem.url = apiServer + 'UploadImage?s3Path=image/&contentType=' + item.file.type +'&fileExtension=' + item.file.type.replace('image/','.');
                        console.log($scope.imageItem.url);
                        $scope.Store.image = event.target.result;
                    }else{
                        checkItem($scope, "detailItem");
                        $scope.detailItem = item;
                        $scope.detailItem.url = apiServer + 'UploadImage?s3Path=detail/&contentType=' + item.file.type +'&fileExtension=' + item.file.type.replace('image/','.');
                        console.log($scope.detailItem.url);
                        $scope.Store.detail = event.target.result;
                    }
                });
            }
        });

        uploader.bind('complete', function (event, xhr, item, response) {
            console.log(response);
            response.url = response.url.replace(/"/g,'') ;        
            if(response.category == "image/")
                $scope.Store.image = response.url ;
            else
                $scope.Store.detail = response.url ;
            //postData(url);
        });
        uploader.bind('completeall', function (event, items) {
            console.info('Complete all', items);
            
            var url = apiServer + ($scope.isCreate ? 'CreateStoreDetail' : 'UpdateStoreDetail'); 
            postData(url);
        });

        function postData(url) {
            console.log($scope.Store);
            $model.postData(url, $scope.Store, config, function(err, res){
                if(err) errorAlert(err);
                else{
                    console.log(res);
                    fetchStores();
                }
            });
        } 

        $scope.dataUpdate = function(storeid){
            $scope.isCreate = false ;
            checkItem($scope, "imageItem");
            checkItem($scope, "detailItem");
            $('#showFilename').text("");
            $('#showFilename1').text("");
            $('#name').prop('readonly', true);
            var findArray = _.findIndex($scope.stores, {'storeid':storeid});
            $scope.Store = _.clone($scope.stores[findArray]);
            window.location.href = '#top';
        }

        $scope.submita = function(){
            if (!checkStoreDetail($scope.Store)) errorAlert('請輸入完整');
            else{
                if ((!$scope.detailItem.file)&&(!$scope.imageItem.file)) {        
                    postData(apiServer +'UpdateStoreDetail');
                }
                else {
                    if($scope.imageItem.file) $scope.imageItem.upload();
                    if($scope.detailItem.file) $scope.detailItem.upload();
                }     
            }
        }

        fetchStores();
        $scope.imageItem = {};
        $scope.detailItem = {};
        $scope.isCreate = true ;
        $('#name').prop('readonly', false);
        $('#btn-upload').click(function(e){
            e.preventDefault();
            $('#fileUpload').click();
        });
        $('#fileUpload').on('change',function(){
            var filename = $(this).val();
            $('#showFilename').text(filename);
        });
        
        $('#btn-upload1').click(function(e){
            e.preventDefault();
            $('#fileUpload1').click();
        });
        $('#fileUpload1').on('change',function(){
            var filename = $(this).val();
            $('#showFilename1').text(filename);
        });

    }
]);
//http config
var config = {
    headers: {
        'Content-Type' : 'application/json',
        'Authorization': 'Basic ZWExMzVkZGIzZGZhNTY0NDMzMGRmYTEwN2FmZjgxNjE=',
    }
}
//error alert
var errorAlert = function(err){
  alert(err);
}
//check read file
var checkItem = function(obj, key){
  if(obj[key].file){
    if(obj[key]){
      obj[key].remove();
      obj[key] = {} ;
    }
  }
}

//check Category input
var checkStore = function(data){
  console.log(data);
  if(!data.discount) return false ;
  if(!data.name) return false ;  
  if(!data.icon) return false ;
  if(!data.category) return false ;
  if(!data.account) return false ;
  if(!data.password) return false ;
  return true ;
}

//check Category input
var checkStoreDetail = function(data){
  console.log(data);
  if(!data.address) return false ;
  if(!data.storeid) return false ;  
  if(!data.image) return false ;
  if(!data.detail) return false ;
  if(!data.name) return false ;
  if(!data.number) return false ;
  if(!checkNumber(data.number)) return false ;
  return true ;
}

var checkNumber = function(item){
    var re = /^[0-9]+$/;
    if(!re.test(item.toString())){
        return false ;
    }else{
        item = parseInt(item);
    }
    if(_.isNumber(item)){
        item = item.toString();
    if((item.indexOf('.') != -1))
        return false;
    }else{
        return false ;
    }
        return true; 
}

opControllers.factory('$model' , function($http){
    return {
        Store : {
            fetchStores : function(callback){           
                $http.get(apiServer + 'ListStores', config).success(function(resp){
                    console.log(resp);
                    if (resp.error) callback(resp.error);
                    else{
                        $http.get(apiServer + 'ListStoresAccount', config).success(function(response){
                            resp.forEach(function(obj){
                                response.forEach(function(newobj){
                                    if(obj.storeid === newobj.storeid){
                                        obj.account = newobj.account;
                                        obj.password = newobj.password;
                                    }
                                });
                            });
                            callback(null, resp);       
                        }).error(function(err){
                            callback(err);
                        });

                    }
                }).error(function(err){
                    callback(err);
                });
                
            }
        },
        StoreDetail : {
            fetchShops : function(storeid, callback){
                $http.get(apiServer + 'ListStoreDetails?storeid=' + storeid, config).success(function(resp){
                    console.log(resp);
                    if(resp.error) callback(resp.erorr);
                    else{
                        callback(null, resp);
                    }
                }).error(function(err){
                    callback(err);
                });
            }
        },
        postData : function(url, data, config, callback){
            $http.post(url, data, config).success(function(resp){
                console.log(resp);
                if(resp.error){
                    callback(resp.error);
                }else
                    callback(null, resp);
            }).error(function(err){
                callback(err);
            });
        }//PostData
    }
});