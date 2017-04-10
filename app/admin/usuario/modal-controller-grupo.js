angularApp.controller('ModalGrupoReadCtrl', ['$scope', '$modalInstance', 'Grupo', function($scope, $modalInstance, Grupo) {
	$scope.modalInstance = $modalInstance;
	$scope.modal = {};

	$scope.modal.grupos = Grupo.data;

    $scope.modal.select = function(result) {
		return $scope.modalInstance.close(result);
    }
}]);