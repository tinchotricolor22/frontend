angularApp.controller('TratamientoReadCtrl', ['$rootScope', '$scope', 'BaseReadCtrl', 'Tratamiento', '$location', '$timeout', 'ngTableParams', 'security', 'Centro', 'TipoDeTratamiento', 'UserService', function($rootScope, $scope, BaseReadCtrl, Tratamiento, $location, $timeout, ngTableParams, security, Centro, TipoDeTratamiento, UserService) {
	angular.extend($scope, BaseReadCtrl(
		{
			modelFactory: Tratamiento,
			modelName: 'tratamiento',
			tableFields: ['id', 'nombre', 'descripcion', 'duracion', 'id_centro', 'centro', 'id_tipo_de_tratamiento', 'tipo_de_tratamiento'],
			tableFilters: [
				{field: 'id_tipo_de_tratamiento', operator: '='},
				{field: 'nombre', operator: 'LIKE'},
				{field: 'id_centro', operator: '='}
			],
			tableOrder: [{field: 'nombre', direction: 'asc'}],
			initTable: true,
			beforeGetData: function() {
				return UserService.requestCentroActivo().then(function(centroActivo) {
					$scope.filters.id_centro = centroActivo.id;
					return !!$scope.filters.id_centro;
				});
			}
		}
	));

	var cleanUpFunc = $rootScope.$on('cambioCentro', function(){$scope.tableParams.reload();});
	$scope.$on('$destroy', function() {
		cleanUpFunc();
	});

	$scope.tipos_de_tratamiento = TipoDeTratamiento.data;
}]);
angularApp.controller('TratamientoCreateCtrl', ['$scope', 'BaseCreateCtrl', 'Tratamiento', 'security', 'Centro', 'TipoDeTratamiento', 'UserService', function($scope, BaseCreateCtrl, Tratamiento, security, Centro, TipoDeTratamiento, UserService) {
	angular.extend($scope, BaseCreateCtrl(
		{
			modelFactory: Tratamiento,
			modelName: 'tratamiento'
		}
	));

	$scope.beforeCreate = function() {
		if (!$scope.object.id_centro) {
			$scope.requestCentro().then(function() {
				if ($scope.object.id_centro) {
					$scope.create();
				}
			});
			return false;
		}
		return true;
	};

	$scope.requestCentro = function() {
		return UserService.requestCentroActivo().then(function(centroActivo) {
			Centro.id = centroActivo.id;
			$scope.object.id_centro = Centro.id;
			$scope.ctrlConfig.modelFactory = Centro.all('tratamientos');
		});
	};

	$scope.requestCentro();

	$scope.tipos_de_tratamiento = TipoDeTratamiento.data;
}]);
angularApp.controller('TratamientoUpdateCtrl', ['$scope', 'BaseUpdateCtrl', 'Tratamiento', 'TipoDeTratamiento', 'UserService', function($scope, BaseUpdateCtrl, Tratamiento, TipoDeTratamiento, UserService) {
	angular.extend($scope, BaseUpdateCtrl(
		{
			modelFactory: Tratamiento,
			modelName: 'tratamiento'
		}
	));

    UserService.requestCentroActivo().then(function(centroActivo) {
        $scope.object.duracion *= centroActivo.duracion_fraccion;
    });

	$scope.tipos_de_tratamiento = TipoDeTratamiento.data;
}]);