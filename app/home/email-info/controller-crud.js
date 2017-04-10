angularApp.controller('EmailCreateCtrl', ['$scope', 'BaseCreateCtrl', 'growl', 'Email', function($scope, BaseCreateCtrl, growl, Email) {
	angular.extend($scope, BaseCreateCtrl(
		{
			modelFactory: Email,
			modelName: 'email',
            tableFields: ['email'],
            successMessage: function(response) {
                $scope.object.email = '';
                return ('Tu <b>email</b> fue registrado. Tendrás noticias nuestras próximamente.');
            }
		}
	));
}]);