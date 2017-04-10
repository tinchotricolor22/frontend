angularApp.controller('ProductTypeCatCreateCtrl', ['$scope', '$routeParams', 'BaseCreateCtrl', 'growl', 'ProductTypeCat', 'UserService', function($scope, $routeParams, BaseCreateCtrl, growl, ProductTypeCat, UserService) {
	angular.extend($scope, BaseCreateCtrl(
		{
			modelFactory: ProductTypeCat,
			modelName: 'ptypecat',
            tableFields: ['ptypecat']
		}
	));
}]);
angularApp.controller('ProductTypeCatReadCtrl', ['$scope', 'BaseReadCtrl', 'ProductTypeCat', function($scope, BaseReadCtrl, ProductTypeCat) {
    angular.extend($scope, BaseReadCtrl(
        {
            modelFactory: ProductTypeCat,
            modelName: 'ptypecat'
        }
    ));
}]);
angularApp.controller('ProductTypeCatUpdateCtrl', ['$scope', 'BaseUpdateCtrl', 'ProductTypeCat', function($scope, BaseUpdateCtrl, ProductTypeCat) {
    angular.extend($scope, BaseUpdateCtrl(
        {
            modelFactory: ProductTypeCat,
            modelName: 'ptypecat'
        }
    ));
}]);