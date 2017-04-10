angularApp.controller('CalendarioReadCtrl', ['$rootScope', '$scope', '$modal', '$compile', '$timeout', '$location', 'ui.config', 'BaseReadCtrl', 'security', 'Centro', 'UserService', 'Bloqueo', function($rootScope, $scope, $modal, $compile, $timeout, $location, uiConfig, BaseReadCtrl, security, Centro, UserService, Bloqueo) {
	$scope.centroActivo = UserService.data.centroActivo;
	if (! angular.isDefined($scope.centroActivo)) {
        $location.path('/');
    } else {

        $scope.filters = {};
        $scope.filters.ocultar_cancelados = true;
        $scope.filters.id_profesionales = [];
        $scope.title = '';
        $scope.nombreProfesionalSemana = '';
        $scope.Centro = Centro;
        $scope.profesionales = [];
        $scope.indexInicialVisibles=0;
        $scope.id_profesionales_select=[];
        var estados = {
			'BLOQUEO': 0,
			'CONFIRMACION_PENDIENTE': 1,
			'CONFIRMADA': 2,
			'CANCELADA': 3,
			'CUMPLIDA': 4
        };

        var turnosBase = [{
			/* BLOQUEOS */
			textColor: '#696969',
			backgroundColor: '#e2e2e2',
			borderColor: '#d9dbd0',
			events: []
		}, {
			/* CONFIRMACIÓN PENDIENTE */
			textColor: '#696969',
			backgroundColor: '#e2e2e2',
			borderColor: '#d9dbd0',
			events: []
		}, {
			/* CONFIRMADOS */
			textColor: '#3c763d',
			backgroundColor: '#dff0d8',
			borderColor: '#d6e9c6',
			events: []
		}, {
			/* CANCELADOS */
			textColor: '#a94442',
			backgroundColor: '#f2dede',
			borderColor: '#ebccd1',
			events: []
		}, {
			/* CUMPLIDOS */
			textColor: '#31708f',
			backgroundColor: '#d9edf7',
			borderColor: '#bce8f1',
			events: []
		}];

        $scope.modoDia = true;
        $scope.turnosServer = [];
		$scope.bloqueosServer = [];

        $scope.turnosDia = {};
        $scope.turnosSemana = angular.copy(turnosBase);

        var cleanUpFunc = $rootScope.$on('cambioCentro', function () {
            $location.path('/calendar');
        });
        $scope.$on('$destroy', function () {
            cleanUpFunc();
        });

        $scope.MoveVisibles=function(direction){

            $scope.id_profesionales_select=[];
            $scope.filters.id_profesionales=[];

            if(direction=='right' && $scope.maxVisibles+$scope.indexInicialVisibles<$scope.profesionales.length)
                if($scope.indexInicialVisibles+1<$scope.profesionales.length)$scope.indexInicialVisibles++;
            if(direction=='left' && $scope.indexInicialVisibles-1>=0)$scope.indexInicialVisibles--;
            for(var i=$scope.indexInicialVisibles;i<$scope.maxVisibles+$scope.indexInicialVisibles;i++)
                $scope.filters.id_profesionales.push($scope.profesionales[i].id.toString());
            $scope.filtroClientSide();

        };




        var resizeBaseWindow=function(){

            $scope.maxVisibles=$scope.cantVisibles;

            if($scope.cantVisibles * $scope.minWidthCalendario + 30>window.innerWidth)
            {
                while($scope.cantVisibles * $scope.minWidthCalendario>window.innerWidth)
                    $scope.cantVisibles--;

            }
            else
            {
                while(($scope.cantVisibles * $scope.minWidthCalendario)+250<window.innerWidth
                    && $scope.cantVisibles<$scope.profesionales.length)
                    $scope.cantVisibles++;

            }

            if($scope.maxVisibles!=$scope.cantVisibles) $scope.resized=true;
            else $scope.resized=false;
            $scope.maxVisibles=$scope.cantVisibles;

            if($scope.filters.id_profesionales.length==0)
                for(var i=$scope.indexInicialVisibles;i<$scope.maxVisibles;i++)
                    $scope.filters.id_profesionales.push($scope.profesionales[i].id.toString());

            else if($scope.filters.id_profesionales.length>$scope.maxVisibles)
                for(var i=$scope.filters.id_profesionales.length;i>$scope.maxVisibles;i--)
                {
                    $scope.filters.id_profesionales.pop();
                    $scope.id_profesionales_select.pop();
                }

            if($scope.id_profesionales_select.length>0)
                for(var i=$scope.filters.id_profesionales.length;i<$scope.id_profesionales_select.length && i<$scope.maxVisibles;i++)
                    $scope.filters.id_profesionales.push($scope.id_profesionales_select[i]);
            if($scope.filters.id_profesionales.length==$scope.profesionales.length)
                $scope.filters.id_profesionales=[];
            $scope.filtroClientSide();
            jQuery('.agenda-profesional>.fc>.fc-content>div>div>div').css('overflow-y','hidden');

        };


        $(window).on("resize.doResize", function (){

            $scope.$apply(function(){
                resizeBaseWindow();
                //do something to update current scope based on the new innerWidth and let angular update the view.
            });
        });

        $scope.$on("$destroy",function (){
            $(window).off("resize.doResize"); //remove the handler added earlier
        });

        /** CONFIG DEL DATEPICKER **/

		$scope.datepicker = {
			init: function () {
				//$scope.datepicker.value = new Date();
				$scope.datepicker.value = moment().startOf('day').toDate();
			},
			open: function ($event) {
				$event.preventDefault();
				$event.stopPropagation();
				$scope.datepicker.opened = true;
			}
		};
		$scope.datepicker.init();

        $scope.$watch('datepicker.value',function(val,oldVal){
            if (val != oldVal) {
                $scope.moverCalendario();
            }
        });

        /** PARA CUANDO HACEN CLICK EN EL NOMBRE DE UN PROFESIONAL **/

        $scope.profesionalClick = function (id_profesional) {
            $scope.filters.id_profesional = id_profesional;
            $scope.modoDia = false;
        };

        /** FUNCIONAMIENTO DE LOS BOTONES DE PREV-TODAY-NEXT Y EL CAMBIO DE MODO (dia/semana) **/

        $scope.setFechas = function (desde, hasta) {
            $scope.filters.desde = desde ? moment(desde).format('YYYY-MM-DD HH:mm:ss') : moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
            $scope.filters.hasta = hasta ? moment(hasta).format('YYYY-MM-DD HH:mm:ss') : moment().startOf('day').add(1, 'days').format('YYYY-MM-DD HH:mm:ss');
        };
        $scope.setFechas();

        $scope.$watch('modoDia', function (val, oldVal) {
            if (val != oldVal) {
                $scope.moverCalendario('today');
            }
        });

        $scope.moverCalendario = function (accion) {
            $('.popover').hide();
            var idCalendario = '#calendarioSemana';
            if ($scope.modoDia) {
                if (accion == 'today') {
					$scope.datepicker.value = moment().startOf('day').toDate();
                } else if (accion == 'prev' || accion == 'next') {
					$scope.datepicker.value = moment($scope.datepicker.value).add((accion == 'prev' ? -1 : 1), 'days').toDate();
                }
                angular.forEach($scope.profesionales, function (profesional) {

                    if (typeof $scope.turnosDia[$scope.pad(profesional.id)]!='undefined' && $scope.turnosDia[$scope.pad(profesional.id)].visible) {
                        idCalendario = '#calendariosDia_' + $scope.pad(profesional.id);
                        angular.element(idCalendario).fullCalendar('gotoDate', $scope.datepicker.value);
                    }
                });
            } else if (['today', 'prev', 'next'].indexOf(accion) >= 0) {
                angular.element(idCalendario).fullCalendar(accion);
            }
            $timeout(function () {
                var view = angular.element(idCalendario).fullCalendar('getView');
                $scope.setFechas(view.start, view.end);
                $scope.title = view.title;

                $scope.calendarRefresh();
            });
        };


        /** LIMPIO, ARMO Y FILTRO EL/LOS CALENDARIO(S) SEGÚN EL MODO Y LOS FILTOS DE PROFESIONALES Y TURNOS CANCELADOS **/

        $scope.vaciarFiltro = function () {
            $scope.id_profesionales_select = [];
            resizeBaseWindow();
            $scope.indexInicialVisibles=0;
            $scope.MoveVisibles('left');
        };

        $scope.calendarClear = function () {
            if ($scope.modoDia) {
                angular.forEach($scope.turnosDia, function (profesional) {
                    angular.forEach(profesional.turnos, function (turno) {
                        turno.events = [];
                    });
                });
            } else {
                angular.forEach($scope.turnosSemana, function (turno) {
                    turno.events = [];
                });
            }
        };

        $scope.pad = function (id_profesional) {
            return ('00000' + id_profesional).slice(-5);
        };

        $scope.instanciarCalendarios = function (profesionales) {
            $scope.turnosDia = {};
            angular.forEach(profesionales, function (profesional) {
                if (!$scope.turnosDia[$scope.pad(profesional.id)]) {
                    $scope.turnosDia[$scope.pad(profesional.id)] = {
                        profesional: profesional,
                        turnos: angular.copy(turnosBase),
                        visible: true,
                        showTime: false
                    };
                }
            });

            // Le asigno el primer filtro al calendario de semana (tiene que haber uno sí o sí)
            /*if ($scope.profesionales.length) {
                $scope.filters.id_profesional = $scope.profesionales[0].id;*/
            if (profesionales.length) {
                $scope.filters.id_profesional = profesionales[0].id;
            }
        };

        $scope.armarObjetoReserva = function (reserva, turno) {
            return {
                id: turno.id,
                title: (reserva.nombre ? reserva.nombre : reserva.usuario.nombre + ' ' + reserva.usuario.apellido) + ' - ' + turno.tratamiento.nombre,
                reserva: reserva,
                turno: turno,
                start: turno.diahora_inicio,
                end: turno.diahora_fin,
                allDay: false
            };
        };

		$scope.armarObjetoBloqueo = function (bloqueo) {
			return {
				id: 'b_' + bloqueo.id,
				title: 'Bloqueo (' + moment(bloqueo.diahora_inicio).format('DD/MM HH:mm') + ' - ' + moment(bloqueo.diahora_fin).format('DD/MM HH:mm') + ')',
				bloqueo: bloqueo,
				start: bloqueo.diahora_inicio,
				end: bloqueo.diahora_fin,
				allDay: false
			};
		};

        $scope.cumpleFiltros = function (reserva, turno) {
            if (($scope.filters.ocultar_cancelados == '1') && (estados[reserva.estado] == estados.CANCELADA)) {
                return false; //Si hay que filtrar los cancelados y el estado es CANCELADA, no cumple
            } else if ($scope.modoDia && $scope.filters.id_profesionales.length && $scope.filters.id_profesionales.indexOf(turno.id_profesional.toString()) < 0) {
                return false; //Si hay que filtrar por profesionales en modo día y no figura en la lista, no cumple
            } else if (!$scope.modoDia && $scope.filters.id_profesional != turno.id_profesional) {
                return false; //Si hay que filtrar por profesional en modo semana y no es el seleccionado, no cumple (debe haber uno seleccionado sí o sí)
            }
            return true; //Si no hay nada que filtrar o pasa los filtros, entonces cumple
        };

        $scope.ocultarMostrarProfesionales = function () {

            if ($scope.modoDia) {
                var firstVisible = true;
                angular.forEach($scope.turnosDia, function (profesional, id_profesional) {
                    profesional.visible = (!$scope.filters.id_profesionales.length || $scope.filters.id_profesionales.indexOf(parseInt(id_profesional).toString()) >= 0);
                    profesional.showTime = profesional.visible ? firstVisible : false;
                    if (profesional.visible) {
                        firstVisible = false;
                        $timeout(function () {
                            angular.element('#calendariosDia_' + $scope.pad(id_profesional)).fullCalendar('gotoDate', $scope.datepicker.value);
                        });
                    }
                });
                $scope.calcularAnchoCalendarios();
            } else {
                if ($scope.filters.id_profesional) {
                    var prof = $scope.turnosDia[$scope.pad($scope.filters.id_profesional)].profesional;
                    $scope.nombreProfesionalSemana = prof.nombre + ' ' + prof.apellido;
                } else {
                    $scope.nombreProfesionalSemana = '';
                }
            }
        };


        $scope.ChangeSelect=function(){

            if( $scope.id_profesionales_select.length>$scope.maxVisibles)
                $scope.id_profesionales_select.shift();

            $scope.filters.id_profesionales=[];
            for(var i=0;i<$scope.id_profesionales_select.length && i<$scope.maxVisibles;i++)
                $scope.filters.id_profesionales.push($scope.id_profesionales_select[i]);
            if($scope.filters.id_profesionales.length==0)
                resizeBaseWindow();

            $scope.filtroClientSide();
            $timeout( function(){ if(!$scope.$$phase) {
                //$digest or $apply
                $(window).trigger('resize');
            }
            }, 200);



        };

        $scope.filtroClientSide = function () {
            $('.popover').hide();
            $scope.calendarClear();
            $scope.ocultarMostrarProfesionales();
            angular.forEach($scope.turnosServer, function (reserva) {
                angular.forEach(reserva.turnos, function (turno) {
                    if ($scope.cumpleFiltros(reserva, turno)) {
                        if ($scope.modoDia) {
                            if(typeof $scope.turnosDia[$scope.pad(turno.id_profesional)] != 'undefined')
                                $scope.turnosDia[$scope.pad(turno.id_profesional)].turnos[estados[reserva.estado]].events.push($scope.armarObjetoReserva(reserva, turno));
                        } else {
                            $scope.turnosSemana[estados[reserva.estado]].events.push($scope.armarObjetoReserva(reserva, turno));
                        }
                    }
                });
            });
			angular.forEach($scope.bloqueosServer, function (bloqueo) {
				bloqueo.estado = 'BLOQUEO';
				if ($scope.cumpleFiltros(bloqueo, bloqueo)) {
					if ($scope.modoDia) {
                        if(typeof $scope.turnosDia[$scope.pad(bloqueo.id_profesional)] !='undefined')
                            $scope.turnosDia[$scope.pad(bloqueo.id_profesional)].turnos[estados[bloqueo.estado]].events.push($scope.armarObjetoBloqueo(bloqueo));
					} else {
						$scope.turnosSemana[estados[bloqueo.estado]].events.push($scope.armarObjetoBloqueo(bloqueo));
					}
				}
			});
        };


        /** CONFIGURACIONES DE LOS CALENDARIOS Y COMPORTAMIENTO **/

        $scope.fullCalendarOptionsSemana = angular.extend(uiConfig.fullCalendar, {
            axisFormat: 'H:mm',
            defaultView: 'agendaWeek',
            slotMinutes: angular.isDefined(UserService.data.centroActivo) ? UserService.data.centroActivo.duracion_fraccion : 15,
            header: {
                left: '',
                center: '',
                right: ''
            },
            height: 1500,
            eventAfterRender: function (event, element, view) {
				if (event.bloqueo) {
					element.popover({
										content: "<strong>Inicio:</strong> " + moment(event.bloqueo.diahora_inicio).format('DD/MM/YYYY HH:mm') + " <br> <strong>Fin:</strong> " + moment(event.bloqueo.diahora_fin).format('DD/MM/YYYY HH:mm') + "  <br> <strong>Profesional:</strong> " + event.bloqueo.profesional.nombre + " " + event.bloqueo.profesional.apellido,
										title: 'Bloqueo',
										trigger: 'hover',
										placement: 'top',
										container: 'div.calendarios',
										html: true
									});
				} else {
					element.popover({
										content: "<strong>Tratamiento:</strong> " + event.turno.tratamiento.nombre + " <br> <strong>Cliente:</strong> " + (event.reserva.nombre ? event.reserva.nombre : event.reserva.usuario.nombre + ' ' + event.reserva.usuario.apellido) + "  <br> <strong>Profesional:</strong> " + event.turno.profesional.nombre + " " + event.turno.profesional.apellido + " <br> <strong>Observaciones:</strong> " + (event.reserva.observaciones || ""),
										title: event.reserva.nombre,
										trigger: 'hover',
										placement: 'top',
										container: 'div.calendarios',
										html: true
									});
				}
            },
            eventClick: function (event) {
				if (event.bloqueo) {
					$modal.open(
						{
							templateUrl: 'app/admin/calendario/modal-view-bloqueo-update.html',
							controller: 'ModalBloqueoUpdateCtrl',
							backdrop: 'static',
							windowClass: 'normal-modal',
							keyboard: true,
							scope: $scope,
							resolve: {
								bloqueo: function () {
									return event.bloqueo;
								}
							}
						}
					).result.then(
						function () {
							$scope.calendarRefresh();
						}
					);
				} else {
					$modal.open(
						{
							templateUrl: 'app/admin/calendario/modal-view-reserva-update.html',
							controller: 'ModalReservaUpdateCtrl',
							backdrop: 'static',
							windowClass: 'normal-modal',
							keyboard: true,
							scope: $scope,
							resolve: {
								reserva: function () {
									return event.reserva;
								},
								turno: function () {
									return event.turno;
								}
							}
						}
					).result.then(
						function () {
							$scope.calendarRefresh();
						}
					);
				}
            },
            dayClick: function (date, allDay, jsEvent, view) {
                var date = moment(date);
                var idProfesional = $scope.filters.id_profesional;
                // Oculto popover actuales
                angular.element('.popover').popover('hide');

                if ($scope.modoDia) {
                    // IMPORTANTE: A veces date viene con fecha incorrecta.
                    // Sobreescribo con fecha de filtro de datepicker
                    date = date.date($scope.datepicker.value.getDate());

                    idProfesional = angular.element(jsEvent.currentTarget).parents('div.agenda-profesional').data('id-profesional')
                }

                var tpl = '<button class="btn btn-success btn-block" data-ng-click="openReservaPresetModal(\'' + date.format('YYYY-MM-DD HH:mm:ss') + '\', ' + idProfesional + ')"><i class="fa fa-fw fa-plus-circle"></i> Reserva</button><button class="btn btn-danger btn-block" data-ng-click="openBloqueoModal(\'' + date.format('YYYY-MM-DD HH:mm:ss') + '\', ' + idProfesional + ')"><i class="fa fa-times-circle fa-fw"></i> Bloqueo</button>';
				angular.element(jsEvent.currentTarget).popover({
					content: tpl,
					title: 'Seleccionar acción',
					container: 'div.calendarios',
					placement: 'bottom',
					html: true,
					trigger: 'focus'
				}).popover('toggle');

				$timeout(function () {
					$compile(angular.element('.popover').contents())($scope);
                    if (!$scope.modoDia) {
                        angular.element('.popover').css('left', jsEvent.offsetX)
                    }
				});

                $timeout(function () {
                    angular.element(jsEvent.currentTarget).popover('hide');
                }, 4000);
            }
        });

        $scope.minWidthCalendario = 250;
        $scope.minWidthCalendarios = '100%';
        $scope.widthPorcentajeCalendario = '100%';

        $scope.calcularAnchoCalendarios = function () {


            var cantVisibles = 0;
            angular.forEach($scope.turnosDia, function (profesional) {
                cantVisibles += (profesional.visible ? 1 : 0);
            });
            $scope.cantVisibles=cantVisibles;
            $scope.minWidthCalendarios = (cantVisibles ? (cantVisibles * $scope.minWidthCalendario + 30) + 'px' : '100%');

            $scope.widthPorcentajeCalendario = (100 / (cantVisibles ? cantVisibles : 1)) + '%';
        };

        $scope.fullCalendarOptionsDia = angular.extend(angular.copy($scope.fullCalendarOptionsSemana), {
            defaultView: 'agendaDay'
        });

        $scope.openBloqueoModal = function (date, idProfesional) {
            UserService.requestCentroActivo().then(function (centroActivo) {
                if (centroActivo && centroActivo.id) {
                    $modal.open(
                        {
                            templateUrl: 'app/admin/calendario/modal-view-intervalo-bloqueo.html',
                            controller: 'ModalBloqueoCreateCtrl',
                            backdrop: 'static',
                            //windowClass: 'big-modal',
                            keyboard: true,
                            scope: $scope,
                            resolve: {
                                Bloqueo: function (Bloqueo) {
                                    var bloqueo = Bloqueo.one();

                                    bloqueo.diahora_inicio = bloqueo.diahora_fin = moment(date).format();
                                    bloqueo.id_profesional = idProfesional;
                                    bloqueo.id_centro = centroActivo.id;

                                    return bloqueo;
                                },
                                Profesionales: function (Centro) {
                                    Centro.id = centroActivo.id;
                                    return Centro.all('profesionales').getList();
                                },
                                Centro : function(Centro) {
                                    return Centro;
                                }
                            }
                        }
                    ).result.then(
                        function () {
                            $scope.calendarRefresh();
                        }
                    );
                }
            });
        };

        /** RESERVA DE TURNOS **/

        $scope.openReservaPresetModal = function (date, idProfesional) {
            UserService.requestCentroActivo().then(function (centroActivo) {
                if (centroActivo && centroActivo.id) {
                    $modal.open(
                        {
                            templateUrl: 'app/admin/calendario/modal-view-reserva-preset-create.html',
                            controller: 'ModalReservaPresetCreateCtrl',
                            backdrop: 'static',
                            windowClass: 'big-modal',
                            keyboard: true,
                            scope: $scope,
                            resolve: {
                                Reserva: function (Reserva) {
                                    var reserva = Reserva.one();

                                    reserva.turnos = [
                                        {
                                            id_profesional: idProfesional,
                                            diahora_inicio: moment(date).format('YYYY-MM-DD HH:mm:ss')
                                        }
                                    ];

                                    reserva.origen="Manual";
                                    return reserva;
                                },
                                Tratamientos: function (Profesional) {
                                    return Profesional.one(idProfesional).all('tratamientos').getList();
                                },
								Profesional: function (Profesional) {
									return Profesional.one(idProfesional).get();
								}
                            }
                        }
                    ).result.then(
                        function () {
                            $scope.calendarRefresh();
                        }
                    );
                }
            });
        };

        /** INICIO EL CALENDARIO **/

        $scope.openReservaModal = function () {
            UserService.requestCentroActivo().then(function (centroActivo) {
                if (centroActivo && centroActivo.id) {
                    $modal.open(
                        {
                            templateUrl: 'app/admin/calendario/modal-view-reserva-create.html',
                            controller: 'ModalReservaCreateCtrl',
                            backdrop: 'static',
                            windowClass: 'big-modal',
                            keyboard: true,
                            scope: $scope,
                            resolve: {
                                Centro: function (Centro) {
                                    return Centro.get(centroActivo.id);
                                },
                                TratamientoCentro: function (Centro) {
                                    Centro.id = centroActivo.id;
                                    return Centro.all('tratamientos').getList();
                                },
                                ProfesionalCentro: function (Centro) {
                                    Centro.id = centroActivo.id;
                                    return Centro.all('profesionales').getList();
                                }
                            }
                        }
                    ).result.then(
                        function () {
                            $scope.calendarRefresh();
                        }
                    );
                }
            });
        };


        /** PIDO TURNOS DEL SERVER SEGÚN MODO Y FILTROS **/

        $scope.armarWhereFechas = function () {
            return {
                desde: $scope.filters.desde,
                hasta: $scope.filters.hasta
            };
        };

        $scope.calendarRefresh = function () {
            if ($scope.Centro.id) {
                $scope.Centro.getList('reservas', $scope.armarWhereFechas()).then(function (reservas) {
                    $scope.turnosServer = reservas;
					$scope.Centro.getList('bloqueos', {desde: $scope.filters.desde, hasta: $scope.filters.hasta}).then(function(bloqueos) {
						$scope.bloqueosServer = bloqueos;
                        $scope.filtroClientSide();
					});
                });
            }
        };


        /** INICIO EL CALENDARIO **/
        UserService.requestCentroActivo().then(function (centroActivo) {
            if (centroActivo.id) {
                $scope.Centro = Centro.one(centroActivo.id);
                $scope.Centro.duracion_fraccion = centroActivo.duracion_fraccion;
                $scope.Centro.getList('profesionales').then(function (profesionales) {
                    $scope.profesionales = profesionales;
                    $scope.instanciarCalendarios($scope.profesionales);
                    $scope.moverCalendario('today');

                    jQuery('.agenda-profesional>.fc>.fc-content>div>div>div').css('overflow-y','hidden');
                });
            }

        });



    }
}])
    .directive('resizeWindow',function(window){
        return{
            restrict:'A',
            link: function(scope) {
                angular.element(window).bind('resizear', function(e) {
                    // Namespacing events with name of directive + event to avoid collisions
                });
            }
        }
    });
