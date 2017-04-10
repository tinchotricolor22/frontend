angularApp.controller('ModalIntervaloBloqueoReadCtrl', ['$scope', '$modalInstance', 'moment', 'ProfesionalCentro', 'growl', function($scope, $modalInstance, moment, ProfesionalCentro, growl) {
	$scope.modalInstance = $modalInstance;
	$scope.modal = {};

	//Configuración de los datepickers
	$scope.modal.datepickerInicio = {
		init: function () {
			this.value = this.minDate = moment().hours(14).minutes(0).seconds(0).toDate();
		},
		open: function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			this.opened = true;
		}
	};
	$scope.modal.datepickerFin = angular.copy($scope.modal.datepickerInicio);

	$scope.modal.datepickerInicio.init();
	$scope.modal.datepickerFin.init();

    $scope.modal.select = function() {
		var inicio = moment($scope.modal.datepickerInicio.value),
			fin = moment($scope.modal.datepickerFin.value);
		if (!inicio.isBefore(fin)) {
			return growl.addErrorMessage('La fecha de inicio del bloqueo no puede ser posterior a la fecha de fin');
		} else if (fin.diff(inicio, 'days') > 15) {
			return growl.addErrorMessage('El rango de fechas del bloqueo no puede ser mayor a 15 días');
		} else {
			return $scope.modalInstance.close({
				id_centro: ProfesionalCentro.parentResource.id,
				id_profesional: $scope.modal.id_profesional,
				diahora_inicio: inicio.format('YYYY-MM-DD HH:mm:ss'),
				diahora_fin: fin.format('YYYY-MM-DD HH:mm:ss')
			});
		}
    };

	$scope.modal.profesionales = ProfesionalCentro;
}]);