angular.module('starter.services', [])

.factory('geolocation',function($http,$cordovaGeolocation){
  var geo={};
  geo.currentLocation=function(lat,long){
     return $http.post('/home',{
       lat:lat,
       long:long
     })
   }
   return geo;
})
