angularApp.controller('TradeMarkCreateCtrl', ['$scope', '$routeParams', 'BaseCreateCtrl', 'growl', 'TradeMark', 'UserService', function($scope, $routeParams, BaseCreateCtrl, growl, TradeMark, UserService) {
	angular.extend($scope, BaseCreateCtrl(
		{
			modelFactory: TradeMark,
			modelName: 'trademark',
            tableFields: ['trademark']
		}
	));
}]);
angularApp.controller('TradeMarkReadCtrl', ['$scope', 'BaseReadCtrl', 'TradeMark', function($scope, BaseReadCtrl, TradeMark) {
    angular.extend($scope, BaseReadCtrl(
        {
            modelFactory: TradeMark,
            modelName: 'trademark'
        }
    ));
}]);
angularApp.controller('TradeMarkUpdateCtrl', ['$scope', 'BaseUpdateCtrl', 'TradeMark', function($scope, BaseUpdateCtrl, TradeMark) {
    angular.extend($scope, BaseUpdateCtrl(
        {
            modelFactory: TradeMark,
            modelName: 'trademark'
        }
    ));
}]);