var angularApp = angular.module('wonoma-admin', [
	'ngRoute',
    'ngImgCrop',
	'ngSanitize',
	'httpInterceptor',
	'resources',
	'services',
	'security',
	'ui',
	'ui.bootstrap',
	'ui.calendar',
	'ngAnimate',
	'ngTable',
	'chieffancypants.loadingBar',
	'angular-growl',
	'underscore',
	'restangular',
	'momentjs',
    'google-maps',
    'facebook',
    'LocalStorageModule'
]);

angularApp.run(['security', '$templateCache', '_', 'ui.config', 'datepickerConfig', 'datepickerPopupConfig', function(security, $templateCache, _, uiConfig, datepickerConfig, datepickerPopupConfig) {
	security.requestCurrentUser();

	$templateCache.put('ng-table/headers/checkbox.html', '<input type="checkbox" ng-model="checkboxes.checked" id="select_all" name="filter-checkbox" value="" class="ng-scope ng-pristine ng-valid" onclick="$(\'td>input[type=checkbox]\').trigger(\'click\');">');

	$templateCache.put('ng-table/pager.html', '\
        <div class="row ng-cloak"> \
           <div class="col-md-6" style="padding-top: 8px;"> \
               <small>Ver </small>\
               <div ng-if="params.settings().counts.length" class="btn-group btn-group-sm"> \
                   <button ng-repeat="count in params.settings().counts" type="button" ng-class="{\'active\':params.count()==count}" ng-click="params.count(count)" class="btn btn-default btn-sm"> <span ng-bind="count"></span> </button> \
               </div> \
               <small> filas por página</small>\
           </div> \
           <div class="col-md-6 text-right"> \
               <ul class="pagination" style="margin: 0;"> \
                   <li data-ng-disabled="!page.active && !$middle" ng-class="{\'active\': !page.active && $middle}" ng-repeat="page in pages" ng-switch="page.type"> <a ng-switch-when="prev" ng-click="params.page(page.number)" href="">&laquo;</a> <a ng-switch-when="first" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="page" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="more" ng-click="params.page(page.number)" href="">&#8230;</a> <a ng-switch-when="last" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="next" ng-click="params.page(page.number)" href="">&raquo;</a> \
                   </li> \
               </ul> \
           </div> \
       </div>');

	uiConfig.select2 = {
		allowClear: true
	};

	datepickerConfig.formatDay = 'dd';
	datepickerConfig.formatMonth = 'MM';
	datepickerConfig.formatYear = 'yy';
	datepickerConfig.showWeeks = false;
	datepickerConfig.startingDay = 1;
	datepickerPopupConfig.datepickerPopup = 'dd/MM/yyyy';
	datepickerPopupConfig.showButtonBar = false;
	datepickerPopupConfig.showButtonPanel = false;

	uiConfig.fullCalendar = {
		eventRender: function (event, element) {
			element.find('.fc-event-title').html(event.title);
		},
		firstHour: 9,
		minTime: 9,
		maxTime: 23,
		height: 450,
		editable: false,
		disableResizing: true,
		defaultView: 'basicWeek',
		defaultEventMinutes: 15,
		header: {
			left:   'prev,next today',
			center: 'title',
			right:  'basicDay,basicWeek'
		},
		titleFormat: {
			month: 'MMMM yyyy',
			week: 'd MMM [, yyyy]{ - d MMM, yyyy}',
			day: 'dddd, d MMM, yyyy'
		},
		timeFormat: {
			agenda: 'H:mm{ - H:mm}',
			'': 'H:mm{ - H:mm}'
		},
		columnFormat: {
			month: 'ddd',
			week: 'ddd d/M',
			day: 'dddd'
		},
		allDaySlot: false,
		allDayDefault: false,
		allDayText: 'Día entero',
		buttonText: {today: 'Hoy', month: 'Mes', week: 'Semana', day: 'Día'},
		monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
		monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
		dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
		dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
	};
}]);