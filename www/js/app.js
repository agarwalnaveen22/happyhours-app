var apiUrl = "http://seoexpertindian.com/happyhours/webservices/";
//var apiUrl = "http://localhost/happyhours/webservices/";
var webUrl = "http://seoexpertindian.com/happyhours/";
//var webUrl = "http://localhost/happyhours/";
var userInfo = {};
var lat = '';
var lng = '';

function showLoader($ionicLoading) {
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
}

function hideLoader($ionicLoading) {
    $ionicLoading.hide();
}

angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives', 'starter.services', 'ngCordova'])

.run(function ($ionicPlatform, $state) {
    $ionicPlatform.ready(function () {

        navigator.splashscreen.hide();

        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true)
        }
        if (window.StatusBar) {
            StatusBar.styleLightContent();
        }
    })
})

.filter('capitalize', function () {
        return function (input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    })
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.form.toggle('large').checkbox('circle');
        $ionicConfigProvider.views.maxCache(0);
        $stateProvider


            .state('customersupport', {
            url: '/customersupport',
            templateUrl: 'templates/customersupport.html',
            controller: 'bookconfirmController'
        })

        .state('terms', {
            url: '/terms',
            templateUrl: 'templates/terms.html'
        })

        .state('history', {
                url: '/history',
                templateUrl: 'templates/history.html',
                controller: 'historyController',
                params: {
                    data: []
                }
            })
            .state('bookconfirm', {
                url: '/bookconfirm/:id/:orderId',
                templateUrl: 'templates/bookconfirm.html',
                controller: 'bookconfirmController'

            })


        .state('book', {
                url: '/book/:id',
                templateUrl: 'templates/book.html',
                controller: 'bookController'
            })
            .state('map', {
                url: '/maps',
                templateUrl: 'templates/map.html',
                controller: 'mapController',
                resolve: {
                    position: function ($cordovaGeolocation) {
                        var options = {
                            timeout: 10000,
                            enableHighAccuracy: true
                        };
                        return $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                            return position;
                        });
                    }
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginController'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'templates/signup.html',
                controller: 'signupController'
            })

        .state('deal', {
            url: '/deal/:id',
            templateUrl: 'templates/deal.html',
            controller: 'dealController'
        })

        .state('homepage', {
            url: '/homepage',
            templateUrl: 'templates/homepage.html',
            controller: 'homeController'
        })

        .state('profile', {
            url: '/profile',
            templateUrl: 'templates/profile.html',
            controller: 'profileController'
        })

        .state('forget', {
            url: '/forget',
            templateUrl: 'templates/forget.html',
            controller: 'forgetController'
        })
        $urlRouterProvider.otherwise('/login');

    })