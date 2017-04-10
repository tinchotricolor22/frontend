angularApp.controller('HomeCtrl', ['UserService', '$location', function(UserService, $location) {

    UserService.requestCentroActivo().then(function() {
        $location.path('/calendario');
    });

}]);