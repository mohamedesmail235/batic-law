baticApp.doctypes['purchase-taxes-and-charges-template'] = {
    load: function (form, scope) {

        // Taxes Table
        if (form && form.taxes) {
            let field = scope.field
            let taxes_table = $('#field-table-taxes');
            if (field.name == 'taxes') {
                for (let key in form.taxes) {
                    if (form.taxes.hasOwnProperty(key)) {
                        let tax = form.taxes[key];
                        let row = $('tbody > tr:eq(' + key + ')', taxes_table);
                        if (tax.charge_type == 'Actual') {
                            $('[data-fieldname="rate"]', row).prop('disabled', true);
                            $('[data-fieldname="tax_amount"]', row).prop('disabled', false);
                        } else if (tax.charge_type == 'On Net Total' || tax.charge_type == 'On Previous Row Amount' || tax.charge_type == 'On Previous Row Total' || tax.charge_type == 'On Item Quantity') {
                            $('[data-fieldname="rate"]', row).prop('disabled', false);
                            $('[data-fieldname="tax_amount"]', row).prop('disabled', true);
                        } else {
                            $('[data-fieldname="rate"]', row).prop('disabled', true);
                            $('[data-fieldname="tax_amount"]', row).prop('disabled', true);
                        }
                    }
                }
            }
        }

    },
    data: function ($rootScope) {
        return {
            "title": stringVal($rootScope.formView.form.data.title),
            "company": stringVal($rootScope.formView.form.data.company),
            "tax_category": stringVal($rootScope.formView.form.data.tax_category),
            "is_default": ($rootScope.formView.form.data.is_default == 1) ? 1 : 0,
            "disabled": ($rootScope.formView.form.data.disabled == 1) ? 1 : 0,
            "taxes": ($rootScope.formView.form.data.taxes) ? this.taxes($rootScope.formView.form.data.taxes) : []
        }
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {
        $(document).on('change', '[data-fieldname="account_head"]', function () {
            if (form_data && form_data.taxes) {
                for (let key in form_data.taxes) {
                    if (form_data.taxes.hasOwnProperty(key)) {
                        let tax = form_data.taxes[key];
                        frappe.call({
                            method: "erpnext.controllers.accounts_controller.get_tax_rate",
                            args: {
                                account_head: tax.account_head,
                            },
                            callback: function (response) {
                                if (response.message) {
                                    $timeout(() => tax.description = response.message.account_name, 50)
                                }
                            }
                        });
                    }
                }
            }
        });
    },
    taxes: function (taxes) {
        let list = [];
        for (let key in taxes) {
            if (taxes.hasOwnProperty(key)) {
                let tax = taxes[key];
                let list_tax = {};
                list_tax['row_id'] = tax.row_id;
                list_tax['charge_type'] = tax.charge_type;
                list_tax['account_head'] = tax.account_head;
                list_tax['rate'] = (tax.rate) ? tax.rate : 0;
                list_tax['tax_amount'] = (tax.tax_amount) ? tax.tax_amount : 0;
                list_tax['total'] = (tax.total) ? tax.total : 0;
                list_tax['description'] = tax.description;
                list.push(list_tax);
            }
        }
        return list;
    }
}
