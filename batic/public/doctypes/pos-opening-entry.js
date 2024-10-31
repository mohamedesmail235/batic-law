baticApp.doctypes['pos-opening-entry'] = {
    is_loaded: false,
    init: function (form, $rootScope, $scope, $http, $timeout) {


    },
    load: function (form, $rootScope, $scope, $http, $timeout) {

    },
    data: function ($rootScope) {
        let data = {
            "period_start_date": stringVal($rootScope.formView.form.data.period_start_date),
            "company": stringVal($rootScope.formView.form.data.company),
            "pos_profile": stringVal($rootScope.formView.form.data.pos_profile),
            "posting_date": stringVal($rootScope.formView.form.data.posting_date),
            "user": stringVal($rootScope.formView.form.data.user),
            "balance_details": $rootScope.formView.form.data.balance_details
        }
        return data;
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {
        $(document).on('field-link-blur', '[data-fieldname="pos_profile"]', function () {
            console.log('[data-fieldname="pos_profile"]', form_data)
            if (form_data && form_data.pos_profile) {
                frappe.call({
                    method: "frappe.client.get",
                    args: {
                        doctype: 'POS Profile',
                        name: form_data.pos_profile,
                        fields: ['payments']
                    },
                    callback: function (response) {
                        if (response.message) {
                            form_data.balance_details = response.message.payments;
                            $scope.$apply()
                        }
                    }
                });
            }
        });
    }
}

