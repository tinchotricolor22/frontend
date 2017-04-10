angularApp.controller('ModalBloqueoCreateCtrl', ['$scope', '$modalInstance', '$filter', 'Bloqueo', 'Profesionales', 'growl', 'Centro', function($scope, $modalInstance, $filter, Bloqueo, Profesionales, growl, Centro) {

    $scope.modalInstance = $modalInstance;

    $scope.bloqueo = Bloqueo;
    $scope.profesionales =  $filter('orderBy')(Profesionales, 'nombre');

    $scope.hoy = moment();

    $scope.datepickerInicio = {
        open: function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            this.opened = true;
        }
    };

    $scope.datepickerFin = {
        open: function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            this.opened = true;
        }
    };
    $scope.$watchCollection('[bloqueo.diahora_fin,bloqueo.diahora_inicio]',function(newValue,oldValue){
        if(moment($scope.bloqueo.diahora_fin).zone('-0300').format('YYYY-MM-DD HH:mm:ss')<moment($scope.bloqueo.diahora_inicio).zone('-0300').format('YYYY-MM-DD HH:mm:ss'))
            $scope.bloqueo.diahora_fin=$scope.bloqueo.diahora_inicio;
    });

    $scope.save = function() {

        // Cambiamos las fechas a local
        $scope.bloqueo.diahora_inicio = moment($scope.bloqueo.diahora_inicio).zone('-0300').format('YYYY-MM-DD HH:mm:ss');
        $scope.bloqueo.diahora_fin = moment($scope.bloqueo.diahora_fin).zone('-0300').format('YYYY-MM-DD HH:mm:ss');

        if ($scope.bloqueo.id_profesional == 0) {
            return Centro.all('bloqueos').post($scope.bloqueo).then(function(response){
                growl.addSuccessMessage('El <b>bloqueo</b> ha sido creado correctamente');
                $scope.modalInstance.close(response);
            });
        } else {
            return $scope.bloqueo.save().then(function(response){
                growl.addSuccessMessage('El <b>bloqueo</b> ha sido creado correctamente');
                $scope.modalInstance.close(response);
            });
        }
    }
}]);
angularApp.controller('ModalBloqueoUpdateCtrl', ['$scope', '$modalInstance', 'moment', 'Bloqueo', 'bloqueo', 'growl', function ($scope, $modalInstance, moment, Bloqueo, bloqueo, growl) {
	$scope.modalInstance = $modalInstance;
	$scope.modal = {};

	$scope.modal.moment = moment;
	$scope.modal.bloqueo = bloqueo;

	$scope.modal.eliminar = function() {
		Bloqueo.customDELETE(bloqueo.id).then(function (result) {
			growl.addSuccessMessage('El <b>bloqueo</b> ha sido eliminado correctamente');
			return $scope.modalInstance.close(result);
		});
	};
}]);