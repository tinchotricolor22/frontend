angularApp.controller('MisReservasCtrl', ['$scope', '$modal', 'ui.config', 'growl', 'Reserva', 'UserService', 'Usuario', 'Centro', 'JumbotronService', function($scope, $modal, uiConfig, growl, Reserva, UserService, Usuario, Centro, JumbotronService) {

    JumbotronService.showJumbotron = false;
    var estados = {
        'CONFIRMACION_PENDIENTE': 0,
        'CONFIRMADA': 1,
        'CANCELADA': 2,
        'CUMPLIDA':3
    };

    $scope.turnos = [{
        textColor: '#696969',
        backgroundColor: '#e2e2e2',
        borderColor: '#d9dbd0',
        events: []
    }, {
        textColor: '#3c763d',
        backgroundColor: '#dff0d8',
        borderColor: '#d6e9c6',
        events: []
    }, {
        textColor: '#a94442',
        backgroundColor: '#f2dede',
        borderColor: '#ebccd1',
        events: []
    }
    , {
            textColor: '#31708F',
            backgroundColor: '#D9EDF7',
            borderColor: '#BCE8F1',
            events: []
        }
    ];

    $scope.calendarClear = function() {
        angular.forEach($scope.turnos, function(turno) {
            turno.events = [];
        });
    };

    $scope.fullCalendarOptions = angular.extend(uiConfig.fullCalendar, {
        editable: false,
        eventClick: function(event) {
            $modal.open(
                {
                    templateUrl: 'app/reserva/modal-view-reserva-calendario.html',
                    controller: 'ModalReservaUserReadCtrl',
                    backdrop: 'static',
                    windowClass: 'normal-modal',
                    keyboard: true,
                    scope: $scope,
                    resolve: {
                        reserva: function() {return event.reserva;},
                        turno: function() {return event.turno;},
                        Centro: function(Centro) {return Centro.get(event.turno.tratamiento.id_centro);}
                    }
                }
            ).result.then(
                function(){
                    $scope.calendarRefresh();
                }
            );
        }
    });

    $scope.calendarRefresh = function() {
		Usuario.all('reservas').getList().then(function(reservas) {
            //Acá el día de mañana cuando tenga filtros (porque va a haber muchos turnos) tengo que agarrarlos y hacer un request filtrado
            $scope.calendarClear();
            angular.forEach(reservas, function(reserva) {
                angular.forEach(reserva.turnos, function(turno) {
                    $scope.turnos[estados[reserva.estado]].events.push({
                        id: turno.id,
                        title: turno.tratamiento.tipo_de_tratamiento.nombre + ' con ' + turno.profesional.nombre + ' ' + turno.profesional.apellido,
                        reserva: reserva,
                        turno: turno,
                        start: turno.diahora_inicio,
                        end: turno.diahora_fin,
                        allDay: false
                    });
                });
            });
        });
    };

    $scope.addEvent = function() {
        $scope.events.push({
            title: 'Open Sesame',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            className: ['openSesame']
        });
    };
    $scope.remove = function(index) {
        $scope.events.splice(index,1);
    };

    $scope.calendarRefresh();
}]);
angularApp.controller('ModalReservaUserReadCtrl', ['$scope', '$modalInstance', 'moment', 'Centro', 'Reserva', 'reserva', 'turno', 'growl', function ($scope, $modalInstance, moment, Centro, Reserva, reserva, turno, growl) {
    $scope.modalInstance = $modalInstance;
    $scope.modal = {};

    $scope.estados = {
        'CONFIRMACION_PENDIENTE': 'Confirmación pendiente',
        'CONFIRMADA': 'Confirmada',
        'CANCELADA': 'Cancelada'
    };

    $scope.modal.moment = moment;
    $scope.modal.centro = Centro;
    $scope.modal.reserva = reserva;
    $scope.modal.turno = turno;

    $scope.modal.eliminar = function() {
        Reserva.one(reserva.id).customPUT({}, 'cancelar').then(function (result) {
            growl.addSuccessMessage('La <b>reserva</b> ha sido eliminada correctamente');
            return $scope.modalInstance.close(result);
        });
    };

}]);