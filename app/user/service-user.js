angular.module('services').factory('UserService', ['$rootScope', 'security', '$modal', '$q', 'Centro', '_', function ($rootScope, security, $modal, $q, Centro, _) {

    var service = {
        data: {},
		requestCentros: function() {
			var deferred = $q.defer();
			security.requestCurrentUser().then(function(currentUser) {
				if (currentUser) {
					if (currentUser.permissions && currentUser.permissions.superuser == '1') {
						Centro.list().then(function(centros) {
							deferred.resolve(_.pluck(centros.data, 'id'));
						});
					} else {
						Centro.list().then(function(centros) {
							this.data.centros = centros;
							deferred.resolve(currentUser.metadata.centros);
						});
					}
				}
			});
			return deferred.promise;
		},
		requestCentroActivo: function() {
			if (this.data.centroActivo && this.data.centroActivo.id) {
				return $q.when(this.data.centroActivo);
			} else {
				this.data.centroActivo = this.requestCentros().then(function(centrosUsuario) {
					if (!centrosUsuario) {
						service.data.centroActivo = {};
						return service.data.centroActivo;
					} else if (centrosUsuario.length == 0) {
						service.data.centroActivo = {};
						return service.data.centroActivo;
					} else if (centrosUsuario.length == 1) {
						var elegido = null,
                            centro = null;
						angular.forEach(this.data.centros.data, function(centro) {
							if (centro.id == centrosUsuario[0]) {
								elegido = centro;
							}
						});
						return service.setCentroActivo(elegido);
					} else {
						return $modal.open(
							{
								templateUrl: 'app/admin/centro/modal-view-seleccionar-centro.html',
								controller: 'ModalSeleccionarCentroCtrl',
								backdrop: 'static',
								windowClass: 'normal-modal',
								keyboard: true,
								resolve: {
									CentrosUsuario: function() {return centrosUsuario;},
									Centro: function(Centro) {return Centro.list();},
									title: function() {return 'Seleccionar centro para operar';}
								}
							}
						).result.then(
							function(result) {
								return service.setCentroActivo(result);
							},
							function() {
								service.data.centroActivo = {};
								return service.data.centroActivo;
							}
						);
					}
				});

				return this.data.centroActivo;
			}
		},
		setCentroActivo: function(centro) {
			$rootScope.$emit((service.data.cambioCentro ? 'cambioCentro' : 'seleccionCentro'), centro);
			this.data.centroActivo = centro;
			this.data.cambioCentro = true;
			return service.data.centroActivo;
		}
    };

	return service;
}]);