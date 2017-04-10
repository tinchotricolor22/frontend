angularApp.controller('ModalInformarTratamientoCtrl', ['$scope', '$modalInstance', 'Profesional', '$location', 'Centro', function($scope, $modalInstance, Profesional, $location, Centro) {
	$scope.modalInstance = $modalInstance;
	$scope.modal = {};

	$scope.modal.select = function() {
		$location.path('/admin/centro/' + Centro.id + '/profesional/' + Profesional.id);
		$scope.modalInstance.close(true);
	};

    $scope.modal.notNow = function() {
        $location.path('/admin/profesional');
        $scope.modalInstance.close(true);
    };
}]);