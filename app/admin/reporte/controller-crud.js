angularApp.controller('ReporteReadCtrl', ['$rootScope', '$scope', 'Restangular', '$modal', '$compile', '$timeout', '$location', 'ui.config', 'BaseReadCtrl', 'security', 'Centro', 'UserService', function($rootScope, $scope, Restangular, $modal, $compile, $timeout, $location, uiConfig, BaseReadCtrl, security, Centro, UserService) {

    var cleanUpFunc = $rootScope.$on('cambioCentro', function () {
        $scope.requestCentro();
    });
    $scope.$on('$destroy', function () {
        cleanUpFunc();
    });

    $scope.datepickerStart = {
        init: function () {
            //$scope.datepickerStart.value = new Date();
            $scope.datepickerStart.value = moment().startOf('day').toDate();
        },
        open: function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datepickerStart.opened = true;
        }
    };
    $scope.datepickerStart.init();

    $scope.$watch('datepickerStart.value',function(val,oldVal){
        if (val != oldVal) {
            refreshData();
        }
    });

    $scope.datepickerEnd = {
        init: function () {
            //$scope.datepickerEnd.value = new Date();
            $scope.datepickerEnd.value = moment().startOf('day').toDate();
        },
        open: function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datepickerEnd.opened = true;
        }
    };
    $scope.datepickerEnd.init();

    $scope.$watch('datepickerEnd.value',function(val,oldVal){
        if (val != oldVal) {
            refreshData();
        }
    });

    var refreshData = function(){
        if ($scope.centroActivo.id) {
            Restangular.one('centro',$scope.centroActivo.id).post('reporte',{
                fechaInicio: moment($scope.datepickerStart.value).format('YYYY-MM-DD 00:00:00'),
                fechaFin: moment($scope.datepickerEnd.value).format('YYYY-MM-DD 23:59:59')
            }).then(function(data){
                    $scope.reporte = data;
                });
        }
    };
    $scope.requestCentro = function() {
        UserService.requestCentroActivo().then(function (centroActivo) {
            $scope.centroActivo = centroActivo;
            refreshData();
        });
    };
    $scope.requestCentro();

}]);