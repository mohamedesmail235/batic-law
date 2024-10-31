baticApp.doctypes['pos-offer'] = {
    is_loaded: false,
    init: function (form, $rootScope, $scope, $http, $timeout) {


    },
    load: function (form, $rootScope, $scope, $http, $timeout) {

    },
    data: function ($rootScope) {
        let data = {
            "title": stringVal($rootScope.formView.form.data.title),
            "description": stringVal($rootScope.formView.form.data.description),
            "apply_on": stringVal($rootScope.formView.form.data.apply_on),
            "offer": stringVal($rootScope.formView.form.data.offer),
            "valid_from": moment($rootScope.formView.form.data.valid_from).format('YYYY-MM-DD'),
            "valid_upto": ($rootScope.formView.form.data.valid_upto) ? moment($rootScope.formView.form.data.valid_upto).format('YYYY-MM-DD') : '',
            "item": stringVal($rootScope.formView.form.data.item),
            "item_group": stringVal($rootScope.formView.form.data.item_group),
            "brand": stringVal($rootScope.formView.form.data.brand),
            "company": stringVal($rootScope.formView.form.data.company),
            "pos_profile": stringVal($rootScope.formView.form.data.pos_profile),
            "warehouse": stringVal($rootScope.formView.form.data.warehouse),
            "disable": ($rootScope.formView.form.data.disable == 1) ? 1 : 0,
            "coupon_based": ($rootScope.formView.form.data.coupon_based == 1) ? 1 : 0,
            "auto": ($rootScope.formView.form.data.auto == 1) ? 1 : 0,
            "balance_details": $rootScope.formView.form.data.balance_details
        }
        return data;
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {
        $(document).on('field-link-blur', '[data-fieldname="company"]', function () {
            $('[data-fieldname="pos_profile"]').parents('.form-field-link').attr({
                "data-filters": '{"company":"' + form_data.company + '"}'
            });
            $('[data-fieldname="warehouse"]').parents('.form-field-link').attr({
                "data-filters": '{"company":"' + form_data.company + '","is_group":0}'
            });
        });
        $(document).on('field-link-blur', '[data-fieldname="pos_profile"]', function () {
            if (form_data && form_data.pos_profile) {
                frappe.call({
                    method: "frappe.client.validate_link",
                    args: {
                        doctype: 'POS Profile',
                        docname: form_data.pos_profile,
                        fields: ['warehouse']
                    },
                    callback: function (response) {
                        if (response.message) {
                            form_data.warehouse = response.message.warehouse;
                            $scope.$apply()
                        }
                    }
                });
            }
        });
    }
}

