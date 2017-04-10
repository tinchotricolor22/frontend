angularApp.controller('TipoDeTratamientoReadCtrl', ['$scope', 'BaseReadCtrl', 'TipoDeTratamiento', function($scope, BaseReadCtrl, TipoDeTratamiento) {
	angular.extend($scope, BaseReadCtrl(
		{
			modelFactory: TipoDeTratamiento,
			modelName: 'tipo de tratamiento'
		}
	));
}]);
angularApp.controller('TipoDeTratamientoCreateCtrl', ['$scope', 'BaseCreateCtrl', 'TipoDeTratamiento', function($scope, BaseCreateCtrl, TipoDeTratamiento) {
	angular.extend($scope, BaseCreateCtrl(
		{
			modelFactory: TipoDeTratamiento,
			modelName: 'tipo de tratamiento'
		}
	));
}]);
angularApp.controller('TipoDeTratamientoUpdateCtrl', ['$scope', 'BaseUpdateCtrl', 'TipoDeTratamiento', function($scope, BaseUpdateCtrl, TipoDeTratamiento) {
	angular.extend($scope, BaseUpdateCtrl(
		{
			modelFactory: TipoDeTratamiento,
			modelName: 'tipo de tratamiento'
		}
	));
}]);