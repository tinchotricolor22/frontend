angularApp.config(['$httpProvider', 'growlProvider', 'RestangularProvider', 'FacebookProvider', 'localStorageServiceProvider',
    function($httpProvider, growlProvider, RestangularProvider, FacebookProvider, localStorageServiceProvider) {
    growlProvider.globalTimeToLive(4000);
    growlProvider.globalEnableHtml(true);

	RestangularProvider.setBaseUrl('/api');
	RestangularProvider.setResponseExtractor(function(response, b) {
		var newResponse = response;
		if (angular.isArray(response)) {
			angular.forEach(newResponse, function(value, key) {
				newResponse[key].originalElement = angular.copy(value);
			});
		} else {
			newResponse.originalElement = angular.copy(response);
		}

		return newResponse;
	});
	RestangularProvider.addRequestInterceptor(function(element, operation, what, url) {
		if ((what == 'tratamiento' || what == 'tratamientos') && (operation == 'put' || operation == 'post') && element.duracion) {
			element.duracion = parseInt(element.duracion / ((element.centro && element.centro.duracion_fraccion) ? element.centro.duracion_fraccion : 15));
		}
		return element;
	});

    FacebookProvider.init('396637723838320');

    localStorageServiceProvider.setPrefix('wonoma');

}]);