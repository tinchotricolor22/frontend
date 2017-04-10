angularApp.controller('ContactanosCtrl', ['$scope', '$location', '$routeParams', 'Restangular', 'growl', 'JumbotronService', function($scope, $location, $routeParams, Restangular, growl, JumbotronService) {
    JumbotronService.showJumbotron = false;
    $scope.contact = {};
    $scope.contact.tipoUsuario = $routeParams['tipoUsuario'] || null;
    $scope.sendMessage = function () {
        return Restangular.one('').customPOST($scope.contact, 'contacto').then(function (result) {
            growl.addSuccessMessage("Recibimos tu mensaje. Nos contactaremos a la brevedad.");
            return $location.path('/');
        });
    };

}]);