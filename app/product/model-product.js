angular.module('resources').factory('Product', ['BaseModel', function(BaseModel) {
	return BaseModel('product');
}]);