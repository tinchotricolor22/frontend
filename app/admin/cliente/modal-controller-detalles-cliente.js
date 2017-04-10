angularApp.controller('ModalClienteViewCtrl', ['$rootScope', 'ngTableParams', 'Restangular', '$scope', '$filter', '$modalInstance', 'DetallesCliente' , 'Centro', 'growl','$timeout', function($rootScope, ngTableParams, Restangular, $scope, $filter, $modalInstance, DetallesCliente, Centro, growl,$timeout) {

    $scope.modalInstance = $modalInstance;
    $scope.cliente={};
    $scope.nuevocliente={};
    $scope.fecha_cumple={};
    Restangular.one('clientes/'+DetallesCliente.id_cliente).get().then(function (data){
        $scope.turnos = data.turnos;
        $scope.cliente = data['cliente'];
        if(data['profesional'] !=null)$scope.profesional=data['profesional'].nombre;
        if(data['tratamiento'] !=null)$scope.tratamiento=data['tratamiento'].nombre;

        $scope.CantReservas=data.turnos.length;

        $scope.tableParams2 = new ngTableParams({
            page: 1,
            count: 5,
            sorting:
            {
                nombre: 'asc'
            }
        }, {
            total: $scope.turnos.length, // length of data
            getData: function ($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ?
                    $filter('orderBy')($scope.turnos, params.orderBy()) :
                    $scope.turnos;

                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

            }



        }, function (error) {
            console.log('errror', error);
        });

        $scope.convertToDay = function (dateString){
            if(dateString!=null){
                var date = $filter('date')(new Date(dateString.replace(/-/g, "/")),'dd');
                var date2 = $filter('date')(new Date(dateString.replace(/-/g, "/")),'MMMM');
                return date+" de "+date2;
            }
            return null;

        };
        $scope.convertToDate = function (dateString){
            if(dateString!=null){
                var date = new Date(dateString.replace(/-/g, "/"));
                return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
            }
            return null;

        };

        $scope.convertToTime = function (dateString,dateString2){
            var date = $filter('date')(new Date(dateString.replace(/-/g, "/")),'HH:mm');
            var date2 = $filter('date')(new Date(dateString2.replace(/-/g, "/")),'HH:mm');
            return date+" - "+date2;
        };
        console.log($scope.tableParams2);
        var clienteFecha_Cumple=new Date($scope.cliente.fecha_cumple);
        $scope.fecha_cumple.mes=clienteFecha_Cumple.getMonth();
        $timeout(function(){
            $scope.fecha_cumple.dia=clienteFecha_Cumple.getDate()+1;
        },200);
    });


    $scope.editar=false;
    $scope.openForm=function(){
        $scope.editar=true;
        $scope.nuevocliente = jQuery.extend(true, {}, $scope.cliente);
    };
    $scope.cancelForm=function(){
        $scope.editar=false;
    };
    $scope.onSubmit=function(){
        if(!$scope.form.$invalid && !$scope.form.$pristine)
        {
            $scope.fecha_cumple.mes++;
            $scope.nuevocliente.fecha_cumple=new Date('2015/'+$scope.fecha_cumple.mes+'/'+$scope.fecha_cumple.dia);
            $scope.fecha_cumple.mes--;

            var baseClient=Restangular.all('updateCliente/'+DetallesCliente.id_cliente);
            baseClient.post($scope.nuevocliente).then(function(data){
                if(data)
                {
                    growl.addSuccessMessage("El cliente se ha modificado satisfactoriamente.");
                    $scope.editar=false;
                    Restangular.one('clientes/'+DetallesCliente.id_cliente).get().then(function (data){
                        $scope.cliente = data['cliente'];
                    });

                }
            });
        }
    };

    $scope.months=[
        {name:'Enero',days:new Array(31)},
        {name:'Febrero',days:new Array(28)},
        {name:'Marzo',days:new Array(31)},
        {name:'Abril',days:new Array(30)},
        {name:'Mayo',days:new Array(31)},
        {name:'Junio',days:new Array(30)},
        {name:'Julio',days:new Array(31)},
        {name:'Agosto',days:new Array(31)},
        {name:'Septiembre',days:new Array(30)},
        {name:'Octubre',days:new Array(31)},
        {name:'Noviembre',days:new Array(30)},
        {name:'Diciembre',days:new Array(31)},
    ];

    $scope.SelectOptions={
        minimumResultsForSearch:-1
    };
    $scope.changeMonth=function(){
        if($scope.fecha_cumple.dia>$scope.months[$scope.fecha_cumple.mes].days.length)
            $scope.fecha_cumple.dia=$scope.months[$scope.fecha_cumple.mes].days.length;
    };
}]);