angularApp.controller('BloqueoReadCtrl', ['$rootScope', '$scope', 'BaseReadCtrl', 'Bloqueo', 'UserService', '$modal', 'moment', 'Centro', function($rootScope, $scope, BaseReadCtrl, Bloqueo, UserService, $modal, moment, Centro) {
	angular.extend($scope, BaseReadCtrl(
		{
			modelFactory: Bloqueo,
			modelName: 'bloqueo',
			tableFields: ['id', 'id_centro', 'id_profesional', 'profesional', 'diahora_inicio', 'diahora_fin'],
			tableFilters: [
				{field: 'id_centro', operator: '='}
			],
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

	$scope.moment = moment;

	$scope.agregarBloqueoOpen = function() {
		if ($scope.filters.id_centro) {
			$modal.open(
				{
					templateUrl: 'app/admin/bloqueo/modal-view-intervalo-bloqueo.html',
					controller: 'ModalIntervaloBloqueoReadCtrl',
					backdrop: 'static',
					windowClass: 'normal-modal',
					keyboard: true,
					scope: $scope,
					resolve: {
						ProfesionalCentro: function(Centro) {return Centro.one($scope.filters.id_centro).getList('profesionales')}
					}
				}
			).result.then(
				function(result) {
					if (result) {
						var factory = Bloqueo;
						if (result.id_profesional == 0) {
							factory = Centro.one($scope.filters.id_centro).all('bloqueos');
						}
						factory.post(result).then(function() {
							$scope.tableParams.reload();
						});
					}
				}
			);
		} else {
			$scope.tableParams.reload();
		}
	};

	$scope.quitarBloqueo = function(id_bloqueo) {
		Bloqueo.one(id_bloqueo).remove(id_bloqueo).then(function() {
			$scope.tableParams.reload();
		});
	};
}]);