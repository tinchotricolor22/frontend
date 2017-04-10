angular.module('resources').factory('Usuario', ['BaseModel', function(BaseModel) {
	return BaseModel('usuario');
}]);