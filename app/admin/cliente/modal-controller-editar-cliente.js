angularApp.controller('ModalClienteEditCtrl', ['$rootScope', '$scope', 'Restangular', '$modalInstance', 'DetallesCliente', '$filter', 'growl','$timeout', function($rootScope, $scope, Restangular, $modalInstance, DetallesCliente, $filter, growl,$timeout) {

    $scope.modalInstance = $modalInstance;

    Restangular.one('clientes/'+DetallesCliente.id_cliente).get().then(function (data){
        $scope.cliente=data.cliente;
        var clienteFecha_Cumple=new Date($scope.cliente.fecha_cumple);
        $scope.fecha_cumple.mes=clienteFecha_Cumple.getMonth();
        $timeout(function(){
            $scope.fecha_cumple.dia=clienteFecha_Cumple.getDate()+1;
        },200);
    });
    $scope.fecha_cumple={};

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

    $scope.register=function(dismiss){


        if(!$scope.form.$invalid && !$scope.form.$pristine)
        {
            $scope.fecha_cumple.mes++;
            $scope.cliente.fecha_cumple=new Date('2015/'+$scope.fecha_cumple.mes+'/'+$scope.fecha_cumple.dia);
            $scope.fecha_cumple.mes--;

            if(typeof $scope.cliente.observacion=='undefined')
                $scope.cliente.observacion='';

            var baseClient=Restangular.all('updateCliente/'+DetallesCliente.id_cliente);
            baseClient.post($scope.cliente).then(function(data){
                if(data)
                {
                    growl.addSuccessMessage("El cliente se ha editado.");

                    if(dismiss) $scope.modalInstance.dismiss();
                    angular.element('#register-modal input:eq(0)').focus();
                }
            });

        }


    };
}]);
