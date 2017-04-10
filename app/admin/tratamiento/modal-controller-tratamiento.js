angularApp.controller('ModalTratamientoReadCtrl', ['$scope', '$modalInstance', 'ngTableParams', '$timeout', 'Centro', 'TipoDeTratamiento', function($scope, $modalInstance, ngTableParams, $timeout, Centro, TipoDeTratamiento) {

	$scope.modalInstance = $modalInstance;
	$scope.modal = {};

	$scope.modal_tipos_de_tratamiento = TipoDeTratamiento.data;

    $scope.modal_filters = {};
	$scope.modal_filters.id_centro = Centro.id;
	$scope.modal_centroFactory = Centro;

	$scope.tableFields = ['id', 'id_tipo_de_tratamiento', 'tipo_de_tratamiento', 'descripcion', 'duracion'];

	$scope.modal_tableParams = new ngTableParams(
		{page: 1, count: 10},
		{
			total: 0,
			getData: function($defer, params) {
				if ($scope.modal_filters.id_centro) {
					$scope.modal_centroFactory.getList('tratamientos',
						angular.extend(
							{limit : params.count(), skip: params.count() * (params.page() - 1), 'order': $scope.ctrlConfig.tableOrder, 'fields': $scope.tableFields.join()},
							$scope.filters
						)
					).then(function(response){
						$timeout(function() {
							params.total(response.length);
							$defer.resolve(response);
						}, 200);
					});
				}
			}
		}
	);

    $scope.modal.select = function(result) {
		return $scope.modalInstance.close(result);
    }
}]);