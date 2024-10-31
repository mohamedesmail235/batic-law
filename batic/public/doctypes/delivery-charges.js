baticApp.doctypes['delivery-charges'] = {
    is_loaded: false,
    init: function (form, $rootScope, $scope, $http, $timeout) {


    },
    load: function (form, $rootScope, $scope, $http, $timeout) {

    },
    data: function ($rootScope) {
        let data = {
            "label": stringVal($rootScope.formView.form.data.label),
            "company": stringVal($rootScope.formView.form.data.company),
            "default_rate": floatVal($rootScope.formView.form.data.default_rate),
            "disabled": ($rootScope.formView.form.data.disabled == 1) ? 1 : 0,
            "shipping_account": stringVal($rootScope.formView.form.data.shipping_account),
            "cost_center": stringVal($rootScope.formView.form.data.cost_center),
            "profiles": $rootScope.formView.form.data.profiles,
        }
        return data;
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {
        $(document).on('field-link-blur', '[data-fieldname="company"]', function () {
            let filters = {}
            if (form_data.company) {
                filters['company'] = form_data.company;
                $('[data-fieldname="shipping_account"]').parents('.form-field-link').attr({
                    "data-filters": JSON.stringify(filters),
                });
                $('#field-table-profiles tbody tr').each(function () {
                    let row = $(this);
                    let filters = {}
                    filters['company'] = form_data.company;
                    $('[data-fieldname="pos_profile"]', row).parents('.form-field-link').attr({
                        "data-filters": JSON.stringify(filters),
                    });
                });
            }
        });
        $(document).on('child-table-add-row', '#field-table-profiles', function () {
            let row = $('tbody tr', this);
            let filters = {}
            row.each(function () {
                filters['company'] = form_data.company;
                $('[data-fieldname="pos_profile"]', this).parents('.form-field-link').attr({
                    "data-filters": JSON.stringify(filters),
                });
            })
        });
    }
}

