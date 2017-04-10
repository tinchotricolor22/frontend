angularApp.controller('ModalSeleccionarCentroCtrl', ['$scope', '$modalInstance', 'Centro', 'CentrosUsuario', 'title', function($scope, $modalInstance, Centro, CentrosUsuario, title) {
	$scope.modalInstance = $modalInstance;
	$scope.modal = {};

	$scope.modal.title = title;

	$scope.modal.centros = [];
	angular.forEach(Centro.data, function(object) {
		if (CentrosUsuario.indexOf(object.id) >= 0) {
			$scope.modal.centros.push(object);
		}
	});

    $scope.modal.select = function() {
		var centro = null;
		angular.forEach($scope.modal.centros, function(object) {
			if (object.id == $scope.modal.centro) {
				centro = object;
			}
		});
		return $scope.modalInstance.close(centro);
    };
}]);