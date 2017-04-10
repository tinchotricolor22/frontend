angularApp.controller('CentroMapAddressCtrl', ['$scope', '$routeParams', '$http', 'growl', 'UserService', function($scope, $routeParams, $http, growl, UserService) {
    /* Google Map */
    $scope.geoCodeService = 'http://maps.google.com/maps/api/geocode/json';
    $scope.centro = $scope.$parent.object;

    $scope.searchLocation = function () {
        $http({
            method: 'GET',
            url: $scope.geoCodeService,
            params: {
                address: $scope.centro.direccion,
                sensor: false
            }})
        .then (function (response) {
            if (response.status != 200 || response.data.status != 'OK') {
                // Show error message
                growl.addErrorMessage("No se encontró la dirección buscada. Por favor especifique Barrio y Localidad en la dirección.");
            }
            $scope.centro.latitud = response.data.results[0].geometry.location.lat;
            $scope.centro.longitud = response.data.results[0].geometry.location.lng;
            var map = {
                center: {
                    latitude: $scope.centro.latitud,
                    longitude: $scope.centro.longitud
                },
                marker: {
                    id: 1,
                    coords: {
                        latitude: $scope.centro.latitud,
                        longitude: $scope.centro.longitud
                    }
                },
                refresh: true
            };
            angular.extend($scope.map, map);
        });
    };

    $scope.map = {
        // Obelisco hardcoded
        center: {
            latitude: $scope.centro.latitud,
            longitude: $scope.centro.longitud
        },
        marker: {
            id: 1,
            coords: {
                latitude: $scope.centro.latitud,
                longitude: $scope.centro.longitud
            },
            show: false
        },
        zoom: 15,
        options: {
            scrollwheel: false,
            streetViewControl: false
        },
        refresh: true
    };

}]);