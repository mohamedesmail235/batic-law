baticApp.doctypes['pos-devices-accessories'] = {
    is_loaded: false,
    init: function (form, $rootScope, $scope, $http, $timeout) {


    },
    load: function (form, $rootScope, $scope, $http, $timeout) {

    },
    data: function ($rootScope) {
        let data = {
            "naming_series": stringVal($rootScope.formView.form.data.naming_series),
            "device": stringVal($rootScope.formView.form.data.device),
            "device_name": stringVal($rootScope.formView.form.data.device_name),
            "ip": stringVal($rootScope.formView.form.data.ip),
            "paper_size": stringVal($rootScope.formView.form.data.paper_size),
            "device_type": stringVal($rootScope.formView.form.data.device_type),
            "connection": stringVal($rootScope.formView.form.data.connection),
            "device_for": stringVal($rootScope.formView.form.data.device_for),
            "device_brand": stringVal($rootScope.formView.form.data.device_brand),
            "item_groups": $rootScope.formView.form.data.item_groups,
        }
        return data;
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {

    }
}

