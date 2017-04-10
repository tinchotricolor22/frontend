angularApp.controller('ModalReservaCreateCtrl', ['$scope', '$modalInstance', '$filter', 'moment', 'Centro', 'TratamientoCentro', 'Tratamiento', 'ProfesionalCentro', 'Reserva', 'growl', '$http', function ($scope, $modalInstance, $filter, moment, Centro, TratamientoCentro, Tratamiento, ProfesionalCentro, Reserva, growl, $http) {
    $scope.modalInstance = $modalInstance;
	$scope.modal = {};

	$scope.modal.tratamientos = $filter('orderBy')(TratamientoCentro, 'nombre');
	$scope.modal.isLoading = function() {
		return $http.pendingRequests.length !== 0;
	};

	//Configuración del datepicker
	$scope.modal.datepicker = {
		init: function () {
			$scope.modal.datepicker.value = $scope.modal.datepicker.minDate = new Date();
		},
		open: function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.modal.datepicker.opened = true;
		}
	};
	$scope.modal.datepicker.init();

	//Configuración del timepicker
	$scope.modal.reserva_hora = new Date(null, null, null, 14, 00);

	//Elegir profesional/horario
	$scope.modal.profesionales = ProfesionalCentro;
	if ($scope.modal.profesionales.length) {
		$scope.modal.profesionales[0].visible = true;
	}

	$scope.modal.centro = Centro; //Lo necesito en la view
	$scope.modal.selectedTurno = {fecha: new Date(), hora: null, id_profesional: null};

	$scope.modal.buscar = function() {
		$scope.modal.selectedTurno.fecha = $scope.modal.datepicker.value;
		$scope.modal.selectedTurno.fecha.setHours($scope.modal.reserva_hora.getHours());
		$scope.modal.selectedTurno.fecha.setMinutes($scope.modal.reserva_hora.getMinutes());
		$scope.modal.selectedTurno.fecha.setSeconds(0);
		var horarios_base = $scope.modal.getHorariosBase(angular.copy($scope.modal.selectedTurno.fecha));
		$scope.modal.tratamiento = $scope.modal.tratamientos[$scope.modal.id_selected_tratamiento];

		Tratamiento.one($scope.modal.tratamiento.id).all('disponibilidad').customGET(moment($scope.modal.selectedTurno.fecha).format('YYYY-MM-DD HH:mm:ss')).then(function (disponibilidadProfesionales) {
			$scope.modal.horarios = [];
			angular.forEach(disponibilidadProfesionales.originalElement, function (horariosDisponibles, idProfesional) {
				$scope.modal.horarios[idProfesional] = [];
				angular.forEach(horariosDisponibles, function (horario) {
					$scope.modal.horarios[idProfesional].push({
						hora: horario,
						reserved: false
					});
				});
			});
		});
	};

	$scope.modal.getHorariosBase = function(fecha_hora) {
		var horarios = [], cantidadMostrarAntes = 5, cantidadMostrarTotal = 16;
		fecha_hora.setMinutes(fecha_hora.getMinutes() - parseInt($scope.modal.centro.duracion_fraccion) * cantidadMostrarAntes);
		for (var i = 0; i < cantidadMostrarTotal; i++) {
			horarios.push(moment(fecha_hora).format('HH:mm'));
			fecha_hora.setMinutes(fecha_hora.getMinutes() + $scope.modal.centro.duracion_fraccion);
		}
		return horarios;
	};

	$scope.modal.bajaFecha = function () {
		$scope.modal.datepicker.value.setDate($scope.modal.selectedTurno.fecha.getDate() - 1);
		$scope.modal.buscar();
	};

	$scope.modal.subeFecha = function () {
		$scope.modal.datepicker.value.setDate($scope.modal.selectedTurno.fecha.getDate() + 1);
		$scope.modal.buscar();
	};

	$scope.modal.selectHorario = function (profesional, horario) {
		if (!horario.reserved) {
			$scope.modal.selectedHorario = {id_profesional: profesional.id, hora: horario.hora};
		}
	};

	$scope.modal.reservar = function(id_profesional) {
		if ($scope.modal.selectedHorario.id_profesional != id_profesional) {
			growl.addErrorMessage('No ha seleccionado ningún horario de ese profesional');
		} else if (!$scope.modal.cliente) {
			growl.addErrorMessage('No ha ingresado el nombre del cliente');
		} else if (!$scope.modal.contacto) {
			growl.addErrorMessage('No ha ingresado el número de contacto del cliente');
		} else {
			var aux = moment($scope.modal.selectedHorario.hora, 'HH:mm');
			$scope.modal.selectedTurno.fecha.setHours(aux.format('HH'));
			$scope.modal.selectedTurno.fecha.setMinutes(aux.format('mm'));
			Reserva.post({
				estado: 'CONFIRMADA',
				nombre: $scope.modal.cliente,
				contacto: $scope.modal.contacto,
                email: $scope.modal.email,
                origen: 'Manual',
				turnos: [{
					id_tratamiento: $scope.modal.tratamiento.id,
					id_profesional: $scope.modal.selectedHorario.id_profesional,
					diahora_inicio: moment($scope.modal.selectedTurno.fecha).format('YYYY-MM-DD HH:mm:ss'),
					observaciones: $scope.modal.observaciones
				}]
			}).then(function (result) {
				growl.addSuccessMessage('La <b>reserva</b> ha sido creada correctamente');
				return $scope.modalInstance.close(result);
			});
		}
	};
}]);
angularApp.controller('ModalReservaUpdateCtrl', ['$scope', '$modalInstance', 'moment', 'Reserva', 'reserva', 'turno', 'growl', function ($scope, $modalInstance, moment, Reserva, reserva, turno, growl) {
	$scope.modalInstance = $modalInstance;
	$scope.modal = {};

	$scope.estados = {
		'CONFIRMACION_PENDIENTE': 'Confirmación pendiente',
		'CONFIRMADA': 'Confirmada',
		'CANCELADA': 'Cancelada',
		'CUMPLIDA': 'Finalizada'
	};

	$scope.modal.moment = moment;
	$scope.modal.reserva = reserva;
	$scope.modal.turno = turno;

	$scope.modal.eliminar = function() {
		Reserva.one(reserva.id).customPUT({}, 'cancelar').then(function (result) {
			growl.addSuccessMessage('La <b>reserva</b> ha sido eliminada correctamente');
			return $scope.modalInstance.close(result);
		});
	};

	$scope.modal.confirmar = function() {
		Reserva.one(reserva.id).customGET('confirmar/' + reserva.token_confirmacion).then(function (result) {
			growl.addSuccessMessage('La <b>reserva</b> ha sido eliminada correctamente');
			return $scope.modalInstance.close(result);
		});
	};

	$scope.modal.finalizar = function() {
		Reserva.one(reserva.id).customPUT({}, 'cumplir').then(function (result) {
			growl.addSuccessMessage('La <b>reserva</b> ha sido finalizada correctamente');
			return $scope.modalInstance.close(result);
		});
	};
}]);

angularApp.controller('ModalReservaPresetCreateCtrl', ['$scope', '$modalInstance', '$filter', 'Reserva', 'Tratamientos', 'growl', 'Profesional', function($scope, $modalInstance, $filter, Reserva, Tratamientos, growl, Profesional) {

    $scope.modalInstance = $modalInstance;

    $scope.reserva = Reserva;
    $scope.profesional = Profesional;
    $scope.tratamientos =  $filter('orderBy')(Tratamientos, 'nombre');
    $scope.tiempoReserva = moment($scope.reserva.turnos[0].diahora_inicio).toDate();

    $scope.save = function() {
        if(!$scope.form.$invalid && !$scope.form.$pristine)
        {
        // Reasigno tiempo desde el timepicker
            $scope.reserva.turnos[0].diahora_inicio = moment($scope.tiempoReserva).format('YYYY-MM-DD HH:mm:ss');
            return $scope.reserva.save().then(function(response){
                growl.addSuccessMessage('La <b>reserva</b> ha sido creada correctamente');
                $scope.modalInstance.close(response);
            });
        }
    }
}]);