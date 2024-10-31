baticApp.doctypes['sales-order'] = {
    load: function (form, scope) {

        if (!form.total || form.total == 0)
            form.total = 0;
        if (!form.total_qty || form.total_qty == 0)
            form.total_qty = 0;
        if (!form.grand_total || form.grand_total == 0)
            form.grand_total = 0;
        if (!form.total_taxes_and_charges || form.total_taxes_and_charges == 0)
            form.total_taxes_and_charges = 0;

        // Items Table
        if (form && form.items) {
            let items = form.items;
            let total = 0;
            let total_qty = 0;
            for (let key in items) {
                if (items.hasOwnProperty(key)) {
                    let item = items[key];
                    if (item.item_code && (!item.qty || item.qty == 0)) {
                        item.qty = 1;
                    }
                    if (item.qty && item.qty > 0) {
                        total_qty += parseFloat(item.qty);
                    }
                    if ((item.qty && item.qty > 0) && (item.rate && item.rate >= 0)) {
                        item.amount = (item.qty * item.rate);
                        total += parseFloat(item.amount);
                    }
                }
            }
            form.total = parseFloat(total).toFixed(2);
            form.total_qty = total_qty;
            if (form.total_taxes_and_charges > 0) {
                form.grand_total = parseFloat(parseFloat(form.total) + parseFloat(form.total_taxes_and_charges)).toFixed(2);
            } else {
                form.grand_total = parseFloat(form.total);
            }
        }

        // Taxes Table
        if (form && form.taxes) {
            let field = scope.field
            let taxes_table = $('#field-table-taxes');
            if (field.name == 'taxes') {
                let taxes = form.taxes;
                let total = 0;
                let index = 0;
                let taxes_count = Object.keys(taxes).length;
                for (let key in taxes) {
                    index++;
                    if (taxes.hasOwnProperty(key)) {
                        let tax = taxes[key];
                        let row = $('tbody > tr[data-row-uid="taxes_' + key + '"]', taxes_table);
                        let prev_row = row.prev();
                        if (tax.charge_type == 'Actual') {
                            if (index > 1) {
                                if ($('[data-fieldname="total"]', prev_row).val())
                                    tax.total = (parseFloat($('[data-fieldname="total"]', prev_row).val()) + parseFloat(tax.tax_amount)).toFixed(2);
                            } else {
                                tax.total = (parseFloat(form.total) + parseFloat(tax.tax_amount)).toFixed(2);
                            }
                            $('[data-fieldname="rate"]', row).prop('disabled', true);
                            $('[data-fieldname="tax_amount"]', row).prop('disabled', false);
                        } else if (tax.charge_type == 'On Net Total' || tax.charge_type == 'On Previous Row Amount' || tax.charge_type == 'On Previous Row Total' || tax.charge_type == 'On Item Quantity') {
                            tax.tax_amount = (parseFloat(form.total) * (parseFloat(tax.rate) / 100)).toFixed(2);
                            if (index > 1) {
                                if ($('[data-fieldname="total"]', prev_row).val())
                                    tax.total = (parseFloat($('[data-fieldname="total"]', prev_row).val()) + parseFloat(tax.tax_amount)).toFixed(2);
                            } else {
                                tax.total = (parseFloat(form.total) + parseFloat(tax.tax_amount)).toFixed(2);
                            }
                            $('[data-fieldname="rate"]', row).prop('disabled', false);
                            $('[data-fieldname="tax_amount"]', row).prop('disabled', true);
                        } else {
                            $('[data-fieldname="rate"]', row).prop('disabled', true);
                            $('[data-fieldname="tax_amount"]', row).prop('disabled', true);
                        }
                        total += parseFloat(tax.tax_amount);
                    }
                }
                if (total)
                    form.total_taxes_and_charges = parseFloat(total).toFixed(2);
                if (form.total_taxes_and_charges > 0) {
                    form.grand_total = parseFloat(parseFloat(form.total) + parseFloat(form.total_taxes_and_charges)).toFixed(2);
                }
            }
        }
    },
    data: function ($rootScope) {
        return {
            "naming_series": stringVal($rootScope.formView.form.data.naming_series),
            "order_type": stringVal('Sales'),
            "company": stringVal($rootScope.formView.form.data.company),
            "customer": stringVal($rootScope.formView.form.data.customer),
            "currency": stringVal(baticApp.app.defaults.currency),
            "transaction_date": moment($rootScope.formView.form.data.transaction_date).format('YYYY-MM-DD'),
            "delivery_date": moment($rootScope.formView.form.data.delivery_date).format('YYYY-MM-DD'),
            "total_qty": floatVal($rootScope.formView.form.data.total_qty),
            "total": floatVal($rootScope.formView.form.data.total),
            "total_taxes_and_charges": floatVal($rootScope.formView.form.data.total_taxes_and_charges),
            "grand_total": floatVal($rootScope.formView.form.data.grand_total),
            "items": ($rootScope.formView.form.data.items) ? this.items($rootScope.formView.form.data.items) : [],
            "taxes_and_charges": stringVal($rootScope.formView.form.data.taxes_and_charges),
            "taxes": ($rootScope.formView.form.data.taxes) ? this.taxes($rootScope.formView.form.data.taxes) : [],
        };
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {
        // Items
        $(document).on('change', '#field-table-items [data-fieldname="item_code"]', function () {
            let row = $(this).parents('tr');
            if (!$(this).val())
                return
            frappe.db.get_value('Item', {'name': $(this).val()}, ['item_name', 'stock_uom', 'standard_rate']).then(function (response) {
                $timeout(() => {
                    $('[data-fieldname="uom"]', row).val(response.message.stock_uom).trigger('input');
                    $('[data-fieldname="rate"]', row).val(response.message.standard_rate || '0').trigger('input');
                }, 10);
            });
        });
        // Purchase Taxes and Charges Template
        $(document).on('change', '[data-fieldname="taxes_and_charges"]', function () {
            if (form_data.taxes_and_charges && form_data.taxes_and_charges.length) {
                $http.post(frappe_api_url('erpnext.controllers.accounts_controller.get_taxes_and_charges'), {
                    master_doctype: 'Sales Taxes and Charges Template',
                    master_name: form_data.taxes_and_charges
                }).then(function (response) {
                    if (response.data.message && response.data.message.length) {
                        if (!form_data.taxes)
                            form_data.taxes = [];
                        response.data.message.map(tax => {
                            $timeout(function () {
                                let row = {};
                                row[new Date().getTime()] = tax;
                                form_data.taxes.push(tax);
                            }, 10);
                        });
                    }
                });
            }
        })
    },
    items: function (items) {
        let list = [];
        for (let key in items) {
            if (items.hasOwnProperty(key)) {
                let item = items[key];
                let list_item = {};
                list_item['item_code'] = item.item_code;
                list_item['delivery_date'] = moment(item.delivery_date).format('YYYY-MM-DD');
                list_item['uom'] = item.uom;
                list_item['qty'] = item.qty;
                list_item['rate'] = item.rate;
                list.push(list_item);
            }
        }
        return list;
    },
    taxes: function (taxes) {
        let list = [];
        for (let key in taxes) {
            if (taxes.hasOwnProperty(key)) {
                let tax = taxes[key];
                let list_tax = {};
                list_tax['charge_type'] = tax.charge_type;
                list_tax['row_id'] = tax.row_id;
                list_tax['account_head'] = tax.account_head;
                list_tax['description'] = tax.description;
                list_tax['included_in_print_rate'] = tax.included_in_print_rate;
                list_tax['included_in_paid_amount'] = tax.included_in_paid_amount;
                list_tax['cost_center'] = tax.cost_center;
                list_tax['rate'] = tax.rate;
                list_tax['account_currency'] = tax.account_currency;
                list_tax['tax_amount'] = tax.tax_amount;
                list_tax['total'] = tax.total;
                list_tax['tax_amount_after_discount_amount'] = tax.tax_amount_after_discount_amount;
                list_tax['base_tax_amount'] = tax.base_tax_amount;
                list_tax['base_total'] = tax.base_total;
                list_tax['base_tax_amount_after_discount_amount'] = tax.base_tax_amount_after_discount_amount;
                list_tax['item_wise_tax_detail'] = tax.item_wise_tax_detail;
                list_tax['dont_recompute_tax'] = tax.dont_recompute_tax;
                list.push(list_tax);
            }
        }
        return list;
    }
}
