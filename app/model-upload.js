angular.module('resources').factory('Upload', ['Restangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.addFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {
            var fd = new FormData();
            fd.append("file", element);
            return {
                element: fd,
                headers: _.extend(headers, {'Content-Type': undefined}),
                httpConfig: _.extend(httpConfig, {transformRequest: angular.identity})
            };
        });
    }).service('upload');

}]);


angular.module('resources').factory('Upload64', ['Restangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.addFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {
            var fd = new FormData();
            fd.append("file", element);
            return {
                element: fd,
                headers: _.extend(headers, {'Content-Type': undefined}),
                httpConfig: _.extend(httpConfig, {transformRequest: angular.identity})
            };
        });
    }).service('upload-get64');

}]);
