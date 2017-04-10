angularApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider){
    $routeProvider
        .when('/', {
            templateUrl : 'app/home/view-home.html',
            controller  : 'HomeCtrl'
        })
        .when('/login', {
            templateUrl : 'app/home/view-home.html',
            controller  : 'LoginCtrl',
			resolve: {
				forceLogin : function() {return true;}
			}
        })
        .when('/sobre-nosotros', {
            templateUrl : 'app/sobre-nosotros/view-sobre-nosotros.html',
            controller  : 'SobreNosotrosCtrl'
        })
        .when('/sobre-nosotros/profesional', {
            templateUrl : 'app/sobre-nosotros/profesional/view-profesional.html',
            controller  : 'SobreNosotrosProfesionalCtrl'
        })
        .when('/sobre-nosotros/contactanos/:tipoUsuario?', {
            templateUrl : 'app/sobre-nosotros/contactanos/view-contactanos.html',
            controller  : 'ContactanosCtrl'
        })
        .when('/centro/:idCentro', {
            templateUrl : 'app/perfil-centro/view-perfil-centro.html',
            controller  : 'CentroCtrl',
            resolve: {
                Centro: function(Centro, $route) {return Centro.one($route.current.params.idCentro).get({fields:'localidad'});},
                showProfesionales: function () {return false;}
            }
        })
        .when('/centro/:idCentro/tratamiento/:idTratamiento/reserva/:fecha?', {
            templateUrl : 'app/perfil-centro/view-perfil-centro.html',
            controller  : 'CentroCtrl',
            resolve: {
                Centro: function(Centro, $route) {return Centro.one($route.current.params.idCentro).get({fields:'localidad'});},
                Tratamiento: function(Tratamiento, $route) {return Tratamiento.one($route.current.params.idTratamiento).get({fields: 'tipo_de_tratamiento'});},
                showProfesionales: function () {return true;}
            },
            reloadOnSearch: false
        })
        .when('/mis-reservas', {
            templateUrl : 'app/reserva/view-mis-reservas.html',
            controller  : 'MisReservasCtrl'
        })
        .when('/mi-cuenta', {
            templateUrl : 'app/user/mi-cuenta/view-mi-cuenta.html',
            controller  : 'MiCuentaCtrl'
        })
        .when('/reset-password/:token', {
            templateUrl : 'app/user/mi-cuenta/view-reset-password.html',
            controller  : 'CambiarPasswordLandingCtrl'
        })
        .otherwise({redirectTo: '/'});

    $httpProvider.interceptors.push('httpInterceptor');
}]);