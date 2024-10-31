baticApp.doctypes['pos-closing-shift'] = {
    is_loaded: false,
    init: function (form, $rootScope, $scope, $http, $timeout) {
        if (!form.grand_total || form.grand_total == 0)
            form.grand_total = 0;
        if (!form.net_total || form.net_total == 0)
            form.net_total = 0;
        if (!form.total_quantity || form.total_quantity == 0)
            form.total_quantity = 0;
    },
    load: function (form, $rootScope, $scope, $http, $timeout) {

    },
    data: function ($rootScope) {
        let data = {
            "period_start_date": stringVal($rootScope.formView.form.data.period_start_date),
            "period_end_date": stringVal($rootScope.formView.form.data.period_end_date),
            "posting_date": stringVal($rootScope.formView.form.data.posting_date),
            "pos_opening_shift": stringVal($rootScope.formView.form.data.pos_opening_shift),
            "company": stringVal($rootScope.formView.form.data.company),
            "pos_profile": stringVal($rootScope.formView.form.data.pos_profile),
            "user": stringVal($rootScope.formView.form.data.user),
            "pos_transactions": $rootScope.formView.form.data.pos_transactions,
            "payment_reconciliation": $rootScope.formView.form.data.payment_reconciliation,
            "grand_total": floatVal($rootScope.formView.form.data.grand_total),
            "net_total": floatVal($rootScope.formView.form.data.net_total),
            "total_quantity": floatVal($rootScope.formView.form.data.total_quantity)
        }
        return data;
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {
        $(document).on('field-link-blur', '[data-fieldname="pos_opening_shift"]', function () {
            if (form_data && form_data.pos_opening_shift) {
                frappe.call({
                    method: "frappe.client.get",
                    args: {
                        doctype: 'POS Opening Shift',
                        name: form_data.pos_opening_shift,
                    },
                    callback: function (response) {
                        if (response.message) {
                            $timeout(() => {
                                form_data.period_start_date = response.message.period_start_date;
                                form_data.pos_profile = response.message.pos_profile;
                                form_data.user = response.message.user;
                                if (response.message.balance_details && response.message.balance_details.length) {
                                    if (!form_data.payment_reconciliation)
                                        form_data.payment_reconciliation = [];
                                    response.message.balance_details.map(row => {
                                        $timeout(function () {
                                            form_data.payment_reconciliation.push({
                                                mode_of_payment: row.mode_of_payment,
                                                opening_amount: row.amount,
                                                expected_amount: row.amount,
                                                difference: row.amount,
                                            });
                                        }, 10);
                                    });
                                }
                            }, 10);
                        }
                    }
                });
            }
        });
        $(document).on('blur', '#field-table-payment_reconciliation [data-fieldname="closing_amount"]', function () {
            let row = $(this).parents('tr');
            $('[data-fieldname="difference"]', row).val(parseFloat($('[data-fieldname="opening_amount"]', row).val()) - parseFloat($(this).val())).triggerAll('input focus blur');
        });
        $(document).on('change', '#field-table-pos_transactions [data-fieldname="sales_invoice"]', function () {
            let row = $(this).parents('tr');
            if (!$(this).val())
                return
            frappe.call({
                method: "frappe.client.get",
                args: {
                    doctype: 'Sales Invoice',
                    name: $(this).val()
                },
                callback: function (response) {
                    if (response.message) {
                        $timeout(() => {
                            $('[data-fieldname="posting_date"]', row).val(response.message.posting_date).trigger('input');
                            $('[data-fieldname="grand_total"]', row).val(response.message.grand_total || '0').trigger('input');
                            $('[data-fieldname="customer"]', row).val(response.message.customer).trigger('input');
                            form_data.grand_total += response.message.grand_total;
                            form_data.net_total += response.message.net_total;
                            form_data.total_quantity += response.message.total_qty;
                        }, 10);
                    }
                }
            });
        });
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

