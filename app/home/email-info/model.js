angular.module('resources').factory('Email', ['BaseModel', function(BaseModel) {
	return BaseModel('email');
}]);