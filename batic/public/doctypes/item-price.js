baticApp.doctypes['item-price'] = {
    load: function (form, scope) {

    },
    data: function ($rootScope) {
        return {
            "item_code": stringVal($rootScope.formView.form.data.item_code),
            "price_list": stringVal($rootScope.formView.form.data.price_list),
            "price_list_rate": floatVal($rootScope.formView.form.data.price_list_rate)
        };
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {

    }
}
