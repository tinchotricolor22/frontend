angular.module('resources').factory('ProductType', ['BaseModel', function(BaseModel) {
	return BaseModel('ptype');
}]);