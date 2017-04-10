angular.module('resources').factory('BaseReadCtrl', ['$routeParams', '$location', '$window', 'growl', 'ngTableParams', '$timeout', function($routeParams, $location, $window, growl, ngTableParams, $timeout) {
	return function(ctrlConfig) {
		var mixin = {};

		mixin.ctrlConfig = {
			modelFactory: null,
			modelName: null,
			successMessage: function(response) {
				return ('El <b>' + this.modelName + '</b> ha sido borrado correctamente');
			},
			tableFields: ['id', 'nombre'],
			tableFilters: [{field: 'nombre', operator: 'LIKE', valueField: 'nombre'}], //valueField es opcional, si no lo ponés agarra por defecto el field
			tableOrder: [{field: 'id', direction: 'desc'}],
			initTable: true,
			beforeGetData: null
		};
		angular.extend(mixin.ctrlConfig, ctrlConfig);

		mixin.filters = {};

		mixin.constructWhere = function(filters) {
			var where = [];
			angular.forEach(mixin.ctrlConfig.tableFilters, function(filter) {
				var valueField = (filter['filtersFields'] ? filter.valueField : filter.field);
				if (typeof filters[valueField] !== 'undefined' && filters[valueField] != '') {
					where.push(
						{
							field: filter.field,
							operator: filter.operator,
							value: (filter.operator == 'LIKE' ? '%' : '') + filters[valueField] + (filter.operator == 'LIKE' ? '%' : '')
						}
					);
				}
			});
			return where.length ? {where: where} : {};
		};

		mixin.initTable = function() {
			var that = this;
			this.tableParams = new ngTableParams(
				angular.extend(
					{
						page: 1,
						count: 10
					},
					$location.search()
				),
				{
					total: 0,
					getData: function($defer, params) {
						var callback = function() {
							$location.search(angular.extend(params.url(), that.filters));
							that.ctrlConfig.modelFactory.search(
									angular.extend(
										{
											limit : params.count(),
											skip: params.count() * (params.page() - 1),
											'order' : that.ctrlConfig.tableOrder,
											'fields': that.ctrlConfig.tableFields.join()
										},
										that.constructWhere(that.filters)
									)
								).then(function(response) {
									$timeout(function() {
										params.total(response.total);
										$defer.resolve(response.data);
									}, 500);
								}
							);
						};
						if (angular.isFunction(that.ctrlConfig.beforeGetData)) {
							that.ctrlConfig.beforeGetData().then(function(shouldContinue) {
								if (shouldContinue !== false) {
									callback($defer, params);
								}
							});
						} else {
							callback($defer, params);
						}
					}
				}
			);
		};

		if (mixin.ctrlConfig.initTable) {
			mixin.initTable();
		}

		mixin.remove = function(id) {
			this.ctrlConfig.modelFactory.customDELETE(id).then($.proxy(function(response){
				growl.addSuccessMessage(this.ctrlConfig.successMessage(response));
				this.tableParams.reload();
			}, this));
		};

		return mixin;
	};
}]);
angular.module('resources').factory('BaseCreateCtrl', ['$window', 'growl', function($window, growl) {
	return function(ctrlConfig) {
		var mixin = {};

		mixin.ctrlConfig = {
			modelFactory: null,
			modelName: null,
			successMessage: function(response) {
				return ('El <b>' + this.modelName + '</b> ha sido creado correctamente');
			}
		};
		angular.extend(mixin.ctrlConfig, ctrlConfig);

		mixin.object = {};

		mixin.beforeCreate = function() {return true;};

		mixin.create = function() {
			//noinspection JSPotentiallyInvalidUsageOfThis
			if (this.beforeCreate()) {
				return this.ctrlConfig.modelFactory.customPOST(this.object).then($.proxy(function(response){
					growl.addSuccessMessage(this.ctrlConfig.successMessage(response));
					// Callback function if sent
					if (typeof this.afterCreate === 'function') {
						this.afterCreate(response);
					} else {
						$window.history.back();
					}
				}, this));
			}
			return false;
		};

		return mixin;
	};
}]);
angular.module('resources').factory('BaseUpdateCtrl', ['$window', 'growl', function($window, growl) {
	return function(ctrlConfig) {
		var mixin = {};

		mixin.ctrlConfig = {
			modelFactory: null,
			modelName: null,
			successMessage: function(response) {
				return ('El <b>' + this.modelName + '</b> ha sido modificado correctamente');
			}
		};
		angular.extend(mixin.ctrlConfig, ctrlConfig);

		mixin.object = mixin.ctrlConfig.modelFactory;

		mixin.beforeUpdate = function() {return true;};

		mixin.update = function() {
			//noinspection JSPotentiallyInvalidUsageOfThis
			if (this.beforeUpdate()) {
				return this.ctrlConfig.modelFactory.customPUT(this.object).then($.proxy(function(response){
					growl.addSuccessMessage(this.ctrlConfig.successMessage(response));
					// Callback function if sent
					if (typeof this.afterUpdate === 'function') {
						this.afterUpdate(response);
					} else {
						$window.history.back();
					}
				}, this));
			}
			return false;
		};

		return mixin;
	};
}]);