angularApp.controller('ProductTypeCreateCtrl', ['$scope', '$routeParams', 'BaseCreateCtrl', 'growl', 'ProductType', 'UserService', function($scope, $routeParams, BaseCreateCtrl, growl, ProductType, UserService) {
	angular.extend($scope, BaseCreateCtrl(
		{
			modelFactory: ProductType,
			modelName: 'ptype',
            tableFields: ['ptype']
		}
	));
}]);
angularApp.controller('ProductTypeReadCtrl', ['$scope', 'BaseReadCtrl', 'ProductType', function($scope, BaseReadCtrl, ProductType) {
    angular.extend($scope, BaseReadCtrl(
        {
            modelFactory: ProductType,
            modelName: 'ptype'
        }
    ));
}]);
angularApp.controller('ProductTypeUpdateCtrl', ['$scope', 'BaseUpdateCtrl', 'ProductType', function($scope, BaseUpdateCtrl, ProductType) {
    angular.extend($scope, BaseUpdateCtrl(
        {
            modelFactory: ProductType,
            modelName: 'ptype'
        }
    ));
}]);