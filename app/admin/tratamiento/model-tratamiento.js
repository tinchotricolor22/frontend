angular.module('resources').factory('Tratamiento', ['BaseModel', function(BaseModel) {
	return BaseModel('tratamiento', {
		listParams: {
			'fields': 'id,nombre',
			'order': [{field: 'nombre', direction: 'asc'}]
		}
	});
}]);