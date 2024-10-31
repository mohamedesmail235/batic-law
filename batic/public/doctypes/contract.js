baticApp.doctypes['contract'] = {
    init: function (form_data, $rootScope, $scope, $http, $timeout) {

    },
    load: function (form, scope) {
        if (form.party_type && form.party_type.length) {
            $('[data-fieldname="party_name"]').parents('.form-field-link').attr({
                "data-doctype": form.party_type,
                "data-reference_doctype": 'Contract',
                "data-ignore_user_permissions": 0,
            });
        } else {
            form.party = '';
        }
    },
    data: function ($rootScope) {
        return $rootScope.formView.form.get_data();
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {
        // Get Quotation Details
        $(document).on('field-link-blur', '[data-fieldname="quotation"]', function () {
            if (form_data.quotation && $rootScope.formType !== 'view') {
                frappe.call({
                    method: "batic.l_management.doctype.worktime.worktime.get_doc_record_details",
                    args: {
                        doctype: 'Quotation',
                        docname: form_data.quotation,
                    },
                    callback: ({message}) => {
                        $timeout(() => {
                            if (!form_data.party_name)
                                $('[data-fieldname="party_name"]').val(message.party_name).triggerAll('input field-link-blur');
                            if (!form_data.calculation_type)
                                $('[data-fieldname="calculation_type"]').val(message.calculation_type).trigger('change');
                            if (!form_data.per_hour_type)
                                $('[data-fieldname="per_hour_type"]').val(message.per_hour_type).trigger('change');
                            if (!form_data.fee)
                                $('[data-fieldname="fee"]').val(message.fee).trigger('input');
                            if (!form_data.percentage)
                                $('[data-fieldname="percentage"]').val(message.percentage).trigger('input');
                            if (!form_data.target_hours)
                                $('[data-fieldname="target_hours"]').val(message.target_hours).trigger('input');
                            if (!form_data.target_hour_price)
                                $('[data-fieldname="target_hour_price"]').val(message.target_hour_price).trigger('input');
                        }, 100);
                    }
                });
            }
        });
        // Get Contract Template
        $(document).on('field-link-blur', '[data-fieldname="contract_template"]', function () {
            if (form_data.contract_template && $rootScope.formType !== 'view') {
                frappe.call({
                    method: "batic.l_management.doctype.worktime.worktime.get_doc_record_details",
                    args: {
                        doctype: 'Contract Template',
                        docname: form_data.contract_template,
                    },
                    callback: ({message}) => {
                        $timeout(() => {
                            if (!form_data.contract_terms) {
                                $rootScope.formEditors['editor-contract_terms'].clipboard.dangerouslyPasteHTML(message.contract_terms);
                            }
                        }, 100);
                    }
                });
            }
        });
    }
}
