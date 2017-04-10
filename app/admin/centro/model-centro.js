angular.module('resources').factory('Centro', ['BaseModel', 'Restangular', function(BaseModel, Restangular) {
	var Centro = BaseModel('centro', {
        listParams: {
            'fields': 'id,nombre,duracion_fraccion',
			'order': [{field: 'nombre', direction: 'asc'}]
        }
    });

	Restangular.addElementTransformer('centro', false, function(element) {
		if (!element.intervalos_actividad) {
			element.intervalos_actividad = [[], [], [], [], [], [], []];
		}
		return element;
	});

	Restangular.addElementTransformer('profesionales', true, function(element) {
		element.addRestangularMethod('search', 'post', 'search'); //TODO: No está implementado en el backend
		return element;
	});

	Restangular.addElementTransformer('tratamientos', true, function(element) {
		element.addRestangularMethod('search', 'post', 'search'); //TODO: No está implementado en el backend
		return element;
	});

	Restangular.addElementTransformer('reservas', true, function(element) {
		angular.forEach(element, function(reserva) {
			angular.forEach(reserva.turnos, function(turno) {
				if (!turno.tratamiento) {
					turno.tratamiento = {
						tipo_de_tratamiento: {
							nombre: 'Tratamiento inexistente'
						},
						id_centro: 0
					}
				}
			});
		});
		return element;
	});

	return Centro;
}]);