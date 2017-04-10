angularApp.controller('ModificarDatosUsuarioCtrl', [
    '$scope', '$modal', '$modalInstance', 'security', 'growl', 'Auth',
    function($scope, $modal, $modalInstance, security, growl, Auth) {

		$scope.modal = {};

        security.requestCurrentUser().then(function (user){
            $scope.modal.user = user.plain();
            $scope.datepicker.init();
			if ($scope.modal.user.sexo == null) {
				$scope.modal.user.sexo = '';
			}
        });
        $scope.modalInstance = $modalInstance;

        $scope.update = function () {
            return Auth.update($scope.modal.user).then(function(response){
                growl.addSuccessMessage("Datos correctamente modificados.");
                $modalInstance.close();
            });
        };

        $scope.datepicker = {
            init: function () {
                $scope.modal.user.fecha_cumple = $scope.modal.user.fecha_cumple? $scope.modal.user.fecha_cumple: new Date('01/01/00');
            },

            open: function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.datepicker.opened = true;
            },

            dateOptions: {
                startingDay: 1,
                showWeeks:'false',
                showButtonBar: 'false',
                showButtonPanel: 'false',
                'format-day-title': 'MMMM'
            },

            initDate: new Date('2016-15-20'),
            format: 'dd/MM'
        };
}]);