angularApp.controller('CentroCtrl', [
        '$scope', '$document', '$routeParams', '$modal', '$location', '$rootScope', '$filter', 'moment', 'growl', 'UserService', 'Centro', 'Turno', 'JumbotronService', 'Tratamiento', 'showProfesionales', 'Restangular',
function($scope, $document, $routeParams, $modal, $location, $rootScope, $filter, moment, growl, UserService, Centro, Turno, JumbotronService, Tratamiento, showProfesionales, Restangular) {
    $document.scrollTo(angular.element(document.getElementById('main-jumbotron')));

    $scope.centro = Centro;
    $rootScope.pageTitle = 'Reservá turnos en ' + $scope.centro.nombre;
    $scope.tratamiento = angular.copy(Tratamiento);
    $scope.showProfesionales = showProfesionales;
    $scope.reserva       = {
        centro: $scope.centro,
        // Inherits from parent controller
        tratamiento: $scope.tratamiento,
        selectedHorario: {}
    };

    $scope.$watch('tratamiento.index', function (index, oldIndex) {
        if (index && index !== oldIndex) {
            angular.extend($scope.tratamiento, $scope.tratamientos[index]);

            if ($scope.showProfesionales) {
                $scope.loadDisponibilidad();
            }
        }
    });

    var jumboTitle = (typeof $scope.centro.localidad === 'undefined' || !$scope.centro.localidad)
        ? $scope.centro.nombre
        : $scope.centro.nombre + ' (' + $scope.centro.localidad.nombre + ')';
    angular.extend(JumbotronService, {
        requestEmail: false,
        imgUrl: $scope.centro.url_foto_portada,
        class: {"jumbotron-perfil-centro":1},
        title: jumboTitle
    });
    JumbotronService.refreshImg();


	Centro.getList('tratamientos', {fields: 'tipo_de_tratamiento'}).then(function (response){
        $scope.tratamientos = $filter('orderBy')(response, 'nombre');
        if ($scope.tratamientos.length === 0) {
            return growl.addErrorMessage('El centro no posee tratamientos asociados.');
        }
        if ($scope.tratamiento.id) {
            angular.forEach($scope.tratamientos, function(tratamiento, index) {
                if (tratamiento.id ===  $scope.tratamiento.id) {
                    $scope.tratamiento = angular.copy(tratamiento);
                    $scope.tratamiento.index = index;
                }
            });
        }
    });

    $scope.changePath = function () {
        $location.path("/centro/" + $scope.centro.id + "/tratamiento/" + $scope.tratamiento.id + "/reserva/" + moment($scope.reserva.fecha).format('YYYY-MM-DD HH:mm'));
    };

    $scope.mostrarProfesionales = function () {
        if (!$scope.showProfesionales) {
            $scope.showProfesionales = true;
        } else {
            $scope.cargarProfesionales();
        }
    };

    $scope.isEmpty = function (ob) {
        return (Object.keys(ob).length === 0);
    };

    var fecha = $routeParams.fecha? new Date($routeParams.fecha.replace(/-/g, "/")) : null;
    $scope.datepicker = {
        init: function (date) {
            $scope.datepicker.dt = date || new Date();
            $scope.datepicker.minDate = $scope.datepicker.minDate ? null : new Date();
        },

        open: function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.datepicker.opened = true;
        },

        dateOptions: {
            formatYear: 'yy',
            startingDay: 1,
            showWeeks:'false',
            showButtonBar: 'false',
            showButtonPanel: 'false'
        },

        initDate: new Date('2016-15-20'),
        format: 'dd/MM/yyyy'
    };
    $scope.datepicker.init(fecha);

    $scope.timepicker = {
        time: new Date(),
        hstep: 1,
        mstep: 15,
        showMeridian: false,

        init: function (date) {
            if (date) {
                $scope.timepicker.time = date
            } else {
                $scope.timepicker.time.setMinutes(0);
                $scope.timepicker.time.setHours($scope.timepicker.time.getHours() + 1);
            }
        }
    };
    $scope.timepicker.init(fecha);


    $scope.cargarProfesionales = function () {
        $document.scrollTo(angular.element(document.getElementById('reserva-section')));

        $scope.datepicker.dt.setMinutes($scope.timepicker.time.getMinutes());
        $scope.datepicker.dt.setHours($scope.timepicker.time.getHours());
        $scope.reserva.fecha = $scope.datepicker.dt;
        $scope.changePath();

        if (!$scope.profesionales || $scope.profesionales.length === 0) {
            $scope.centro.all('profesionales').getList().then(function (response) {
                $scope.profesionales = response.plain();
            });
        }

        $scope.$watch(function () {if ($scope.reserva.fecha) return $scope.reserva.fecha.getDate();}, function (nuevaFecha, viejaFecha) {
            if ($scope.showProfesionales && nuevaFecha && nuevaFecha !== viejaFecha) {
                $scope.loadDisponibilidad();
            }
        });
    };

    $scope.$watch('showProfesionales', function (showProfesionales) {
        if (showProfesionales) {
            $scope.cargarProfesionales();
        }
    });

    $scope.selectedTratamiento = {id: null};

    $scope.bajaFecha = function () {
        if (this.reserva.fecha.getDate() - 1 < (new Date()).getDate()) {
            return growl.addErrorMessage('No puedes pedir un turno anterior al día de hoy.');
        }
        this.reserva.fecha.setDate(this.reserva.fecha.getDate() - 1);
        $scope.changePath();
    };

    $scope.subeFecha = function () {
        this.reserva.fecha.setDate(this.reserva.fecha.getDate() + 1);
        $scope.changePath();
    };

    $scope.getHorariosBase = function () {
        var horario = [];
        var offset = 190; // Minutos
        var fecha = new Date($scope.reserva.fecha.getTime());
        fecha.setMinutes(0);
        var fechaMaxima = new Date(fecha.getTime());
        fechaMaxima.setMinutes(fecha.getMinutes() + offset);
        var fechaMinima = new Date(fecha.getTime());
        fechaMinima.setMinutes(fecha.getMinutes() - offset);
        var fraccion = parseInt($scope.centro.duracion_fraccion);
        var tmpFecha = new Date(fecha.getTime());
        while (tmpFecha.getTime() >= fechaMinima.getTime()) {
            horario.push(tmpFecha.toTimeString().substr(0, 5));
            tmpFecha.setMinutes(tmpFecha.getMinutes() - fraccion);
        }
        fecha.setMinutes(fecha.getMinutes() + fraccion);
        while (fecha.getTime() < fechaMaxima.getTime()) {
            horario.push(fecha.toTimeString().substr(0, 5));
            fecha.setMinutes(fecha.getMinutes() + fraccion);
        }
        return horario.sort();
    };

    $scope.selectHorario = function (profesional, horario) {
        if (horario.reserved) {
            return growl.addErrorMessage('El turno de las ' + horario['hora'] + ' se encuentra reservado o no disponible.');
        }
        // Deselecciono todos los horarios y selecciono el que se clickeó
        $scope.reserva.selectedHorario.selected = false;
        $scope.reserva.selectedHorario = horario;
        $scope.reserva.selectedHorario.selected = true;
        $scope.reserva.profesional = profesional;
    };

    $scope.primerProfDisponible = {empty: true};
    $scope.loadPrimerProfDisponible = function (horariosProfesionales) {
        $scope.primerProfDisponible = {empty: true};
        if (Object.keys(horariosProfesionales).length === 0) {
            return;
        }
        $scope.primerProfDisponible.empty = false;
        var ppdHorarios = $scope.primerProfDisponible.horarios = {};
        // Itero sobre todos los horarios de todos los profesionales y los mergeo
        angular.forEach(horariosProfesionales, function (horarioProfesional, index){
            if (horarioProfesional.length === 0) {
                return;
            }
            var profesionalIteracion = null;
            angular.forEach($scope.profesionales, function (profesional) {
                if (profesional.id === parseInt(index)) { // Busco el profesional asociado al horario
                    profesionalIteracion = profesional;
                }
            });
            angular.forEach(horarioProfesional, function (horario) {
                // Verifico si hay alguien que ya atienda en ese horario y sino lo agrego
                if (typeof ppdHorarios[horario['hora']] === 'undefined') {
                    ppdHorarios[horario['hora']] = angular.copy(horario);
                    ppdHorarios[horario['hora']]['profesional'] = profesionalIteracion;
                }
            });
        });
    };

    $scope.horarios = false;
    $scope.loadDisponibilidad = function () {
        if (!$scope.tratamiento || !$scope.tratamiento.id) {
            return;
        }
        Tratamiento.id = $scope.tratamiento.id;
        Tratamiento.all('disponibilidad').customGET($filter('date')($scope.reserva.fecha, 'yyyy-MM-dd HH:mm') + ':00').then(
            function (disponibilidadProfesionales) {
                disponibilidadProfesionales = disponibilidadProfesionales.plain();
                $scope.horarios = {};
                angular.forEach(disponibilidadProfesionales, function (horarioDisponible, idProfesional) {
                    if (horarioDisponible.length === 0) {
                        return false;
                    }
                    angular.forEach($scope.getHorariosBase(),
                        function (horario) {
                            if (horarioDisponible.indexOf(horario) != -1) {
                                if (!$scope.horarios[idProfesional]) {
                                    $scope.horarios[idProfesional] = [];
                                }
                                $scope.horarios[idProfesional].push({
                                    hora: horario
                                });
                            }
                        });
                });

                $scope.loadPrimerProfDisponible($scope.horarios);
            }
        );
    }

    // Reserva confirm dialog modal
    $scope.reservaModal = null;
    $scope.openReservaDialog = function () {

        if (!$scope.reservaModal) {
            if (!$scope.reserva.selectedHorario
                || Object.keys($scope.reserva.selectedHorario).length === 0) {
                growl.addErrorMessage('No se ha seleccionado ningún horario.');
                return false;
            }
            $scope.reserva.fechaIni = $scope.reserva.fecha.getFullYear() + '-'
                + ('0' + ($scope.reserva.fecha.getMonth()+1)).slice(-2) + '-'
                + ('0' + $scope.reserva.fecha.getDate()).slice(-2) + ' '
                + $scope.reserva.selectedHorario['hora'] + ':00';

            $scope.reservaModal = $modal.open({
                templateUrl: 'app/reserva/view-modal-reserva.html',
                controller: 'ReservaCreateCtrl',
                windowClass: 'large-dialog large-modal',
                resolve: {
                    reserva: function () {
                        var data={
                            reserva:$scope.reserva,
                            centro_id:$scope.centro.id

                        };
                        return data;
                    }
                },
                keyboard: true
            });

            this.reservaModal.result.then(this.onReservaModalClose, this.onReservaModalClose);
        }
    };

    $scope.onReservaModalClose = function () {
        $scope.reservaModal = null;
    };

}]);
