var app = angular.module('agenda', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/agenda', {
			templateUrl: 'partials/agenda.html',
			controller: 'AgendaController'
		}).
		when('/error', {
			templateUrl: 'partials/error.html',
			controller: 'ErrorController'
		}).
		otherwise({
			redirectTo: '/error'
		});
}]);


/* Controllers */
app.controller('AgendaController', function($scope,$route,agendaService) {
    $scope.message = 'Agenda';
	$scope.nombre="";
	$scope.apellido="";
	$scope.telefono="";
	$scope.tipotelefono="Personal";
	agendaService.listado(function(res){
		$scope.listado = res;
	});
	
	$scope.recarga = function () {
		$route.reload ();
	};
	
	$scope.crear = function () {
		var persona={};
		
		persona.nombre=$scope.nombre;
		persona.apellido=$scope.apellido;
		persona.telefonos={};
		persona.telefonos[$scope.tipotelefono]= $scope.telefono;
		agendaService.crear(persona);
		$scope.recarga();

	};
	$scope.eliminar = function (id) {
		agendaService.eliminar(id);
		$scope.recarga();
	};
	$scope.modificar = function(reg){
		$scope.nombre=reg.nombre;
		$scope.apellido=reg.apellido;	
		for(var val in reg.telefonos) {
			$scope.telefono = reg.telefonos[val];
			$scope.tipotelefono = val;
		}
		agendaService.eliminar(reg.id);
	
	}
	
});

app.controller('ErrorController', function($scope) {
    $scope.message = 'Página inexistente';
});


/*Services*/
app.factory('agendaService', function($http, $location, $route){
	return {
		listado: function(callback){
			$http.get("http://brian.com.ar:8088/agenda/listado").success(callback);
		 
	  },
		crear:function(persona){
			$http.post("http://brian.com.ar:8088/agenda/crear",persona);
		},
		eliminar:function(id){
			$http.post("http://brian.com.ar:8088/agenda/eliminar/"+id);
		}
	};
});	