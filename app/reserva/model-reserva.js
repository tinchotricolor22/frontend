angular.module('resources').factory('Reserva', ['BaseModel', function(BaseModel) {
	return BaseModel('reserva');
}]);