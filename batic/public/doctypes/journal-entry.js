baticApp.doctypes['journal-entry'] = {
    load: function (form, scope) {

    },
    data: function ($rootScope) {
        return {
            "naming_series": stringVal($rootScope.formView.form.data.naming_series),
            "company": stringVal($rootScope.formView.form.data.company),
            "posting_date": moment($rootScope.formView.form.data.posting_date).format('YYYY-MM-DD'),
            "cheque_no": stringVal($rootScope.formView.form.data.cheque_no),
            "cheque_date": moment($rootScope.formView.form.data.cheque_date).format('YYYY-MM-DD'),
            "accounts": $rootScope.formView.form.data.accounts,
        };
    },
    accounts: function (accounts) {
        let list = [];
        for (let key in accounts) {
            if (accounts.hasOwnProperty(key)) {
                let account = accounts[key];
                let list_item = {};
                list_item['account'] = account.account;
                if (account.debit_in_account_currency)
                    list_item['debit_in_account_currency'] = account.debit_in_account_currency;
                if (account.credit_in_account_currency)
                    list_item['credit_in_account_currency'] = account.credit_in_account_currency;
                list_item['cost_center'] = account.cost_center;
                list.push(list_item)
            }
        }
        return list;
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {
        $(document).on('field-link-blur', '[data-fieldname="company"]', function () {
            let filters = {}
            if (form_data.company) {
                $('#field-table-accounts tbody tr').each(function () {
                    let row = $(this);
                    let filters = {}
                    filters['company'] = form_data.company;
                    filters['is_group'] = 0;
                    filters['account_currency'] = baticApp.app.defaults.currency;
                    $('[data-fieldname="account"]', row).parents('.form-field-link').attr({
                        "data-filters": JSON.stringify(filters),
                    });
                });
            }
        });
        $(document).on('child-table-add-row', '#field-table-accounts', function () {
            let row = $('tbody tr', this);
            let filters = {}
            row.each(function () {
                filters['company'] = form_data.company;
                filters['is_group'] = 0;
                filters['account_currency'] = baticApp.app.defaults.currency;
                $('[data-fieldname="account"]', this).parents('.form-field-link').attr({
                    "data-filters": JSON.stringify(filters),
                });
            })
        });
        $(document).on('field-link-blur', '[data-fieldname="account"]', function () {
            let row = $(this).parents('tr');
            let account = $(this).val();
            console.log('account', account);
            if (account && account.length) {
                frappe.call({
                    method: "erpnext.accounts.doctype.journal_entry.journal_entry.get_account_balance_and_party_type",
                    args: {
                        account: account,
                        date: moment().format('YYYY-MM-DD'),
                        company: form_data.company
                    },
                    callback: function (response) {
                        let filters = {}
                        filters['account'] = account;
                        if (response.message) {
                            $('[data-fieldname="party_type"]', row).parents('.form-field-link').attr({
                                "data-filters": JSON.stringify(filters),
                            });
                            $('[data-fieldname="party_type"]', row).val(response.message.party_type).triggerAll('input field-link-blur');
                        }
                    }
                });
            } else {
                $('[data-fieldname="party_type"]', row).parents('.form-field-link').attr({
                    "data-filters": JSON.stringify({}),
                });
                $('[data-fieldname="party_type"]', row).val('').triggerAll('input field-link-blur');
            }
        });
    }
}
