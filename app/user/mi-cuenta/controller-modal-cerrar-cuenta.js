angularApp.controller('CerrarCuentaCtrl', [
    '$scope', '$modal', '$modalInstance', '$location', 'security', 'Usuario',
    function($scope, $modal, $modalInstance, $location, security, Usuario) {
        $scope.modalInstance = $modalInstance;

        security.requestCurrentUser().then(function (user){
            $scope.user = user;
        });

        $scope.closeAccount = function () {
            Usuario.customDELETE($scope.user.id, null, null, {'password':this.password})
                .then(function (response) {
                    $scope.authError = {
                        message: response
                    };
                    $modalInstance.dismiss();
                    $location.path('/');
                }
            );
        };
}]);