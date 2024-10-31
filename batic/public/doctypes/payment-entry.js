baticApp.doctypes['payment-entry'] = {
    load: function (form, scope) {
        if (form.party_type && form.party_type.length) {
            $('[data-fieldname="party"]').parents('.form-field-link').attr({
                "data-doctype": form.party_type,
                "data-reference_doctype": 'Payment Entry',
                "data-ignore_user_permissions": 0,
                "data-query": (form.party_type == 'Customer' || form.party_type == 'Supplier') ? 'erpnext.controllers.queries.' + (form.party_type.toLowerCase()) + '_query' : ''
            });
        } else {
            form.party = '';
        }
        if (form.references) {
            setTimeout(() => {
                $('#field-table-references tr').each(function () {
                    let doctype = '';
                    if (form.party_type == 'Customer') {
                        doctype = 'Sales Invoice';
                    } else if (form.party_type == 'Supplier') {
                        doctype = 'Purchase Invoice';
                    }
                    $('[data-fieldname="reference_doctype"]', this).parents('.form-field-link').attr({
                        "data-filters": '{"name":["in",["' + doctype + '"]]}'
                    });
                });
            }, 100);
        }
    },
    data: function ($rootScope) {
        return {
            "naming_series": stringVal($rootScope.formView.form.data.naming_series),
            "payment_type": stringVal($rootScope.formView.form.data.payment_type),
            "posting_date": moment($rootScope.formView.form.data.posting_date).format('YYYY-MM-DD'),
            "company": stringVal($rootScope.formView.form.data.company),
            "party_type": stringVal($rootScope.formView.form.data.party_type),
            "party": stringVal($rootScope.formView.form.data.party),
            "party_name": stringVal($rootScope.formView.form.data.party_name),
            "paid_from": stringVal($rootScope.formView.form.data.paid_from),
            "paid_from_account_currency": stringVal($rootScope.formView.form.data.paid_from_account_currency),
            "paid_from_account_balance": stringVal($rootScope.formView.form.data.paid_from_account_balance),
            "paid_to": stringVal($rootScope.formView.form.data.paid_to),
            "paid_to_account_currency": stringVal($rootScope.formView.form.data.paid_to_account_currency),
            "paid_to_account_balance": stringVal($rootScope.formView.form.data.paid_to_account_balance),
            "mode_of_payment": stringVal($rootScope.formView.form.data.mode_of_payment),
            "paid_amount": floatVal($rootScope.formView.form.data.paid_amount),
            "received_amount": floatVal($rootScope.formView.form.data.paid_amount),
            "target_exchange_rate": 1,
            "references": ($rootScope.formView.form.data.references) ? this.references($rootScope.formView.form.data.references) : [],
            "reference_no": stringVal($rootScope.formView.form.data.reference_no),
            "reference_date": ($rootScope.formView.form.data.reference_date) ? moment($rootScope.formView.form.data.reference_date).format('YYYY-MM-DD') : '',
        };
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {
        $(document).on('change', '[data-fieldname="party"]', function () {
            if (form_data.party && form_data.party.length && form_data.company && form_data.party_type) {
                $http.post(frappe_api_url('erpnext.accounts.doctype.payment_entry.payment_entry.get_party_details'), {
                    company: form_data.company,
                    party_type: form_data.party_type,
                    party: form_data.party,
                    date: moment(form_data.posting_date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                }).then(function (response) {
                    $timeout(() => {
                        $('[data-fieldname="paid_from"]').parents('.form-field-link').attr('data-filters', JSON.stringify({"account_type": ["in", ["Receivable"]], "is_group": 0, "company": form_data.company}))
                    }, 10);
                    $timeout(() => {
                        form_data.party_name = response.data.message.party_name;
                        form_data.paid_from = response.data.message.party_account;
                        form_data.paid_from_account_currency = response.data.message.party_account_currency;
                        form_data.paid_from_account_balance = response.data.message.account_balance;
                    }, 50);
                });
            }
        });
        $(document).on('change', '[data-fieldname="paid_to"]', function () {
            if (form_data.paid_to) {
                $http.post(frappe_api_url('erpnext.accounts.doctype.payment_entry.payment_entry.get_account_details'), {
                    account: form_data.paid_to,
                    date: moment(form_data.posting_date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                }).then(function (response) {
                    $timeout(() => {
                        form_data.paid_to_account_currency = response.data.message.account_currency;
                        form_data.paid_to_account_balance = response.data.message.account_balance;
                    }, 10);
                });
            }
        });
        $(document).on('change', '#field-table-references [data-fieldname="reference_doctype"]', function () {
            let row = $(this).parents('tr');
            let doctype = $(this).val();
            let filters = {}
            if (doctype && form_data.company && form_data.party_type && form_data.party) {
                filters['docstatus'] = 1;
                filters['company'] = form_data.company;
                filters[(form_data.party_type).toLowerCase()] = form_data.party;
                $('[data-fieldname="reference_name"]', row).prop('disabled', false)
                $('[data-fieldname="reference_name"]', row).parents('.form-field-link').attr({
                    "data-doctype": doctype,
                    "data-reference_doctype": 'Payment Entry Reference',
                    "data-ignore_user_permissions": 0,
                    "data-filters": JSON.stringify(filters),
                });
            }
        });
        $(document).on('change', '#field-table-references [data-fieldname="reference_name"]', function () {
            let row = $(this).parents('tr');
            let reference_doctype = $('[data-fieldname="reference_doctype"]', row).val();
            let reference_name = $(this).val();
            if (reference_doctype && reference_name) {
                $http.post(frappe_api_url('erpnext.accounts.doctype.payment_entry.payment_entry.get_reference_details'), {
                    reference_doctype: reference_doctype,
                    reference_name: reference_name,
                    party_account_currency: baticApp.app.defaults.currency,
                }).then(function (response) {
                    $timeout(() => {
                        $('[data-fieldname="total_amount"]', row).val(response.data.message.total_amount).trigger('input');
                        $('[data-fieldname="outstanding_amount"]', row).val(response.data.message.outstanding_amount).trigger('input');
                        $('[data-fieldname="allocated_amount"]', row).val(0).trigger('input');
                    }, 10);
                    $timeout(() => {
                        $('[data-fieldname="total_amount"]', row).trigger('blur');
                        $('[data-fieldname="outstanding_amount"]', row).trigger('blur');
                        $('[data-fieldname="allocated_amount"]', row).trigger('blur');
                    }, 20);
                });
            }
        });
    },
    references: function (references) {
        let list = [];
        for (let key in references) {
            if (references.hasOwnProperty(key)) {
                let reference = references[key];
                let reference_obj = {};
                reference_obj['reference_doctype'] = reference.reference_doctype;
                reference_obj['reference_name'] = reference.reference_name;
                reference_obj['total_amount'] = floatVal(reference.total_amount);
                reference_obj['outstanding_amount'] = floatVal(reference.outstanding_amount);
                reference_obj['allocated_amount'] = floatVal(reference.allocated_amount);
                list.push(reference_obj);
            }
        }
        return list;
    },
}
