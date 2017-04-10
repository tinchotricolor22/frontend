angularApp.controller('LocalidadReadCtrl', ['$scope', 'BaseReadCtrl', 'Localidad', function($scope, BaseReadCtrl, Localidad) {
	angular.extend($scope, BaseReadCtrl(
		{
			modelFactory: Localidad,
			modelName: 'localidad'
		}
	));
}]);
angularApp.controller('LocalidadCreateCtrl', ['$scope', 'BaseCreateCtrl', 'Localidad', function($scope, BaseCreateCtrl, Localidad) {
	angular.extend($scope, BaseCreateCtrl(
		{
			modelFactory: Localidad,
			modelName: 'localidad'
		}
	));
}]);
angularApp.controller('LocalidadUpdateCtrl', ['$scope', 'BaseUpdateCtrl', 'Localidad', function($scope, BaseUpdateCtrl, Localidad) {
	angular.extend($scope, BaseUpdateCtrl(
		{
			modelFactory: Localidad,
			modelName: 'localidad'
		}
	));
}]);