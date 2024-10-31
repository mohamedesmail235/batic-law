baticApp.doctypes['warehouse'] = {
    load: function (form, scope) {

    },
    data: function ($rootScope) {
        return {
            "warehouse_name": stringVal($rootScope.formView.form.data.warehouse_name),
            "company": stringVal($rootScope.formView.form.data.company),
            "disabled": ($rootScope.formView.form.data.disabled == 1) ? 1 : 0,
            "is_group": ($rootScope.formView.form.data.is_group == 1) ? 1 : 0
        };
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {

    }
}
