angularApp.controller('MainController', ['Restangular', '$scope', '$http', '$location', '$modal', '$routeParams', 'security', 'TipoDeTratamiento', 'Tratamiento', 'Centro', 'UserService', 'DropdownService', function(Restangular, $scope, $http, $location, $modal, $routeParams, security, TipoDeTratamiento, Tratamiento, Centro, UserService, DropdownService) {
    $scope.security = security;

    $scope.dropdownHeader = DropdownService;

    UserService.data.selectedTratamiento = null;
    UserService.data.selectedProfesional = null;
    //ProductTypeCat.one('list')

    //if (!UserService.centrosMainPage) {
    //    Centro.search({fields:'localidad,configuracion',remember: '10'/*, limit: '8'*/}).then(function (centros) {
    //        $scope.centros = UserService.centrosMainPage = centros.data;
    //    });
    //} else {
    //    $scope.centros = UserService.centrosMainPage;
    //}

    /*
    TipoDeTratamiento.search({"skip":0,"order":[{"field":"nombre","direction":"asc"}],"fields":"id,nombre"}).then(function (tipodetratamientos) {
        $scope.tratamientos = tipodetratamientos.data;
    });

    $scope.update = function(centro){
        if(centro != undefined){
        Restangular.one('centro/'+$scope.centros[centro].id+'/tratamientos').get().then(function(tratamientos){
            $scope.tratamientos = tratamientos;
        });
        }else{
            TipoDeTratamiento.search({"skip":0,"order":[{"field":"nombre","direction":"asc"}],"fields":"id,nombre"}).then(function (tipodetratamientos) {
                $scope.tratamientos = tipodetratamientos.data;
            });
        }
    };
    */


    $scope.mostrarPerfil = function (centro) {
        return $location.path('/centro/' + centro.id);
    };


    // Register form dialog modal
    $scope.registerModal = null;

    $scope.openRegisterDialog = function () {
        this.registerModal = $modal.open({
            templateUrl: 'app/user/view-modal-register.html',
            controller: 'UsuarioCreateCtrl',
            windowClass: 'small-dialog small-modal',
            keyboard: true
        });

        this.registerModal.result.then(this.onRegisterDialogClose);
    };

    $scope.onRegisterDialogClose = function (success) {
        this.registerModal = null;
    };
}]);