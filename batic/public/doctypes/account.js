baticApp.doctypes['account'] = {
    load: function (form, scope) {


    },
    init: function (form, $rootScope, $scope, $http, $timeout) {

    },
    data: function ($rootScope) {
        return {
            "account_name": stringVal($rootScope.formView.form.data.account_name),
            "parent_account": stringVal($rootScope.formView.form.data.parent_account),
            "account_type": stringVal($rootScope.formView.form.data.account_type),
            "root_type": stringVal($rootScope.formView.form.data.root_type),
            "company": stringVal($rootScope.formView.form.data.company),
            "account_currency": stringVal($rootScope.formView.form.data.account_currency),
            "balance_must_be": stringVal($rootScope.formView.form.data.balance_must_be),
            "tax_rate": floatVal($rootScope.formView.form.data.tax_rate),
            "report_type": stringVal($rootScope.formView.form.data.report_type),
            "disabled": ($rootScope.formView.form.data.disabled == 1) ? 1 : 0,
            "is_group": ($rootScope.formView.form.data.is_group == 1) ? 1 : 0
        }
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {
        $(document).on('field-link-blur', '[data-fieldname="parent_account"]', function () {
            if (form_data && form_data.parent_account && form_data.parent_account.length) {
                frappe.call({
                    method: "frappe.client.validate_link",
                    args: {
                        doctype: 'Account',
                        docname: form_data.parent_account,
                        fields: ['root_type', 'report_type'],
                    },
                    callback: function (response) {
                        if (response.message) {
                            form_data.root_type = (response.message.root_type) ? response.message.root_type : '';
                            form_data.report_type = (response.message.report_type) ? response.message.report_type : '';
                            $scope.$apply();
                        }
                    }
                });
            }
        });
    }
}
