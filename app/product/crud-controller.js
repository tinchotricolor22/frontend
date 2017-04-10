angularApp.controller('ProductCreateCtrl', ['$scope', '$routeParams', 'BaseCreateCtrl', 'growl', 'Product', 'UserService', function($scope, $routeParams, BaseCreateCtrl, growl, Product, UserService) {
	angular.extend($scope, BaseCreateCtrl(
		{
			modelFactory: Product,
			modelName: 'product',
            tableFields: ['product']
		}
	));
}]);
angularApp.controller('ProductReadCtrl', ['$scope', 'BaseReadCtrl', 'Product', function($scope, BaseReadCtrl, Product) {
    angular.extend($scope, BaseReadCtrl(
        {
            modelFactory: Product,
            modelName: 'product'
        }
    ));
}]);
angularApp.controller('ProductUpdateCtrl', ['$scope', 'BaseUpdateCtrl', 'Product', function($scope, BaseUpdateCtrl, Product) {
    angular.extend($scope, BaseUpdateCtrl(
        {
            modelFactory: Product,
            modelName: 'product'
        }
    ));
}]);