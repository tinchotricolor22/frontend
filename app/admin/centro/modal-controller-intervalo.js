angularApp.controller('ModalIntervaloReadCtrl', ['$scope', '$modalInstance', 'moment', 'growl', function($scope, $modalInstance, moment, growl) {

	$scope.modalInstance = $modalInstance;
	$scope.modal = {};

	$scope.dias_semana = [
		{id: 0, nombre: 'lunes'},
		{id: 1, nombre: 'martes'},
		{id: 2, nombre: 'miércoles'},
		{id: 3, nombre: 'jueves'},
		{id: 4, nombre: 'viernes'},
		{id: 5, nombre: 'sábado'},
		{id: 6, nombre: 'domingo'}
	];

	var d = new Date();
	d.setHours(14);
	d.setMinutes(0);
	$scope.modal.hora_inicio = d;
	$scope.modal.hora_fin = d;

    $scope.modal.select = function() {
		var hora_inicio = moment($scope.modal.hora_inicio),
			hora_fin = moment($scope.modal.hora_fin);

		if (!hora_inicio.isBefore(hora_fin)) {
			growl.addErrorMessage('La hora de fin debe ser posterior a la hora de inicio');
		} else {
			$scope.modalInstance.close({
				dia: $scope.modal.dia,
				hora_inicio: hora_inicio.format('HH:mm'),
				hora_fin: hora_fin.format('HH:mm')
			});
		}
    }
}]);