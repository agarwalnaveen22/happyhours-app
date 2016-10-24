angular.module('starter.controllers', [])
    .controller('AppCtrl', function ($state, $scope, $rootScope, $ionicHistory, $ionicSideMenuDelegate, $ionicPopup) {
        $scope.logout = function (data) {
            userInfo = {};
            facebookConnectPlugin.getLoginStatus(function (res) {
                if (res.status == 'connected') {
                    facebookConnectPlugin.logout(function () {
                        // $state.go('login');
                    }, function (err) {
                        alert("error:" + err);
                    });
                } else {
                    // $state.go('login')
                }
            }, function (err) {
                alert("error:" + err);
            });

            window.plugins.googleplus.logout(
                function (msg) {
                    //alert(msg); // do something useful instead of alerting
                    //$state.go('login');
                }
            );
            $state.go('login');

        }

        $scope.myGoBack = function () {
            //$ionicHistory.goBack();
            window.history.back();
        };

        $scope.myProfile = function () {
            $state.go('profile')
        }

        $scope.myHistory = function () {
            $state.go('history')
        }

        $scope.gotocustomersupport = function () {
            $state.go('customersupport')
        }

        $scope.gototerms = function () {
            $state.go('terms')
        }

        $scope.gotobook = function (id) {
            $state.go('book', {
                id: id
            });
        }

        $scope.gotodeal = function (id) {
            $state.go('deal', {
                id: id
            });
        }

        $scope.goToPage = function (id) {
            $state.go(id);
        }
        $rootScope.profile_picture = "img/profile.jpg";
    })
    //MAP-CONTROLLER
    .controller('mapController', function ($scope, position, $state, $cordovaGeolocation, $ionicLoading, $rootScope, $http) {
        document.getElementById("map").innerHTML = '';
        // mapper.then(function(position){
        //alert($rootScope.lat+":"+$rootScope.lng);
        var markers = [];
        if ($rootScope.lat != undefined && $rootScope.lng != undefined) {
            var latLng = new google.maps.LatLng($rootScope.lat, $rootScope.lng);
            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            }


            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            var im = 'http://www.robotwoods.com/dev/misc/bluecircle.png';
            var userMarker = new google.maps.Marker({
                position: latLng,
                map: $scope.map,
                icon: im
            })

            if ($rootScope.address != undefined) {
                var address = $rootScope.address;
            } else {
                var address = '';
            }

            var infowindow = new google.maps.InfoWindow({
                content: address
            });

            userMarker.addListener('click', function () {
                infowindow.open($scope.map, userMarker);
            });
            infowindow.open($scope.map, userMarker);
            delete $rootScope.lat;
            delete $rootScope.lng;
        } else {
            showLoader($ionicLoading);
            var responsePromise = $http({
                method: 'POST',
                url: apiUrl + "getAllSuppliers",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            responsePromise.success(function (data, status, headers, config) {
                hideLoader($ionicLoading);
                if (data.status) {

                    for (var i = 0; i < data.data.length; i++) {
                        for (var j = 0; j < data.data[i].Location.length; j++) {
                            var marker = {
                                title: data.data[i].Location[j].landmark,
                                lat: data.data[i].Location[j].lat,
                                lng: data.data[i].Location[j].lng
                            };
                            markers.push(marker);
                        }

                    }
                }
                console.log(markers);
                initializeMaps();
            });
            responsePromise.error(function (data, status, headers, config) {
                hideLoader($ionicLoading);
                var myPopup = $ionicPopup.show({
                    title: 'Error',
                    scope: $scope,
                    template: 'Invalid request',
                    buttons: [
                        {
                            text: 'Cancel'
                        },
                        {
                            text: '<b>OK</b>',
                            type: 'button-assertive'
                        }
         ]
                });
            });
            console.log(position)
                //var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        }







        function initializeMaps() {
            var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var myOptions = {
                zoom: 10,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                disableDefaultUI: true
            };
            var map = new google.maps.Map(document.getElementById("map"), myOptions);
            var infowindow = new google.maps.InfoWindow(),
                marker, i;
            for (i = 0; i < markers.length; i++) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(markers[i].lat, markers[i].lng),
                    map: map
                });
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        infowindow.setContent(markers[i].title);
                        infowindow.open(map, marker);
                    }
                })(marker, i));
            }
        }

        //initializeMaps()

        // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
        /*var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
            this.setZoom(14);
            google.maps.event.removeListener(boundsListener);
        });*/



        //infowindow.open($scope.map, userMarker);
        // }, function(error){
        //   console.log("Could not get location");
        // });
        $scope.centerOnMe = function () {
            if (!$scope.map) {
                return;
            }

            $scope.loading = $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: false
            });

            navigator.geolocation.getCurrentPosition(function (pos) {
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                $ionicLoading.hide();
            }, function (error) {
                alert('Unable to get location: ' + error.message);
            });
        };

        $scope.clickTest = function () {
            alert('Example of infowindow with ng-click')
        };

    }, function (error) {
        console.log("Could not get location");
    })

//BOOKING-CONTROLLER
.controller("bookController", function ($scope, $state, $stateParams, $ionicLoading, $ionicPopup, $http) {
    $scope.isNumber = function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    var dealDetail = {};
    showLoader($ionicLoading);
    var responsePromise = $http({
        method: 'POST',
        url: apiUrl + "getDealDetail",
        data: $.param({
            id: $stateParams.id,
            lat: '',
            lng: ''
        }), // pass in data as strings
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    responsePromise.success(function (data, status, headers, config) {
        hideLoader($ionicLoading);
        if (data.status) {
            dealDetail = data.data;
        } else {
            var myPopup = $ionicPopup.show({
                title: 'Error',
                scope: $scope,
                template: data.message,
                buttons: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: '<b>OK</b>',
                        type: 'button-assertive'
                    }
                ]
            });
        }
    });
    responsePromise.error(function (data, status, headers, config) {
        hideLoader($ionicLoading);
        var myPopup = $ionicPopup.show({
            title: 'Error',
            scope: $scope,
            template: 'Invalid request',
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: '<b>OK</b>',
                    type: 'button-assertive'
                }
            ]
        });
    });

    $scope.submitForm = function () {
        showLoader($ionicLoading);
        var responsePromise = $http({
            method: 'POST',
            url: apiUrl + "paymentProcess",
            data: $("#bookForm").serialize() + "&" + $.param({
                price: dealDetail.Deal.amount,
                id: $stateParams.id,
                user_id: userInfo.User.id
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        responsePromise.success(function (data, status, headers, config) {
            hideLoader($ionicLoading);
            if (data.status) {
                $state.go('bookconfirm', {
                    id: $stateParams.id,
                    orderId: data.data
                });
            } else {
                var myPopup = $ionicPopup.show({
                    title: 'Error',
                    scope: $scope,
                    template: data.message,
                    buttons: [
                        {
                            text: 'Cancel'
                        },
                        {
                            text: '<b>OK</b>',
                            type: 'button-assertive'
                        }
                    ]
                });
            }
        });
        responsePromise.error(function (data, status, headers, config) {
            hideLoader($ionicLoading);
            var myPopup = $ionicPopup.show({
                title: 'Error',
                scope: $scope,
                template: 'Invalid request',
                buttons: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: '<b>OK</b>',
                        type: 'button-assertive'
                    }
                ]
            });
        });
    }


})

.controller("profileController", function ($scope, $state, $ionicLoading, $ionicPopup, $http) {
    $scope.email = userInfo.User.email;
    $scope.first_name = userInfo.UserDetail[0].first_name;
    $scope.last_name = userInfo.UserDetail[0].last_name;
    $scope.phone = userInfo.UserDetail[0].phone;
    $scope.address = userInfo.UserDetail[0].address;
    $scope.postal_code = userInfo.UserDetail[0].postal_code;
    showLoader($ionicLoading);
    var responsePromise = $http({
        method: 'GET',
        url: apiUrl + "getCountries",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    responsePromise.success(function (data, status, headers, config) {
        hideLoader($ionicLoading);
        if (data.status) {
            $scope.countries = data.data;
            setTimeout(function () {
                $scope.country_id = userInfo.UserDetail[0].country_id;
                $scope.$apply();
                $scope.getStates(userInfo.UserDetail[0].country_id);
            }, 1000);

        } else {
            var myPopup = $ionicPopup.show({
                title: 'Error',
                scope: $scope,
                template: data.message,
                buttons: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: '<b>OK</b>',
                        type: 'button-assertive'
                    }
                ]
            });
        }
    });
    responsePromise.error(function (data, status, headers, config) {
        hideLoader($ionicLoading);
        var myPopup = $ionicPopup.show({
            title: 'Error',
            scope: $scope,
            template: 'Invalid request',
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: '<b>OK</b>',
                    type: 'button-assertive'
                }
            ]
        });
    });

    $scope.getStates = function (cid) {
        showLoader($ionicLoading);
        var responsePromise = $http({
            method: 'POST',
            url: apiUrl + "getStates",
            data: $.param({
                id: cid
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        responsePromise.success(function (data, status, headers, config) {
            hideLoader($ionicLoading);
            if (data.status) {
                $scope.states = data.data;
                setTimeout(function () {
                    $scope.state_id = userInfo.UserDetail[0].state_id;
                    $scope.$apply();
                    $scope.getCities(userInfo.UserDetail[0].state_id);
                }, 1000);
            } else {
                var myPopup = $ionicPopup.show({
                    title: 'Error',
                    scope: $scope,
                    template: data.message,
                    buttons: [
                        {
                            text: 'Cancel'
                        },
                        {
                            text: '<b>OK</b>',
                            type: 'button-assertive'
                        }
                    ]
                });
            }
        });
        responsePromise.error(function (data, status, headers, config) {
            hideLoader($ionicLoading);
            var myPopup = $ionicPopup.show({
                title: 'Error',
                scope: $scope,
                template: 'Invalid request',
                buttons: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: '<b>OK</b>',
                        type: 'button-assertive'
                    }
                ]
            });
        });
    }

    $scope.getCities = function (sid) {
        showLoader($ionicLoading);
        var responsePromise = $http({
            method: 'POST',
            url: apiUrl + "getCities",
            data: $.param({
                id: sid
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        responsePromise.success(function (data, status, headers, config) {
            hideLoader($ionicLoading);
            if (data.status) {
                $scope.cities = data.data;
                setTimeout(function () {
                    $scope.city_id = userInfo.UserDetail[0].city_id;
                    $scope.$apply();
                }, 1000);
            } else {
                var myPopup = $ionicPopup.show({
                    title: 'Error',
                    scope: $scope,
                    template: data.message,
                    buttons: [
                        {
                            text: 'Cancel'
                        },
                        {
                            text: '<b>OK</b>',
                            type: 'button-assertive'
                        }
                    ]
                });
            }
        });
        responsePromise.error(function (data, status, headers, config) {
            hideLoader($ionicLoading);
            var myPopup = $ionicPopup.show({
                title: 'Error',
                scope: $scope,
                template: 'Invalid request',
                buttons: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: '<b>OK</b>',
                        type: 'button-assertive'
                    }
                ]
            });
        });
    }

    $scope.submitForm = function () {
        showLoader($ionicLoading);
        var responsePromise = $http({
            method: 'POST',
            url: apiUrl + "updateProfile",
            data: $("#profile").serialize() + "&" + $.param({
                id: userInfo.User.id
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        responsePromise.success(function (data, status, headers, config) {
            hideLoader($ionicLoading);
            if (data.status) {
                var myPopup = $ionicPopup.show({
                    title: 'Success',
                    scope: $scope,
                    template: "Profile updated",
                    buttons: [
                        {
                            text: 'Cancel'
                        },
                        {
                            text: '<b>OK</b>',
                            type: 'button-positive'
                        }
                    ]
                });
            } else {
                var myPopup = $ionicPopup.show({
                    title: 'Error',
                    scope: $scope,
                    template: data.message,
                    buttons: [
                        {
                            text: 'Cancel'
                        },
                        {
                            text: '<b>OK</b>',
                            type: 'button-assertive'
                        }
                    ]
                });
            }
        });
        responsePromise.error(function (data, status, headers, config) {
            hideLoader($ionicLoading);
            var myPopup = $ionicPopup.show({
                title: 'Error',
                scope: $scope,
                template: 'Invalid request',
                buttons: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: '<b>OK</b>',
                        type: 'button-assertive'
                    }
                ]
            });
        });
    }
})


//BOOKING-CONFIRMATION-CONTROLLER
.controller("bookconfirmController", function ($scope, $http, $state, $ionicPopup, $timeout, $ionicLoading, $stateParams) {
    showLoader($ionicLoading);
    var responsePromise = $http({
        method: 'POST',
        url: apiUrl + "getDealDetail",
        data: $.param({
            id: $stateParams.id,
            lat: '',
            lng: ''
        }), // pass in data as strings
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    responsePromise.success(function (data, status, headers, config) {
        hideLoader($ionicLoading);
        if (data.status) {
            $scope.deal = data.data;
            $scope.orderId = $stateParams.orderId;
        } else {
            var myPopup = $ionicPopup.show({
                title: 'Error',
                scope: $scope,
                template: data.message,
                buttons: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: '<b>OK</b>',
                        type: 'button-assertive'
                    }
                ]
            });
        }
    });
    responsePromise.error(function (data, status, headers, config) {
        hideLoader($ionicLoading);
        var myPopup = $ionicPopup.show({
            title: 'Error',
            scope: $scope,
            template: 'Invalid request',
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: '<b>OK</b>',
                    type: 'button-assertive'
                }
            ]
        });
    });
    $scope.showPopup = function () {

        var myPopup = $ionicPopup.show({
            title: 'Do you want to book a cab',
            scope: $scope,
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: '<b>OK</b>',
                    type: 'button-assertive',
                    onTap: function (e) {
                        $state.go("homepage");
                    }
                }
            ]

        });
    };
})

.controller("dealController", function ($scope, $state, $http, $ionicPopup, $ionicLoading, $timeout, $stateParams, $rootScope) {
    showLoader($ionicLoading);
    var responsePromise = $http({
        method: 'POST',
        url: apiUrl + "getDealDetail",
        data: $.param({
            id: $stateParams.id,
            lat: lat,
            lng: lng
        }), // pass in data as strings
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    responsePromise.success(function (data, status, headers, config) {
        hideLoader($ionicLoading);
        if (data.status) {
            $scope.deal = data.data;
            $rootScope.address = data.data.Location.landmark;
            $scope.imageUrl = webUrl + "uploads/";
        } else {
            var myPopup = $ionicPopup.show({
                title: 'Error',
                scope: $scope,
                template: data.message,
                buttons: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: '<b>OK</b>',
                        type: 'button-assertive'
                    }
                ]
            });
        }
    });
    responsePromise.error(function (data, status, headers, config) {
        hideLoader($ionicLoading);
        var myPopup = $ionicPopup.show({
            title: 'Error',
            scope: $scope,
            template: 'Invalid request',
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: '<b>OK</b>',
                    type: 'button-assertive'
                }
            ]
        });
    });

    $scope.goToMap = function (lat, lng) {
        $rootScope.lat = lat;
        $rootScope.lng = lng;
        $state.go('map');
    }
})

//HOME-CONTROLLER
.controller("homeController", function ($rootScope, geolocation, $cordovaGeolocation, $ionicSlideBoxDelegate, $ionicPlatform, $stateParams, $scope, $http, $state, $timeout, $ionicSideMenuDelegate, $ionicLoading, $ionicPopup, $window) {
    $scope.userInfo = userInfo;
    if (userInfo.UserDetail != undefined) {
        if (userInfo.UserDetail[0].profile_picture != '' && userInfo.UserDetail[0].profile_picture != null) {
            $rootScope.profile_picture = webUrl + "uploads/" + userInfo.UserDetail[0].profile_picture;
        } else {
            $rootScope.profile_picture = 'img/profile.jpg';
        }
    } else {
        $rootScope.profile_picture = 'img/profile.jpg';
    }
    //alert($rootScope.profile_picture);
    //alert(JSON.stringify($scope.userInfo));

    var posOptions = {
        timeout: 10000,
        enableHighAccuracy: false
    };
    showLoader($ionicLoading);
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
        //showLoader($ionicLoading);
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        var responsePromise = $http({
            method: 'POST',
            url: apiUrl + "getDealsNearBy",
            data: $.param({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }), // pass in data as strings
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        responsePromise.success(function (data, status, headers, config) {
            hideLoader($ionicLoading);
            if (data.status) {
                $scope.deals = data.data;
                $scope.imageUrl = webUrl + "uploads/";
            } else {
                var myPopup = $ionicPopup.show({
                    title: 'Error',
                    scope: $scope,
                    template: data.message,
                    buttons: [
                        {
                            text: 'Cancel'
                        },
                        {
                            text: '<b>OK</b>',
                            type: 'button-assertive'
                        }
                    ]
                });
            }
        });
        responsePromise.error(function (data, status, headers, config) {
            hideLoader($ionicLoading);
            var myPopup = $ionicPopup.show({
                title: 'Error',
                scope: $scope,
                template: 'Invalid request',
                buttons: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: '<b>OK</b>',
                        type: 'button-assertive'
                    }
                ]
            });
        });
        geolocation.currentLocation(position.coords.latitude, position.coords.longitude).success(function (data) {

        })
    }, function (err) {
        //showLoader($ionicLoading);
        var responsePromise = $http({
            method: 'POST',
            url: apiUrl + "getDealsNearBy",
            data: $.param({
                lat: '',
                lng: ''
            }), // pass in data as strings
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        responsePromise.success(function (data, status, headers, config) {
            hideLoader($ionicLoading);
            if (data.status) {
                $scope.deals = data.data;
                $scope.imageUrl = webUrl + "uploads/";
            } else {
                var myPopup = $ionicPopup.show({
                    title: 'Error',
                    scope: $scope,
                    template: data.message,
                    buttons: [
                        {
                            text: 'Cancel'
                        },
                        {
                            text: '<b>OK</b>',
                            type: 'button-assertive'
                        }
                    ]
                });
            }
        });
        responsePromise.error(function (data, status, headers, config) {
            hideLoader($ionicLoading);
            var myPopup = $ionicPopup.show({
                title: 'Error',
                scope: $scope,
                template: 'Invalid request',
                buttons: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: '<b>OK</b>',
                        type: 'button-assertive'
                    }
                ]
            });
        });
    })


    $scope.gotomaps = function () {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $timeout(function () {
            $ionicLoading.hide();
            $state.go('map')
        }, 1000);

    }



    $scope.navSlide = function (index) {
        $ionicSlideBoxDelegate.slide(index, 500);
    }

    $ionicPlatform.registerBackButtonAction(function () {
        $scope.exitConfirmPopup = function () {
            var alertPopup = $ionicPopup.confirm({
                title: 'Exit!!!',
                template: 'Are You sure you want to exit??',
                scope: $scope
            });
            alertPopup.then(function (res) {
                if (res) {
                    alertPopup.close();
                    navigator.app.exitApp();
                } else {
                    alertPopup.close()
                }
            });
        }
        if ($state.current.name == 'homepage') {
            $scope.exitConfirmPopup();
        } else {
            $ionicHistory.goBack();
        }
    }, 100)

    $scope.left = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };



})

//SIGNUP-CONTROLLER
.controller("signupController", function ($scope, $http, $state, $ionicLoading, $ionicPopup, $timeout) {
    $scope.submitForm = function () {
        showLoader($ionicLoading);
        var responsePromise = $http({
            method: 'POST',
            url: apiUrl + "register",
            data: $('#signupForm').serialize(), // pass in data as strings
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        responsePromise.success(function (data, status, headers, config) {
            hideLoader($ionicLoading);
            if (data.status) {
                var myPopup = $ionicPopup.show({
                    title: 'Success',
                    scope: $scope,
                    template: data.message,
                    buttons: [
                        {
                            text: 'Cancel'
                        },
                        {
                            text: '<b>OK</b>',
                            type: 'button-positive'
                        }
                    ]
                });
                $state.go('login');
            } else {
                var myPopup = $ionicPopup.show({
                    title: 'Error',
                    scope: $scope,
                    template: data.message,
                    buttons: [
                        {
                            text: 'Cancel'
                        },
                        {
                            text: '<b>OK</b>',
                            type: 'button-assertive'
                        }
                    ]
                });
            }
        });
        responsePromise.error(function (data, status, headers, config) {
            hideLoader($ionicLoading);
            var myPopup = $ionicPopup.show({
                title: 'Error',
                scope: $scope,
                template: 'Can not register',
                buttons: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: '<b>OK</b>',
                        type: 'button-assertive'
                    }
                ]
            });
        });
    }
})

//HISTORY-CONTROLLER
.controller("historyController", function ($scope, $state, $http, $ionicLoading, $ionicPopup) {
    showLoader($ionicLoading);
    var responsePromise = $http({
        method: 'POST',
        url: apiUrl + "getUserHistory",
        data: $.param({
            id: userInfo.User.id
        }), // pass in data as strings
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    responsePromise.success(function (data, status, headers, config) {
        hideLoader($ionicLoading);
        if (data.status) {
            $scope.orders = data.data;
            $scope.imageUrl = webUrl + "uploads/";
        } else {
            var myPopup = $ionicPopup.show({
                title: 'Error',
                scope: $scope,
                template: data.message,
                buttons: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: '<b>OK</b>',
                        type: 'button-assertive'
                    }
                ]
            });
        }
    });
    responsePromise.error(function (data, status, headers, config) {
        hideLoader($ionicLoading);
        var myPopup = $ionicPopup.show({
            title: 'Error',
            scope: $scope,
            template: 'Can not login',
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: '<b>OK</b>',
                    type: 'button-assertive'
                }
            ]
        });
    });
})

//LOGIN-CONTROLLER
.controller("loginController", function ($scope, $state, $http, $ionicLoading, $ionicPopup, $timeout, $ionicSlideBoxDelegate) {
    $scope.submitForm = function () {
        if ($("#email").val() == '') {
            var myPopup = $ionicPopup.show({
                title: 'Error',
                scope: $scope,
                template: 'Please enter email',
                buttons: [
                    {
                        text: 'Cancel'
                        },
                    {
                        text: '<b>OK</b>',
                        type: 'button-assertive'
                        }
                    ]
            });
        } else if ($("#password").val() == '') {
            var myPopup = $ionicPopup.show({
                title: 'Error',
                scope: $scope,
                template: 'Please enter password',
                buttons: [
                    {
                        text: 'Cancel'
                        },
                    {
                        text: '<b>OK</b>',
                        type: 'button-assertive'
                        }
                    ]
            });
        } else {
            showLoader($ionicLoading);
            var responsePromise = $http({
                method: 'POST',
                url: apiUrl + "login",
                data: $('#loginForm').serialize(), // pass in data as strings
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            responsePromise.success(function (data, status, headers, config) {
                hideLoader($ionicLoading);
                if (data.status) {
                    userInfo = data.data;
                    $state.go('homepage');
                } else {
                    var myPopup = $ionicPopup.show({
                        title: 'Error',
                        scope: $scope,
                        template: data.message,
                        buttons: [
                            {
                                text: 'Cancel'
                        },
                            {
                                text: '<b>OK</b>',
                                type: 'button-assertive'
                        }
                    ]
                    });
                }
            });
            responsePromise.error(function (data, status, headers, config) {
                hideLoader($ionicLoading);
                var myPopup = $ionicPopup.show({
                    title: 'Error',
                    scope: $scope,
                    template: 'Can not login',
                    buttons: [
                        {
                            text: 'Cancel'
                    },
                        {
                            text: '<b>OK</b>',
                            type: 'button-assertive'
                    }
                ]
                });
            });
        }

    }

    $scope.gotoSignup = function () {
        $state.go('signup');
    }

    $scope.googleLogin = function () {
        window.plugins.googleplus.login({
                'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
                'webClientId': '', // 40333814019-f18mvp3mmbbo19vt52cc7m3hpjhn31hh.apps.googleusercontent.com optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
            },
            function (obj) {
                //alert(JSON.stringify(obj)); // do something useful instead of alerting
                if (obj.imageUrl == undefined) {
                    obj.imageUrl = '';
                }
                showLoader($ionicLoading);
                var responsePromise = $http({
                    method: 'POST',
                    url: apiUrl + "socialLogin",
                    data: $.param({
                        social_id: obj.userId,
                        social_type: 2,
                        email: obj.email,
                        name: obj.displayName,
                        image: obj.imageUrl
                    }), // pass in data as strings
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                responsePromise.success(function (data, status, headers, config) {
                    //alert("success: "+JSON.stringify(data))
                    hideLoader($ionicLoading);
                    if (data.status) {
                        userInfo = data.data;
                        //alert(JSON.stringify(userInfo))
                        $state.go('homepage');
                    } else {
                        var myPopup = $ionicPopup.show({
                            title: 'Error',
                            scope: $scope,
                            template: data.message,
                            buttons: [
                                {
                                    text: 'Cancel'
                                },
                                {
                                    text: '<b>OK</b>',
                                    type: 'button-assertive'
                                }
                                ]
                        });
                    }
                });
                responsePromise.error(function (data, status, headers, config) {
                    //alert("error: "+JSON.stringify(data))
                    hideLoader($ionicLoading);
                    var myPopup = $ionicPopup.show({
                        title: 'Error',
                        scope: $scope,
                        template: data.message,
                        buttons: [
                            {
                                text: 'Cancel'
                            },
                            {
                                text: '<b>OK</b>',
                                type: 'button-assertive'
                            }
                            ]
                    });
                });
            },
            function (msg) {
                alert('error: ' + msg);
            }
        );
    }

    $scope.fbLogin = function () {
        var fbLoginSuccess = function (userData) {
            //alert("UserInfo: " + JSON.stringify(userData));
            /*alert(userData.authResponse.userID);
             facebookConnectPlugin.api(userData.authResponse.userID + "/?fields=id,email",
             function (result) {
             alert("Result: " + JSON.stringify(result));
             
             },
             function (error) {
             alert("Failed: " + error);
             });*/

            showLoader($ionicLoading);
            var responsePromise = $http({
                method: 'POST',
                url: apiUrl + "socialLogin",
                data: $.param({
                    social_id: userData.authResponse.userID,
                    social_type: 1
                }), // pass in data as strings
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            responsePromise.success(function (data, status, headers, config) {
                hideLoader($ionicLoading);
                if (data.status) {
                    userInfo = data.data;
                    $state.go('homepage');
                } else {
                    var myPopup = $ionicPopup.show({
                        title: 'Error',
                        scope: $scope,
                        template: data.message,
                        buttons: [
                            {
                                text: 'Cancel'
                            },
                            {
                                text: '<b>OK</b>',
                                type: 'button-assertive'
                            }
                        ]
                    });
                }
            });
            responsePromise.error(function (data, status, headers, config) {
                hideLoader($ionicLoading);
                var myPopup = $ionicPopup.show({
                    title: 'Error',
                    scope: $scope,
                    template: 'Can not login',
                    buttons: [
                        {
                            text: 'Cancel'
                        },
                        {
                            text: '<b>OK</b>',
                            type: 'button-assertive'
                        }
                    ]
                });
            });
        }

        facebookConnectPlugin.login(["public_profile,email"],
            fbLoginSuccess,
            function (error) {
                alert("" + JSON.stringify(error))
            }
        );
    }
})

//HISTORY-CONTROLLER
.controller("forgetController", function ($scope, $state, $http, $ionicLoading, $ionicPopup) {
    $scope.submitForm = function () {
        if ($("#email").val() == '') {
            var myPopup = $ionicPopup.show({
                title: 'Error',
                scope: $scope,
                template: 'Please enter email',
                buttons: [
                    {
                        text: 'Cancel'
                        },
                    {
                        text: '<b>OK</b>',
                        type: 'button-assertive'
                        }
                    ]
            });
        } else {
            showLoader($ionicLoading);
            var responsePromise = $http({
                method: 'POST',
                url: apiUrl + "forgetPassword",
                data: $.param({
                    email: $("#email").val()
                }), // pass in data as strings
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            responsePromise.success(function (data, status, headers, config) {
                hideLoader($ionicLoading);
                if (data.status) {
                    var myPopup = $ionicPopup.show({
                        title: 'Success',
                        scope: $scope,
                        template: data.message,
                        buttons: [
                            {
                                text: 'Cancel'
                    },
                            {
                                text: '<b>OK</b>',
                                type: 'button-positive',
                                onTap: function (e) {
                                    if (data.status) {
                                        $state.go('login');
                                    }

                                }
                    }
                ]
                    });
                } else {
                    var myPopup = $ionicPopup.show({
                        title: 'Error',
                        scope: $scope,
                        template: data.message,
                        buttons: [
                            {
                                text: 'Cancel'
                    },
                            {
                                text: '<b>OK</b>',
                                type: 'button-assertive',
                    }
                ]
                    });
                }

            });
            responsePromise.error(function (data, status, headers, config) {
                hideLoader($ionicLoading);
                var myPopup = $ionicPopup.show({
                    title: 'Error',
                    scope: $scope,
                    template: 'Invalid Request',
                    buttons: [
                        {
                            text: 'Cancel'
                },
                        {
                            text: '<b>OK</b>',
                            type: 'button-assertive'
                }
            ]
                });
            });
        }
    }

})