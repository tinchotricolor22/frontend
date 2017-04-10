/*angularApp.filter('firstLetter', function () {
        return function (input, letter) {
            if(letter!='all')
            {
                input = input || [];
                var out = [];
                input.forEach(function (item) {
                    if (item.nombre_apellido.charAt(0).toLowerCase() == letter) {
                        out.push(item);
                    }
                });
                return out;
            }
            return input;

        }
    });*/
angularApp.controller('ClienteReadCtrl', ['$rootScope', 'Restangular', '$scope', 'BaseReadCtrl', '$modal', '$location', '$timeout', '$route', 'ngTableParams', '$filter', 'security', 'Centro', 'UserService', function($rootScope, Restangular, $scope, BaseReadCtrl, $modal, $location, $timeout, $route, ngTableParams, $filter, security, Centro, UserService) {

    $scope.letter='all';
    $scope.alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

    UserService.requestCentroActivo().then(function(centroActivo) {

        $scope.centroid = centroActivo.id;

        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 10,
            filter: $scope.filters,
            sorting:
            {
                nombre:'asc'

            }
            },
            {
                total: 0,           // length of data
                getData: function($defer, params) {
                    // ajax request to api

                    Restangular.one('centro/'+$scope.centroid+'/clientes').get().then(function (data){

                        $timeout(function() {

                            //FILTER
                            var filteredData = params.filter() ?
                                $filter('filter')(data, params.filter()) :
                                data;

                            if($scope.letter!='all')
                            {
                                var out = [];
                                data.forEach(function (item) {
                                    if (item.nombre_apellido.charAt(0).toLowerCase() == $scope.letter) {
                                        out.push(item);
                                    }
                                });
                                filteredData=out;
                            }


                            //SORTING
                            var orderedData = params.sorting() ?
                                $filter('orderBy')(filteredData, params.orderBy()) :
                                data;


                            if($scope.tableParams.$params.sorting.cant_reservas=='asc')
                                orderedData.reverse();

                            if($scope.tableParams.$params.sorting.fecha_cumple=='asc')
                            {


                                for(var i=0,end=orderedData.length-1;i<=end;i++)
                                {
                                    if(orderedData[end].fecha_cumple!=null)
                                    {
                                        var obj=orderedData[end];
                                        orderedData.splice(end,1);
                                        orderedData.unshift(obj);
                                    }
                                    else {break;}
                                }
                                var length=i;
                                for(var i=0;i<length;i++)
                                {
                                    if(orderedData[i].fecha_cumple!=null)
                                    {
                                        var Cumple=new Date(orderedData[i].fecha_cumple);
                                        var Actual=new Date();

                                        if( Cumple.getMonth()-Actual.getMonth()==0 && Cumple.getDate()>Actual.getDate())
                                        {
                                            var obj=orderedData[i];
                                            orderedData.splice(i,1);
                                            orderedData.unshift(obj);
                                        }




                                    }
                                    else break;


                                }
                                console.log(orderedData);
                            }
                            $scope.paramsUpdate = params.count();

                            params.total(orderedData.length);

                            $defer.resolve($defer.resolve($scope.data = orderedData.slice((params.page() -1) * params.count(), params.page() * params.count())));

                        }, 200);

                    });
                }
            });

    });


    var cleanUpFunc = $rootScope.$on('cambioCentro', function(){
        return UserService.requestCentroActivo().then(function(centroActivo) {
            $scope.centroid = centroActivo.id;
            $scope.tableParams.reload();
        });
    });


    $scope.$on('$destroy', function() {
        cleanUpFunc();
    });

    $scope.cantReservasFilter=false;
    $scope.cantReservas=function(){
        if($scope.tableParams.$params.sorting.cant_reservas!='asc')
        {
            $scope.nextBirthdayFilter=false;
            $scope.cantReservasFilter=true;
            $scope.tableParams.$params.sorting={cant_reservas:'asc'};
        }
        else
            $scope.cantReservasFilter=false;
    };
    $scope.nextBirthdayFilter=false;
    $scope.nextBirthday=function(){
        if($scope.tableParams.$params.sorting.fecha_cumple!='asc')
        {
            $scope.cantReservasFilter=false;
            $scope.nextBirthdayFilter=true;
            $scope.tableParams.$params.sorting={ fecha_cumple:'asc'};
        }
        else
            $scope.nextBirthdayFilter=false;
    };
    $scope.changeLetter= function(letter){
        $scope.letter=letter;
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
        angular.element('#filters .active').removeClass('active');
        angular.element('#'+letter).addClass('active');
    };

    $scope.openDetallesModal = function (idCliente) {
        /*UserService.requestCentroActivo().then(function (centroActivo) {
         if (centroActivo && centroActivo.id) { */
        var modalInstance = $modal.open({

                templateUrl: 'app/admin/cliente/modal-view-detalles-cliente.html',
                controller: 'ModalClienteViewCtrl',
                backdrop: 'static',
                windowClass: 'big-modal',
                keyboard: true,
                scope: $scope,
                resolve: {
                    DetallesCliente: function () {
                        var content = {
                            id_cliente: idCliente,
                            id_centro: $scope.centroid
                        };
                        return content;
                    }
                }
            });

        modalInstance.result.then(function(){

        },function(){
            $scope.tableParams.reload();

        });
        //}
        //});
    };

    $scope.openEditModal = function (idCliente) {
        var modalInstance = $modal.open(
            {
                templateUrl: 'app/admin/cliente/modal-view-editar-cliente.html',
                controller: 'ModalClienteEditCtrl',
                backdrop: 'static',
                //windowClass: 'big-modal',
                keyboard: true,
                scope: $scope,
                resolve: {
                    DetallesCliente: function () {
                        return{
                            id_cliente: idCliente
                        };
                    }
                }

            });

        modalInstance.result.then(function(){

        },function(){
            $scope.tableParams.reload();

        });
        //}
        //});
    };

    $scope.openRegisterClient = function () {
        var modalInstance = $modal.open(
            {
                templateUrl: 'app/admin/cliente/modal-view-registrar-cliente.html',
                controller: 'ModalClientRegisterCtrl',
                backdrop: 'static',
                windowClass: 'medium-modal',
                keyboard: true,
                scope: $scope,
                resolve: {
                    DetallesCentro: function () {
                        var content = {
                            id_centro: $scope.centroid
                        };
                        return content;
                    }
                }
            });


        modalInstance.result.then(function(){

        },function(){
            $scope.tableParams.reload();
        });
        //}
        //});
    };




}]);