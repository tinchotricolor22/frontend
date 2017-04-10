angularApp.controller('ReservaReadCtrl', ['$scope', 'BaseReadCtrl', 'Reserva', function($scope, BaseReadCtrl, Reserva) {
	angular.extend($scope, BaseReadCtrl(
		{
			modelFactory: Reserva,
			modelName: 'reserva'
		}
	));
}]);
angularApp.controller('ReservaCreateCtrl', [
    '$scope', '$routeParams', '$filter', '$modal', '$location', 'security', 'BaseCreateCtrl', 'growl', 'Reserva', 'UserService', 'Profesional', 'Tratamiento', 'Centro', 'Turno', '$modalInstance', 'reserva','Restangular','$rootScope',
    function($scope, $routeParams, $filter, $modal, $location, security, BaseCreateCtrl, growl, Reserva, UserService, Profesional, Tratamiento, Centro, Turno, $modalInstance, reserva,Restangular,$rootScope) {
	angular.extend($scope, BaseCreateCtrl(
		{
			modelFactory: Reserva,
			modelName: 'reserva',
            tableFields: ['reserva']
		}
	));
    $scope.modalInstance = $modalInstance;


    $scope.reserva  = reserva.reserva;

    $scope.reservar = function () {

        Reserva.post(
            {
                origen: 'Online',
                turnos: [{
                    id_tratamiento: $scope.reserva.tratamiento.id,
                    id_profesional: $scope.reserva.profesional.id,
                    diahora_inicio: $scope.reserva.fechaIni
                }]
            }).then(function (response) {
                growl.addSuccessMessage("Su reserva se ha registrado exitósamente.");
                $modalInstance.dismiss();
                $location.path('/mis-reservas');
            });
    };
}]);
angularApp.controller('ReservaUpdateCtrl', ['$scope', 'BaseUpdateCtrl', 'Reserva', function($scope, BaseUpdateCtrl, Reserva) {
    angular.extend($scope, BaseUpdateCtrl(
        {
            modelFactory: Reserva,
            modelName: 'reserva'
        }
    ));
}]);