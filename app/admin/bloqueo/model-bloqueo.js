angular.module('resources').factory('Bloqueo', ['BaseModel', 'Restangular', 'moment', function(BaseModel, Restangular, moment) {
	var Bloqueo = BaseModel('bloqueo');

	Restangular.addElementTransformer('bloqueo', false, function(element) {
		if (!element.data) {
			element.diahora_inicio = moment(element.diahora_inicio).toDate();
			element.diahora_fin = moment(element.diahora_fin).toDate();
		} else {
			angular.forEach(element.data, function(value, key) {
				element.data[key].diahora_inicio = moment(value.diahora_inicio).toDate();
				element.data[key].diahora_fin = moment(value.diahora_fin).toDate();
			});
		}
		return element;
	});

	return Bloqueo;
}]);