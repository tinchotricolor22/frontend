angular.module('resources').factory('Profesional', ['BaseModel', 'Restangular', function(BaseModel, Restangular) {
	var Profesional = BaseModel('profesional', {
		listParams: {
			'fields': 'id,nombre',
			'order': [{field: 'nombre', direction: 'asc'}, {field: 'apellido', direction: 'asc'}]
		}
	});

	Restangular.addElementTransformer('profesionales', false, function(element) {
		if (!element.intervalos_actividad) {
			element.intervalos_actividad = [[], [], [], [], [], [], []];
		}
		return element;
	});

	return Profesional;
}]);