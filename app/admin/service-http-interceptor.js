angular.module('httpInterceptor', []).factory('httpInterceptor', ['$q', 'growl', '_', function ($q, growl, _) {
	return {
		'responseError': function (rejection) {
			if (rejection.status == 400) { // Validation Error
				if (rejection.data.message) {
					_.each(rejection.data.message, function (messageArray) {
						_.each(messageArray, function (message) {
							growl.addErrorMessage(message);
						});
					});
				}
			} else {
				growl.addErrorMessage(rejection.data.message != undefined ? rejection.data.message : 'Ocurrió un error inesperado, por favor contacte al administrador');
			}
			return $q.reject(rejection);
		}
	}
}]);