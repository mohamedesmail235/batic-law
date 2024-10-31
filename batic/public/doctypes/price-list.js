baticApp.doctypes['price-list'] = {
    load: function (form, scope) {

    },
    data: function ($rootScope) {
        return {
            "price_list_name": stringVal($rootScope.formView.form.data.price_list_name),
            "currency": stringVal($rootScope.formView.form.data.currency),
            "enabled": ($rootScope.formView.form.data.enabled == 1) ? 1 : 0,
            "buying": ($rootScope.formView.form.data.buying == 1) ? 1 : 0,
            "selling": ($rootScope.formView.form.data.selling == 1) ? 1 : 0
        };
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {

    }
}
