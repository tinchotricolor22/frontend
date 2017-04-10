angularApp.controller('CentroMapCtrl', ['$scope',
    function($scope) {
    /* Google Map */
    $scope.$watch('centro', function (centro) {
        var map = {
            center: {
                latitude: centro.latitud || $scope.map.center.latitude,
                longitude: centro.longitud || $scope.map.center.longitude
            },
            marker: {
                id: 2,
                coords: {
                    latitude: centro.latitud || $scope.map.marker.coords.latitude,
                    longitude: centro.longitud || $scope.map.marker.coords.longitude
                }
            },
            refresh: true
        };
        angular.extend($scope.map, map);
    });
    $scope.map = {
        center: {
            latitude: $scope.centro.latitud,
            longitude: $scope.centro.longitud
        },
        marker: {
            id: 2,
            coords: {
                latitude: $scope.centro.latitud,
                longitude: $scope.centro.longitud
            },
            show: false
        },
        zoom: 15,
        options: {
            scrollwheel: true,
            streetViewControl: false
        },
        refresh: false
    };

}]);