baticApp.doctypes['company'] = {
    load: function (form, scope) {


    },
    data: function ($rootScope) {
        let data = {
            "company_name": stringVal($rootScope.formView.form.data.company_name),
            "company_name_in_arabic": stringVal($rootScope.formView.form.data.company_name_in_arabic),
            "domain": stringVal($rootScope.formView.form.data.domain),
            "abbr": stringVal($rootScope.formView.form.data.abbr),
            "parent_company": stringVal($rootScope.formView.form.data.parent_company),
            "default_currency": stringVal($rootScope.formView.form.data.default_currency),
            "country": stringVal($rootScope.formView.form.data.country),
            "default_finance_book": stringVal($rootScope.formView.form.data.default_finance_book),
            "tax_id": stringVal($rootScope.formView.form.data.tax_id),
            "is_group": ($rootScope.formView.form.data.is_group == 1) ? 1 : 0
        }
        if ($rootScope.formView.form.data._form_view_type == 'view') {
            $.extend(data, {
                "create_chart_of_accounts_based_on": stringVal($rootScope.formView.form.data.create_chart_of_accounts_based_on),
                "chart_of_accounts": stringVal($rootScope.formView.form.data.chart_of_accounts),
                "default_bank_account": stringVal($rootScope.formView.form.data.default_bank_account),
                "default_cash_account": stringVal($rootScope.formView.form.data.default_cash_account),
                "default_receivable_account": stringVal($rootScope.formView.form.data.default_receivable_account),
                "round_off_account": stringVal($rootScope.formView.form.data.round_off_account),
                "round_off_cost_center": stringVal($rootScope.formView.form.data.round_off_cost_center),
                "write_off_account": stringVal($rootScope.formView.form.data.write_off_account),
                "default_payable_account": stringVal($rootScope.formView.form.data.default_payable_account),
                "default_expense_account": stringVal($rootScope.formView.form.data.default_expense_account),
                "cost_center": stringVal($rootScope.formView.form.data.cost_center),
                "default_inventory_account": stringVal($rootScope.formView.form.data.default_inventory_account),
                "stock_adjustment_account": stringVal($rootScope.formView.form.data.stock_adjustment_account),
                "enable_perpetual_inventory": ($rootScope.formView.form.data.enable_perpetual_inventory == 1) ? 1 : 0
            })
        }
        return data;
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {
        $(document).on('change', '[data-fieldname="create_chart_of_accounts_based_on"]', function () {
            if (form_data && form_data.create_chart_of_accounts_based_on && form_data.country) {
                frappe.call({
                    method: "erpnext.accounts.doctype.account.chart_of_accounts.chart_of_accounts.get_charts_for_country",
                    args: {
                        "country": form_data.country,
                        "with_standard": true
                    },
                    callback: function (response) {
                        if (response.message && response.message.length) {
                            $('[data-fieldname="chart_of_accounts"]').html(`${response.message.map(option => `<option value="${option}">${option}</option>`).join(' ')}`)
                        }
                    }
                })
            }
        });
    }
}

