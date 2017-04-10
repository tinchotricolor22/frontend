angularApp.config([
    '$httpProvider', 'growlProvider', 'RestangularProvider', 'FacebookProvider', 'datepickerConfig', 'datepickerPopupConfig', 'localStorageServiceProvider',
    function($httpProvider, growlProvider, RestangularProvider, FacebookProvider, datepickerConfig, datepickerPopupConfig, localStorageServiceProvider) {
    growlProvider.globalTimeToLive(8000);
    growlProvider.globalEnableHtml(true);

    RestangularProvider.setBaseUrl('/api');
    RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});

    FacebookProvider.init('396637723838320');


    datepickerConfig.formatDay = 'dd';
    datepickerConfig.formatMonth = 'MM';
    datepickerConfig.formatYear = 'yy';
    datepickerConfig.showWeeks = false;
    datepickerConfig.startingDay = 1;
    datepickerPopupConfig.datepickerPopup = 'dd/MM/yyyy';
    datepickerPopupConfig.showButtonBar = false;
    datepickerPopupConfig.showButtonPanel = false;

    localStorageServiceProvider.setPrefix('wonoma');

    }]);