baticApp.doctypes['stock-reconciliation'] = {
    load: function (form, scope) {

        if (form.cost_center && !$.trim(form.cost_center)) {
            if (form && form.company && form.company.length) {
                frappe.call({
                    method: "frappe.client.validate_link",
                    args: {
                        doctype: 'Company',
                        docname: form.company,
                        fields: ['cost_center'],
                    },
                    callback: function (response) {
                        if (response.message) {
                            form.cost_center = (response.message.cost_center) ? response.message.cost_center : '';
                            scope.$apply();
                        }
                    }
                });
            }
        }

        if (form.expense_account && !$.trim(form.expense_account)) {
            if (form && form.company && form.company.length) {
                frappe.call({
                    method: "erpnext.stock.doctype.stock_reconciliation.stock_reconciliation.get_difference_account",
                    args: {
                        company: form.company,
                        purpose: (form.purpose && form.purpose.length) ? form.purpose : '',
                    },
                    callback: function (response) {
                        if (response.message) {
                            form.expense_account = (response.message) ? response.message : '';
                            scope.$apply();
                        }
                    }
                });
            }
        }

    },
    data: function ($rootScope) {
        return {
            "naming_series": stringVal($rootScope.formView.form.data.naming_series),
            "company": stringVal($rootScope.formView.form.data.company),
            "posting_date": moment($rootScope.formView.form.data.posting_date).format('YYYY-MM-DD'),
            "posting_time": stringVal($rootScope.formView.form.data.posting_time),
            "purpose": stringVal($rootScope.formView.form.data.purpose),
            "expense_account": stringVal($rootScope.formView.form.data.expense_account),
            "cost_center": stringVal($rootScope.formView.form.data.cost_center),
            "items": ($rootScope.formView.form.data.items) ? this.items($rootScope.formView.form.data.items) : [],
        };
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {
        // Items
        $(document).on('change', '#field-table-items [data-fieldname="item_code"], #field-table-items [data-fieldname="warehouse"]', function () {
            let row = $(this).parents('tr');
            if ($('[data-fieldname="item_code"]', row).val() && $('[data-fieldname="warehouse"]', row).val() && form_data.posting_date && form_data.posting_time) {
                frappe.call({
                    method: "erpnext.stock.doctype.stock_reconciliation.stock_reconciliation.get_stock_balance_for",
                    args: {
                        item_code: $('[data-fieldname="item_code"]', row).val(),
                        warehouse: $('[data-fieldname="warehouse"]', row).val(),
                        posting_date: moment(form_data.posting_date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                        posting_time: form_data.posting_time
                    },
                    callback: function (response) {
                        if (response.message) {
                            $timeout(() => {
                                $('[data-fieldname="qty"]', row).val(response.message.qty).trigger('input');
                                $('[data-fieldname="valuation_rate"]', row).val(response.message.rate || '0').trigger('input');
                            }, 10);
                        }
                    }
                });
            }
        });
        $(document).on('change', '[data-fieldname="company"], [data-fieldname="purpose"]', function () {
            console.log(this)
            if (form_data && form_data.company && form_data.company.length) {
                frappe.call({
                    method: "erpnext.stock.doctype.stock_reconciliation.stock_reconciliation.get_difference_account",
                    args: {
                        company: form_data.company,
                        purpose: (form_data.purpose && form_data.purpose.length) ? form_data.purpose : '',
                    },
                    callback: function (response) {
                        if (response.message) {
                            form_data.expense_account = (response.message) ? response.message : '';
                            $scope.$apply();
                        }
                    }
                });
            }
        });
    },
    items: function (items) {
        let list = [];
        for (let key in items) {
            if (items.hasOwnProperty(key)) {
                let item = items[key];
                let list_item = {};
                list_item['item_code'] = item.item_code;
                list_item['warehouse'] = item.warehouse;
                list_item['qty'] = item.qty;
                list_item['valuation_rate'] = item.valuation_rate;
                list.push(list_item);
            }
        }
        return list;
    }
}
