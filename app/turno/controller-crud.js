angularApp.controller('TurnoCreateCtrl', ['$scope', '$routeParams', 'BaseCreateCtrl', 'growl', 'Turno', 'UserService', function($scope, $routeParams, BaseCreateCtrl, growl, Turno, UserService) {
	angular.extend($scope, BaseCreateCtrl(
		{
			modelFactory: Turno,
			modelName: 'turno',
            tableFields: ['turno']
		}
	));
}]);
angularApp.controller('TurnoReadCtrl', ['$scope', 'BaseReadCtrl', 'Turno', function($scope, BaseReadCtrl, Turno) {
    angular.extend($scope, BaseReadCtrl(
        {
            modelFactory: Turno,
            modelName: 'turno'
        }
    ));
}]);
angularApp.controller('TurnoUpdateCtrl', ['$scope', 'BaseUpdateCtrl', 'Turno', function($scope, BaseUpdateCtrl, Turno) {
    angular.extend($scope, BaseUpdateCtrl(
        {
            modelFactory: Turno,
            modelName: 'turno'
        }
    ));
}]);