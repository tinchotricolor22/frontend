angular.module('resources', []).factory('BaseModel', ['Restangular', function (Restangular) {
	return function (model_path, customModelConfig) {
		var resource = Restangular.allUrl(model_path,'http://localhost:8080/backend/rest/');

		resource.modelConfig = {
			listParams: {
				'fields': 'id,nombre',
				'order': [{field: 'id', direction: 'desc'}]
			}
		};
		angular.extend(resource.modelConfig, customModelConfig);

		resource.addRestangularMethod('search', 'post', 'search');

		resource.list = function (params) {
			params = angular.extend({}, this.modelConfig.listParams, params);
			return this.customPOST(params, 'search');
		};
        resource.stripRestangular = function (object) {
            return Restangular.stripRestangular(object);
        };
        resource.one = function (param) {
            return Restangular.one(model_path, param);
        };

		return resource;
	};
}]);