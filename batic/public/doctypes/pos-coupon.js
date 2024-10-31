baticApp.doctypes['pos-coupon'] = {
    is_loaded: false,
    init: function (form, $rootScope, $scope, $http, $timeout) {


    },
    load: function (form, $rootScope, $scope, $http, $timeout) {

    },
    data: function ($rootScope) {
        let data = {
            "coupon_name": stringVal($rootScope.formView.form.data.coupon_name),
            "coupon_type": stringVal($rootScope.formView.form.data.coupon_type),
            "customer": stringVal($rootScope.formView.form.data.customer),
            "coupon_code": stringVal($rootScope.formView.form.data.coupon_code),
            "company": stringVal($rootScope.formView.form.data.company),
            "pos_offer": stringVal($rootScope.formView.form.data.pos_offer),
            "maximum_use": intVal($rootScope.formView.form.data.maximum_use),
            "valid_from": moment($rootScope.formView.form.data.valid_from).format('YYYY-MM-DD'),
            "valid_upto": ($rootScope.formView.form.data.valid_upto) ? moment($rootScope.formView.form.data.valid_upto).format('YYYY-MM-DD') : '',
        }
        return data;
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {

    }
}

