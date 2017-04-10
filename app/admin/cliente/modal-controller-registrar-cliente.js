angularApp.controller('ModalClientRegisterCtrl',['$scope','Restangular','$modalInstance','DetallesCentro','growl',function($scope,Restangular,$modalInstance,DetallesCentro,growl){
    $scope.modalInstance=$modalInstance;

    $scope.object={};
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
            $scope.object.fecha_cumple=new Date('2015/'+$scope.fecha_cumple.mes+'/'+$scope.fecha_cumple.dia);
            $scope.fecha_cumple.mes--;

            if(typeof $scope.object.observacion=='undefined')
                $scope.object.observacion='';

            var baseClient=Restangular.all('centro/'+DetallesCentro.id_centro+'/registrarcliente/');
            baseClient.post($scope.object).then(function(data){
                if(data)
                {
                    growl.addSuccessMessage("El cliente se ha registrado satisfactoriamente.");
                    $scope.object={};
                    if(dismiss) $scope.modalInstance.dismiss();
                    angular.element('#register-modal input:eq(0)').focus();
                }
            });

        }


    };

}
]);
