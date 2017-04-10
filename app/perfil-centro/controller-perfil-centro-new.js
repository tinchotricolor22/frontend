angularApp.controller('Centro-newCtrl', [
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

        $scope.object2 = 'http://dev.wonoma.com/assets/img/anon.jpg';
        $scope.upload2 = function(files) {
            Upload.post(files[0]).then(function(result) {
                $scope.object = result.url;
            });
        };

        $scope.$watch('tratamiento.index', function (index, oldIndex) {
            if (!index){
                $scope.showProfesionales = false;
                $scope.showFechas = false;
                $scope.current_badge = 1;
            }
            if (index && index !== oldIndex) {
                $scope.mostrarProfesionales();
                $scope.current_badge = 2;
                $scope.searchOn = function(){
                    for(var i = 0; i < $scope.tipoDeTratamientos.length; i++){
                        for(var j = 0; j < $scope.tipoDeTratamientos[i].tratamientos.length; j++){
                            if($scope.tipoDeTratamientos[i].tratamientos[j].nombre == index){
                                $scope.tratamientoSelected = $scope.tipoDeTratamientos[i].tratamientos[j].id;
                            }
                        }
                    }
                };
                $scope.searchOn();
                $scope.cargarPros();
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

        /*
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
         */

        Restangular.one('centro/'+Centro.id+'/tratamiento-portal').get().then(function (response) {

            $scope.tipoDeTratamientos = $filter('orderBy')(response, 'nombre');

            /*
            if ($scope.tratamientos.length === 0) {
                return growl.addErrorMessage('El centro no posee tratamientos asociados.');
            }
            if ($scope.tratamiento.id) {
                angular.forEach($scope.tratamientos, function(tratamiento, index) {
                    if (tratamiento.id ===  $scope.tratamiento.id) {
                        $scope.tratamiento = angular.copy(tratamiento);
                        $scope.tratamiento.index = index;
                        angular.forEach($scope.tratamientos.tratamientos, function(){
                            $scope.tratamiento_centro = angular.copy($scope.tratamientos.tratamientos);
                        });
                    }
                });
            }
            */

        });

        $scope.mostrarProfesionales = function () {
            if (!$scope.showProfesionales) {
                $scope.showProfesionales = true;
            }
        };

        $scope.cargarPros = function(){
            Restangular.one('tratamiento',$scope.tratamientoSelected).one('profesionales').get().then(function(result){
/*
                $scope.pros = [
                    {nombre: 'Jesus', url_foto_perfil: 'https://s3.amazonaws.com/wonoma-local/e4e00878cf6ded77ef7c80ace95ad098_square'},
                    {nombre: 'David', url_foto_perfil: 'https://s3.amazonaws.com/wonoma-local/e4e00878cf6ded77ef7c80ace95ad098_square'},
                    {nombre: 'Rogelio', url_foto_perfil: 'https://s3.amazonaws.com/wonoma-local/e4e00878cf6ded77ef7c80ace95ad098_square'},
                    {nombre: 'Barbara', url_foto_perfil: 'https://s3.amazonaws.com/wonoma-local/e4e00878cf6ded77ef7c80ace95ad098_square'},
                    {nombre: 'Mirtha', url_foto_perfil: 'https://s3.amazonaws.com/wonoma-local/e4e00878cf6ded77ef7c80ace95ad098_square'},
                    {nombre: 'Alvaro', url_foto_perfil: 'https://s3.amazonaws.com/wonoma-local/e4e00878cf6ded77ef7c80ace95ad098_square'},
                    {nombre: 'Moises', url_foto_perfil: 'https://s3.amazonaws.com/wonoma-local/e4e00878cf6ded77ef7c80ace95ad098_square'},
                    {nombre: 'Lara', url_foto_perfil: 'https://s3.amazonaws.com/wonoma-local/e4e00878cf6ded77ef7c80ace95ad098_square'},
                    {nombre: 'Karla', url_foto_perfil: 'https://s3.amazonaws.com/wonoma-local/e4e00878cf6ded77ef7c80ace95ad098_square'},
                    {nombre: 'Jose', url_foto_perfil: 'https://s3.amazonaws.com/wonoma-local/e4e00878cf6ded77ef7c80ace95ad098_square'},
                ];
*/
                $scope.pros = result;

                $scope.pros.unshift({},{});
                $scope.pros.push({},{});

                for(var i = 0; i < $scope.pros.length; i++){
                    $scope.pros[i].estado = 'unselected';
                    $scope.pros[i].id_position = i;
                }

                //alert($scope.pros.length);

                $scope.start = 2;
                $scope.end = 7;

                $scope.selectMe = function(id){
                    var noLength = $scope.pros.length;
                    noLength -= 2;
                    if(id > 1 && id < noLength)
                    {
                        $scope.searchSELECT = function(){
                            for(var i= 0; i < $scope.pros.length; i++){
                                if($scope.pros[i].estado == 'selected'){
                                    $scope.pros[i].estado = 'unselected';
                                }
                            }
                        };
                        $scope.searchSELECT();
                        $scope.pros[id].estado = 'selected';
                        $scope.start = id-2;
                        $scope.end = id+3;
                        $scope.cargarFechas($scope.pros[id].id);
                    }
                };

                $scope.selectNEXT = function(){
                    $scope.searchNEXTSELECT = function(){
                        for(var i = 0; i < $scope.pros.length; i++){
                            if($scope.pros[i].estado == 'selected'){
                                var a = i+1;
                            }
                        }
                        $scope.selectMe(a);
                    };
                    $scope.searchNEXTSELECT();
                };

                $scope.selectPREV = function(){
                    $scope.searchPREVSELECT = function(){
                        for(var i = 0; i < $scope.pros.length; i++){
                            if($scope.pros[i].estado == 'selected'){
                                var a = i-1;
                            }
                        }
                        $scope.selectMe(a);
                    };
                    $scope.searchPREVSELECT();
                };
            });
        };

        /*
        $scope.cargarHorarios = function(id,dia){
            Restangular.one('profesional/'+id+'/disponibilidad/'+dia).get().then(function(result){
            });
        };
        */

        $scope.cargarFechas = function(id){
            $scope.showFechas = true;
            $scope.current_badge = 3;

            Restangular.one('profesional/'+id+'/disponibilidad').get().then(function(result){
                $scope.fechas = result;

                $scope.generarFechasPasadas = function(){
                    switch($scope.fechas[0].dia){
                        case 'Lunes':
                            $scope.fechas2 = {};
                            $scope.fecha_start = 0;
                            $scope.fecha_end= 7;
                            $scope.primeraSemana = false;
                            break;
                        case 'Martes':
                            $scope.fechas2 = [
                                {dia: 'Lunes', fecha: $scope.fechas[0].fecha-1, blocked: true}
                            ];
                            $scope.fecha_start = 0;
                            $scope.fecha_end= 6;
                            $scope.primeraSemanaEND = 6;
                            $scope.primeraSemana = true;
                            break;
                        case 'Miércoles':
                            $scope.fechas2 = [
                                {dia: 'Lunes', fecha:  $scope.fechas[0].fecha-2, blocked: true},
                                {dia: 'Martes', fecha:  $scope.fechas[0].fecha-1, blocked: true}
                            ];
                            $scope.fecha_start = 0;
                            $scope.fecha_end= 5;
                            $scope.primeraSemanaEND = 5;
                            $scope.primeraSemana = true;
                            break;
                        case 'Jueves':
                            $scope.fechas2 = [
                                {dia: 'Lunes', fecha:  $scope.fechas[0].fecha-3, blocked: true},
                                {dia: 'Martes', fecha:  $scope.fechas[0].fecha-2, blocked: true},
                                {dia: 'Miércoles', fecha:  $scope.fechas[0].fecha-1, blocked: true}
                            ];
                            $scope.fecha_start = 0;
                            $scope.fecha_end= 4;
                            $scope.primeraSemanaEND = 4;
                            $scope.primeraSemana = true;
                            break;
                        case 'Viernes':
                             $scope.fechas2 = [
                             {dia: 'Lunes', fecha:  $scope.fechas[0].fecha-4, blocked: true},
                             {dia: 'Martes', fecha:  $scope.fechas[0].fecha-3, blocked: true},
                             {dia: 'Miércoles', fecha:  $scope.fechas[0].fecha-2, blocked: true},
                             {dia: 'Jueves', fecha:  $scope.fechas[0].fecha-1, blocked: true}
                             ];
                            $scope.fecha_start = 0;
                            $scope.fecha_end= 3;
                            $scope.primeraSemanaEND = 3;
                            $scope.primeraSemana = true;
                            break;
                        case 'Sábado':
                             $scope.fechas2 = [
                             {dia: 'Lunes', fecha:  $scope.fechas[0].fecha-5, blocked: true},
                             {dia: 'Martes', fecha:  $scope.fechas[0].fecha-4, blocked: true},
                             {dia: 'Miércoles', fecha:  $scope.fechas[0].fecha-3, blocked: true},
                             {dia: 'Jueves', fecha:  $scope.fechas[0].fecha-2, blocked: true},
                             {dia: 'Viernes', fecha:  $scope.fechas[0].fecha-1, blocked: true}
                             ];
                            $scope.fecha_start = 0;
                            $scope.fecha_end= 2;
                            $scope.primeraSemanaEND = 2;
                            $scope.primeraSemana = true;
                            break;
                        case 'Domingo':
                            $scope.fechas2 = [
                                {dia: 'Lunes', fecha:  $scope.fechas[0].fecha-6, blocked: true},
                                {dia: 'Martes', fecha:  $scope.fechas[0].fecha-5, blocked: true},
                                {dia: 'Miércoles', fecha:  $scope.fechas[0].fecha-4, blocked: true},
                                {dia: 'Jueves', fecha:  $scope.fechas[0].fecha-3, blocked: true},
                                {dia: 'Viernes', fecha:  $scope.fechas[0].fecha-2, blocked: true},
                                {dia: 'Sabado', fecha:  $scope.fechas[0].fecha-1, blocked: true}
                            ];
                            $scope.fecha_start = 0;
                            $scope.fecha_end= 1;
                            $scope.primeraSemanaEND= 1;
                            $scope.primeraSemana = true;
                            break;
                        default:
                            alert("Se ha producido un Error en los dias pasados.");
                            break;
                    }
                };


                $scope.generarFechasPasadas();

                for(var i = 0; i < $scope.fechas.length; i++){
                    $scope.fechas[i].orden = i;
                    $scope.fechas[i].estado = 'inactive';
                }
                $scope.fechaSelected = false;
                $scope.generarMes = function(){
                    $scope.mesGenerado = $scope.fechas[$scope.fecha_start+3].mes;
                };
                $scope.generarAno = function(){
                    $scope.anoGenerado = $scope.fechas[$scope.fecha_start+3].ano;
                };

                $scope.generarMes();
                $scope.generarAno();

                $scope.diaMinified = function(dia){
                    switch(dia){
                        case 'Lunes':
                            return 'LUN';
                            break;
                        case 'Martes':
                            return 'MAR';
                            break;
                        case 'Miércoles':
                            return 'MIE';
                            break;
                        case 'Jueves':
                            return 'JUE';
                            break;
                        case 'Viernes':
                            return 'VIE';
                            break;
                        case 'Sábado':
                            return 'SAB';
                            break;
                        case 'Domingo':
                            return 'DOM';
                            break;
                        default:
                            alert("Se ha producido un Error a la hora de asignar los dias.");
                            break;
                    }
                };

                $scope.setACTIVE = function(orden){
                    for(var i = 0; i < $scope.fechas.length; i++){
                        if($scope.fechas[i].estado == 'active'){
                            $scope.fechas[i].estado = 'inactive';
                        }
                    }
                    $scope.fechas[orden].estado = 'active';
                    $scope.fechaSelected = true;
                };

                $scope.nextWeek = function(){
                    if($scope.fecha_end < 363){
                        $scope.searchNEXTACTIVE = function(){
                            if($scope.fechaSelected)
                            {
                                for(var i = 0; i < $scope.fechas.length; i++){
                                    if($scope.fechas[i].estado == 'active'){
                                        $scope.fechas[i].estado = 'inactive';
                                        var a = i+7;
                                    }
                                }
                                if(a<364){if($scope.fechas[a].blocked == false) $scope.fechas[a].estado = 'active';}
                            }
                        };
                        $scope.searchNEXTACTIVE();
                        if($scope.primeraSemana == true){
                            $scope.primeraSemana = false;
                            $scope.fecha_start += $scope.primeraSemanaEND;
                            $scope.fecha_end += 7;
                        } else{
                            $scope.fecha_start += 7;
                            $scope.fecha_end += 7;
                        }
                        $scope.generarMes();
                        $scope.generarAno();
                    }
                };

                $scope.prevWeek = function(){
                    if($scope.fecha_start > 0){
                        $scope.searchPREVACTIVE = function(){
                            if($scope.fechaSelected)
                            {
                                for(var i = 0; i < $scope.fechas.length; i++){
                                    if($scope.fechas[i].estado == 'active'){
                                        $scope.fechas[i].estado = 'inactive';
                                        var a = i-7;
                                    }
                                }
                                if(a>0){if($scope.fechas[a].blocked == false) $scope.fechas[a].estado = 'active';}
                            }
                        };
                        if($scope.fecha_start-$scope.primeraSemanaEND < 7 ){
                            $scope.primeraSemana = true;
                            $scope.fecha_start -= $scope.primeraSemanaEND;
                            $scope.fecha_end -= 7;
                        } else{
                            $scope.fecha_start -= 7;
                            $scope.fecha_end -= 7;
                        }
                        $scope.searchPREVACTIVE();
                        $scope.generarMes();
                        $scope.generarAno();

                    }
                };
            });
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

        /*
        $scope.$watch('showProfesionales', function (showProfesionales) {
            if (showProfesionales) {
                $scope.cargarProfesionales();
            }
        });
        */

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
                            return $scope.reserva;
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

        $scope.selected = function(cords) {
            $scope.cropped=true;
            var rx = 150 / cords.w;
            var ry = 150 / cords.h;

            $('#preview').css({
                width: Math.round(rx * boundx) + 'px',
                height: Math.round(ry * boundy) + 'px',
                marginLeft: '-' + Math.round(rx * cords.x) + 'px',
                marginTop: '-' + Math.round(ry * cords.y) + 'px'
            });
        };

    }]);


angularApp.directive('imgCropped', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: { src:'@', selected:'&' },
        link: function(scope,element, attr) {
            var myImg;
            var clear = function() {
                if (myImg) {
                    myImg.next().remove();
                    myImg.remove();
                    myImg = undefined;
                }
            };
            scope.$watch('src', function(nv) {
                clear();
                if (nv) {
                    element.after('<img />');
                    myImg = element.next();
                    myImg.attr('src',nv);
                    $(myImg).Jcrop({
                            trackDocument: true,
                            onSelect: function(x) {
                                scope.$apply(function() {
                                    scope.selected({cords: x});
                                });
                            }
                        },
                        function () {
                            // Use the API to get the real image size
                            var bounds = this.getBounds();
                            boundx = bounds[0];
                            boundy = bounds[1];
                        });
                }
            });

            scope.$on('$destroy', clear);
        }
    };
});

angularApp.filter('slice', function() {
    return function(arr, start, end) {
        arr = arr || [];
        return arr.slice(start, end);
    };
});

angularApp.filter('slice-fecha', function() {
    return function(arr, start, end) {
        arr = arr || [];
        return arr.slice(start, end);
    };
});
