angularApp.directive('centroActivo', function ($rootScope, UserService, localStorageService) {
	return {
		restrict: 'A',
		replace: true,
		template:
			'<li class="" data-ng-click="cambiarCentro();">' +
			'	<a class="btn btn-default admin-header-user-dropdown" type="button">' +
			'		<i class="fa fa-fw fa-building"></i>' +
			'		{{centroActivo.nombre}}' +
			'	</a>' +
			'</li>',
		link: function($scope, $element, $attrs) {
			$scope.centroActivo =  {id: null, nombre: '...'};
			var cambioCentroCallback = function(event, centroActivo) {
				$scope.centroActivo = centroActivo;
            };
			$rootScope.$on('seleccionCentro', cambioCentroCallback);
			$rootScope.$on('cambioCentro', cambioCentroCallback);
			$scope.cambiarCentro = function() {
				UserService.data.centroActivo = null;
				UserService.requestCentroActivo();
			};
		}
	};
});