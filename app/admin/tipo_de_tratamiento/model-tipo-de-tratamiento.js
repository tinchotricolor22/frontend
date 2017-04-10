angular.module('resources').factory('TipoDeTratamiento', ['BaseModel', function(BaseModel) {
	return BaseModel('tipo_de_tratamiento', {
		listParams: {
			'fields': 'id,nombre',
			'order': [{field: 'nombre', direction: 'asc'}]
		}
	});
}]);