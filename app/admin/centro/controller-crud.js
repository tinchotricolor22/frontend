angularApp.controller('CentroReadCtrl', ['$scope', 'BaseReadCtrl', 'Centro', 'Localidad', function($scope, BaseReadCtrl, Centro, Localidad) {
	angular.extend($scope, BaseReadCtrl(
		{
			modelFactory: Centro,
			modelName: 'centro',
			tableFields: ['id', 'nombre', 'telefono', 'direccion', 'localidad', 'id_localidad'],
			tableFilters: [
				{field: 'nombre', operator: 'LIKE'},
				{field: 'direccion', operator: 'LIKE'}
			]
		}
	));

	$scope.localidades = Localidad.data;
}]);
angularApp.controller('CentroCreateCtrl', ['$scope', '$rootScope', 'BaseCreateCtrl', 'Centro', 'Upload'/*, 'Localidad'*/, function($scope, $rootScope, BaseCreateCtrl, Centro, Upload/*, Localidad*/) {
	angular.extend($scope, BaseCreateCtrl(
		{
			modelFactory: Centro,
			modelName: 'centro'
		}
	));

	$scope.beforeCreate = function() {
		if ($scope.object.web && $scope.object.web.indexOf('http://') !== 0 && $scope.object.web.indexOf('https://') !== 0) {
			$scope.object.web = 'http://' + $scope.object.web;
		}
		return true;
	};

	//$scope.localidades = Localidad.data;

	$scope.upload = function(files, field) {
		Upload.post(files[0]).then(function(result) {
			$scope.object[field] = result.url;
		});
	};
}]);
angularApp.controller('CentroUpdateCtrl', ['$scope', 'BaseUpdateCtrl', 'Centro', '$modal', 'Upload'/*, 'Localidad'*/, function($scope, BaseUpdateCtrl, Centro, $modal, Upload/*, Localidad*/) {
	angular.extend($scope, BaseUpdateCtrl(
		{
			modelFactory: Centro,
			modelName: 'centro'
		}
	));

	$scope.beforeUpdate = function() {
		if ($scope.object.web && $scope.object.web.indexOf('http://') !== 0 && $scope.object.web.indexOf('https://') !== 0) {
			$scope.object.web = 'http://' + $scope.object.web;
		}
		return true;
	};

	$scope.upload = function(files, field) {
		Upload.post(files[0]).then(function(result) {
			$scope.object[field] = result.url;
		});
	};

	//$scope.localidades = Localidad.data;

	$scope.dias_semana = [
		{id: 0, nombre: 'lunes'},
		{id: 1, nombre: 'martes'},
		{id: 2, nombre: 'miércoles'},
		{id: 3, nombre: 'jueves'},
		{id: 4, nombre: 'viernes'},
		{id: 5, nombre: 'sábado'},
		{id: 6, nombre: 'domingo'}
	];

	$scope.actualizarIntervalos = function(intervalos) {
		$scope.intervalos_actividad = [];
		angular.forEach(intervalos, function(dia, diaIndex) {
			angular.forEach(dia, function(intervalo, intervaloIndex) {
				$scope.intervalos_actividad.push(
					{
						index_dia: diaIndex,
						index_intervalo: intervaloIndex,
						dia: $scope.dias_semana[diaIndex].nombre,
						desde: intervalo[0],
						hasta: intervalo[1]
					}
				)
			});
		});
	};
	$scope.actualizarIntervalos($scope.object.intervalos_actividad);

	$scope.agregarIntervaloOpen = function() {
		$modal.open(
			{
				templateUrl: 'app/admin/centro/modal-view-intervalo.html',
				controller: 'ModalIntervaloReadCtrl',
				backdrop: 'static',
				windowClass: 'normal-modal',
				keyboard: true,
				scope: $scope
			}
		).result.then(
			function(result) {
				if (result) {
					var aux = angular.copy(Centro.intervalos_actividad);
					Centro.intervalos_actividad[result.dia].push([result.hora_inicio, result.hora_fin]);
					Centro.put().then(function(response) {
						$scope.actualizarIntervalos(response.intervalos_actividad);
					}, function() {
						Centro.intervalos_actividad = aux;
					});
				}
			}
		);
	};

	$scope.quitarIntervalo = function(index_dia, index_intervalo) {
		var aux = angular.copy(Centro.intervalos_actividad);
		Centro.intervalos_actividad[index_dia].splice(index_intervalo, 1);
		Centro.put().then(function(response) {
			$scope.actualizarIntervalos(response.intervalos_actividad);
		}, function() {
			Centro.intervalos_actividad = aux;
		});
	};
}]);