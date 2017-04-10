angularApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider){
    $routeProvider
		// Home
		.when('/', {
			templateUrl: 'app/admin/home/view-home.html',
			controller: 'HomeCtrl',
			reloadOnSearch: false
		})
        // Calendario
        .when('/calendario', {
            templateUrl: 'app/admin/calendario/view-calendario.html',
            controller: 'CalendarioReadCtrl',
            reloadOnSearch: false
        })
		.when('/login', {
			templateUrl : 'app/admin/calendario/view-calendario.html',
			controller  : 'LoginCtrl',
			resolve: {
				forceLogin : function() {return true;}
			}
		})
		// Dashboard
		.when('/dashboard', {
			templateUrl : 'app/admin/dashboard/view-dashboard.html',
			controller  : 'AdminDashboardCtrl'
		})
		// Bloqueos
		.when('/admin/bloqueo/', {
			templateUrl: 'app/admin/bloqueo/view-crud-read.html',
			controller: 'BloqueoReadCtrl',
			reloadOnSearch: false
		})
		// Tipo de tratamiento
		.when('/admin/tipo_de_tratamiento/', {
			templateUrl: 'app/admin/tipo_de_tratamiento/view-crud-read.html',
			controller: 'TipoDeTratamientoReadCtrl',
			reloadOnSearch: false
		})
		.when('/admin/tipo_de_tratamiento/create', {
			templateUrl: 'app/admin/tipo_de_tratamiento/view-crud-create.html',
			controller: 'TipoDeTratamientoCreateCtrl'
		})
		.when('/admin/tipo_de_tratamiento/:id', {
			templateUrl: 'app/admin/tipo_de_tratamiento/view-crud-update.html',
			controller: 'TipoDeTratamientoUpdateCtrl',
			resolve : {
				TipoDeTratamiento: function(TipoDeTratamiento, $route) {return TipoDeTratamiento.get($route.current.params.id);}
			}
		})
		// Localidad
		.when('/admin/localidad/', {
			templateUrl: 'app/admin/localidad/view-crud-read.html',
			controller: 'LocalidadReadCtrl',
			reloadOnSearch: false
		})
		.when('/admin/localidad/create', {
			templateUrl: 'app/admin/localidad/view-crud-create.html',
			controller: 'LocalidadCreateCtrl'
		})
		.when('/admin/localidad/:id', {
			templateUrl: 'app/admin/localidad/view-crud-update.html',
			controller: 'LocalidadUpdateCtrl',
			resolve : {
				Localidad: function(Localidad, $route) {return Localidad.get($route.current.params.id);}
			}
		})
		// Centro
		.when('/admin/centro/', {
			templateUrl: 'app/admin/centro/view-crud-read.html',
			controller: 'CentroReadCtrl',
			reloadOnSearch: false,
			resolve : {
				Localidad: function(Localidad) {return Localidad.list();}
			}
		})
		.when('/admin/centro/create', {
			templateUrl: 'app/admin/centro/view-crud-create.html',
			controller: 'CentroCreateCtrl',
			resolve : {
				Localidad: function(Localidad) {return Localidad.list();}
			}
		})
		.when('/admin/centro/:id', {
			templateUrl: 'app/admin/centro/view-crud-update.html',
			controller: 'CentroUpdateCtrl',
			resolve : {
				Centro: function(Centro, $route) {return Centro.get($route.current.params.id);},
				Localidad: function(Localidad) {return Localidad.list();}
			}
		})
		// Tratamientos por centro
		.when('/admin/tratamiento/', {
			templateUrl: 'app/admin/tratamiento/view-crud-read.html',
			controller: 'TratamientoReadCtrl',
			reloadOnSearch: false,
			resolve : {
				TipoDeTratamiento: function(TipoDeTratamiento) {return TipoDeTratamiento.list();}
			}
		})
		.when('/admin/tratamiento/create', {
			templateUrl: 'app/admin/tratamiento/view-crud-create.html',
			controller: 'TratamientoCreateCtrl',
			resolve : {
				TipoDeTratamiento: function(TipoDeTratamiento) {return TipoDeTratamiento.list();}
			}
		})
		.when('/admin/centro/:id_centro/tratamiento/:id', {
			templateUrl: 'app/admin/tratamiento/view-crud-update.html',
			controller: 'TratamientoUpdateCtrl',
			resolve : {
				Tratamiento: function(Tratamiento, $route) {return Tratamiento.customGET($route.current.params.id, {fields: 'centro'});},
				TipoDeTratamiento: function(TipoDeTratamiento) {return TipoDeTratamiento.list();}
			}
		})
		// Profesional
		.when('/admin/profesional/', {
			templateUrl: 'app/admin/profesional/view-crud-read.html',
			controller: 'ProfesionalReadCtrl',
			reloadOnSearch: false
		})
		.when('/admin/profesional/create', {
			templateUrl: 'app/admin/profesional/view-crud-create.html',
			controller: 'ProfesionalCreateCtrl',
			resolve : {
				Centro: function(Centro) {return Centro.list();}
			}
		})
		.when('/admin/centro/:id_centro/profesional/:id', {
			templateUrl: 'app/admin/profesional/view-crud-update.html',
			controller: 'ProfesionalUpdateCtrl',
			resolve : {
				Profesional: function(Profesional, $route) {return Profesional.get($route.current.params.id);},
				ProfesionalCentro: function(Centro, $route) {return Centro.one($route.current.params.id_centro).one('profesionales', $route.current.params.id).get();}
			}
		})
        // Clientes
        .when('/admin/cliente/', {
            templateUrl: 'app/admin/cliente/view-crud-read.html',
            controller: 'ClienteReadCtrl',
            reloadOnSearch: false
        })


        // Reportes
        .when('/admin/reporte/', {
            templateUrl: 'app/admin/reporte/view-crud-read.html',
            controller: 'ReporteReadCtrl',
            reloadOnSearch: false
        })
        

        // Usuario
		.when('/admin/usuario/', {
			templateUrl: 'app/admin/usuario/view-crud-read.html',
			controller: 'UsuarioReadCtrl',
			reloadOnSearch: false
		})
		.when('/admin/usuario/create', {
			templateUrl: 'app/admin/usuario/view-crud-create.html',
			controller: 'UsuarioActivadoCreateCtrl'
		})
		.when('/admin/usuario/:id', {
			templateUrl: 'app/admin/usuario/view-crud-update.html',
			controller: 'UsuarioUpdateCtrl',
			resolve : {
				Usuario: function(Usuario, $route) {return Usuario.get($route.current.params.id + '?fields=groups');},
				Centro: function(Centro) {return Centro.list();}
			}
		})
        .otherwise({redirectTo: '/'});

    $httpProvider.interceptors.push('httpInterceptor');
}]);