angularApp.controller('UsuarioReadCtrl', ['$scope', 'BaseReadCtrl', 'Usuario', function($scope, BaseReadCtrl, Usuario) {
	angular.extend($scope, BaseReadCtrl(
		{
			modelFactory: Usuario,
			modelName: 'usuario',
			tableFields: ['id', 'name', 'surname', 'email'],
			tableFilters: [
				{field: 'name', operator: 'LIKE'},
				{field: 'surname', operator: 'LIKE'}
			]
		}
	));
}]);
angularApp.controller('UsuarioCreateCtrl', ['$scope', '$modalInstance', 'BaseCreateCtrl', 'Usuario', 'growl', function($scope, $modalInstance, BaseCreateCtrl, Usuario, growl) {
    angular.extend($scope, BaseCreateCtrl(
        {
            modelFactory: Usuario,
            modelName: 'usuario',
            successMessage: function () {
                return 'Te has registrado correctamente, en breve recibirás un correo para confirmar tu email.';
            }
        }
    ));

	$scope.register = function () {
        this.create();
	};

    $scope.afterCreate = function () {
        $modalInstance.dismiss();
    };

}]);
angularApp.controller('UsuarioActivadoCreateCtrl', ['$scope', 'BaseCreateCtrl', 'Usuario', 'growl', function($scope, BaseCreateCtrl, Usuario, growl) {
	angular.extend($scope, BaseCreateCtrl(
		{
			modelFactory: Usuario,
			modelName: 'usuario'
		}
	));

	$scope.ctrlConfig.modelFactory = $scope.ctrlConfig.modelFactory.one('registrar-activado');
}]);
angularApp.controller('UsuarioUpdateCtrl', ['$scope', 'BaseUpdateCtrl', 'Usuario', '$modal', 'growl', 'Centro', 'UserService', function($scope, BaseUpdateCtrl, Usuario, $modal, growl, Centro, UserService) {
    angular.extend($scope, BaseUpdateCtrl(
        {
            modelFactory: Usuario,
            modelName: 'usuario'
        }
    ));

	$scope.asociarGrupoOpen = function() {
		$modal.open(
			{
				templateUrl: 'app/admin/usuario/modal-view-grupo.html',
				controller: 'ModalGrupoReadCtrl',
				backdrop: 'static',
				windowClass: 'normal-modal',
				keyboard: true,
				scope: $scope,
				resolve: {
					Grupo: function(Grupo) {return Grupo.list({fields: 'id,name'});}
				}
			}
		).result.then(
			function(result){
				var alreadyExists = false;
				angular.forEach($scope.object.groups, function(object) {
					if (object.id == result.id) {
						alreadyExists = true;
					}
				});
				if (alreadyExists) {
					growl.addErrorMessage('El usuario ya tiene el grupo seleccionado');
				} else {
					Usuario.customPOST({group_id: result.id}, 'group').then(function() {
						$scope.object.groups.push(result);
					});
				}
			}
		);
	};

	$scope.desasociarGrupo = function(grupo) {
		Usuario.customDELETE('group', {group_id: grupo.id}).then(function() {
			var index = $scope.object.groups.indexOf(grupo);
			if (index > -1) {
				$scope.object.groups.splice(index, 1);
			}
		});
	};

	if (!angular.isObject($scope.object.metadata) || angular.isArray($scope.object.metadata)) {
		$scope.object.metadata = {centros: []};
	} else if (!$scope.object.metadata['centros']) {
		$scope.object.metadata['centros'] = [];
	}

	$scope.centros = {};
	angular.forEach(Centro.data, function(centro) {
		$scope.centros[centro.id] = centro.nombre;
	});

	$scope.asociarCentroOpen = function() {
		UserService.requestCentros().then(function(centrosUsuario) {
			$modal.open(
				{
					templateUrl: 'app/admin/centro/modal-view-seleccionar-centro.html',
					controller: 'ModalSeleccionarCentroCtrl',
					backdrop: 'static',
					windowClass: 'normal-modal',
					keyboard: true,
					resolve: {
						CentrosUsuario: function() {return centrosUsuario;},
						Centro: function(Centro) {return Centro.list();},
						title: function() {return 'Seleccionar centro';}
					}
				}
			).result.then(
				function(result){
					if ($scope.object.metadata['centros'].indexOf(result.id) > -1) {
						growl.addErrorMessage('El usuario ya tiene el centro seleccionado');
					} else {
						var metadataAux = angular.copy($scope.object.metadata);
						metadataAux['centros'].push(result.id);
						$scope.guardarMetadata(metadataAux);
					}
				}
			);
		});
	};

	$scope.desasociarCentro = function(centro) {
		var metadataAux = angular.copy($scope.object.metadata);
		var index = metadataAux['centros'].indexOf(centro);
		if (index > -1) {
			metadataAux['centros'].splice(index, 1);
		}
		$scope.guardarMetadata(metadataAux);
	};

	$scope.guardarMetadata = function(metadata) {
		//Vuelvo a pedir el usuario porque si guardo el de $scope.object lo voy a estar guardando con posibles cambios en la sección "Detalles del usuario", y tal vez no es lo que se pretende
		Usuario.get($scope.object.id).then(function(usuario) {
			usuario.metadata = metadata;
			Usuario.customPUT(usuario).then(function() {
				$scope.object.metadata = metadata;
			});
		});
	};
}]);