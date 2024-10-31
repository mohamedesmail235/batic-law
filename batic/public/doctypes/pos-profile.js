baticApp.doctypes['pos-profile'] = {
    is_loaded: false,
    init: function (form, $rootScope, $scope, $http, $timeout) {
        setTimeout(() => {
            $('[data-fieldname="company"]').trigger('field-link-blur');
        }, 1000);
    },
    load: function (form, $rootScope, $scope, $http, $timeout) {

    },
    data: function ($rootScope) {
        let data = {
            "__newname": stringVal($rootScope.formView.form.data.__newname),
            "company": stringVal($rootScope.formView.form.data.company),
            "pos_logo": stringVal($rootScope.formView.form.data.pos_logo),
            "currency": stringVal($rootScope.formView.form.data.currency),
            "cost_center": stringVal($rootScope.formView.form.data.cost_center),
            "location": stringVal($rootScope.formView.form.data.location),
            "address": stringVal($rootScope.formView.form.data.address),
            "country": stringVal($rootScope.formView.form.data.country),
            "tax_id": stringVal($rootScope.formView.form.data.tax_id),
            "warehouse": stringVal($rootScope.formView.form.data.warehouse),
            "campaign": stringVal($rootScope.formView.form.data.campaign),
            "customer": stringVal($rootScope.formView.form.data.customer),
            "company_address": stringVal($rootScope.formView.form.data.company_address),
            "disabled": ($rootScope.formView.form.data.disabled == 1) ? 1 : 0,
            "posa_allow_delete": ($rootScope.formView.form.data.posa_allow_delete == 1) ? 1 : 0,
            "posa_allow_user_to_edit_rate": ($rootScope.formView.form.data.posa_allow_user_to_edit_rate == 1) ? 1 : 0,
            "posa_allow_user_to_edit_additional_discount": ($rootScope.formView.form.data.posa_allow_user_to_edit_additional_discount == 1) ? 1 : 0,
            "posa_allow_user_to_edit_item_discount": ($rootScope.formView.form.data.posa_allow_user_to_edit_item_discount == 1) ? 1 : 0,
            "posa_display_items_in_stock": ($rootScope.formView.form.data.posa_display_items_in_stock == 1) ? 1 : 0,
            "posa_allow_partial_payment": ($rootScope.formView.form.data.posa_allow_partial_payment == 1) ? 1 : 0,
            "posa_allow_credit_sale": ($rootScope.formView.form.data.posa_allow_credit_sale == 1) ? 1 : 0,
            "posa_allow_return": ($rootScope.formView.form.data.posa_allow_return == 1) ? 1 : 0,
            "posa_apply_customer_discount": ($rootScope.formView.form.data.posa_apply_customer_discount == 1) ? 1 : 0,
            "use_cashback": ($rootScope.formView.form.data.use_cashback == 1) ? 1 : 0,
            "use_customer_credit": ($rootScope.formView.form.data.use_customer_credit == 1) ? 1 : 0,
            "posa_hide_closing_shift": ($rootScope.formView.form.data.posa_hide_closing_shift == 1) ? 1 : 0,
            "posa_auto_set_batch": ($rootScope.formView.form.data.posa_auto_set_batch == 1) ? 1 : 0,
            "posa_display_item_code": ($rootScope.formView.form.data.posa_display_item_code == 1) ? 1 : 0,
            "posa_allow_zero_rated_items": ($rootScope.formView.form.data.posa_allow_zero_rated_items == 1) ? 1 : 0,
            "posa_allow_sales_order": ($rootScope.formView.form.data.posa_allow_sales_order == 1) ? 1 : 0,
            "posa_show_template_items": ($rootScope.formView.form.data.posa_show_template_items == 1) ? 1 : 0,
            "posa_fetch_coupon": ($rootScope.formView.form.data.posa_fetch_coupon == 1) ? 1 : 0,
            "posa_allow_customer_purchase_order": ($rootScope.formView.form.data.posa_allow_customer_purchase_order == 1) ? 1 : 0,
            "posa_allow_print_last_invoice": ($rootScope.formView.form.data.posa_allow_print_last_invoice == 1) ? 1 : 0,
            "posa_display_additional_notes": ($rootScope.formView.form.data.posa_display_additional_notes == 1) ? 1 : 0,
            "posa_allow_write_off_change": ($rootScope.formView.form.data.posa_allow_write_off_change == 1) ? 1 : 0,
            "posa_new_line": ($rootScope.formView.form.data.posa_new_line == 1) ? 1 : 0,
            "posa_input_qty": ($rootScope.formView.form.data.posa_input_qty == 1) ? 1 : 0,
            "posa_allow_print_draft_invoices": ($rootScope.formView.form.data.posa_allow_print_draft_invoices == 1) ? 1 : 0,
            "posa_use_delivery_charges": ($rootScope.formView.form.data.posa_use_delivery_charges == 1) ? 1 : 0,
            "posa_auto_set_delivery_charges": ($rootScope.formView.form.data.posa_auto_set_delivery_charges == 1) ? 1 : 0,
            "hide_images": ($rootScope.formView.form.data.hide_images == 1) ? 1 : 0,
            "hide_unavailable_items": ($rootScope.formView.form.data.hide_unavailable_items == 1) ? 1 : 0,
            "auto_add_item_to_cart": ($rootScope.formView.form.data.auto_add_item_to_cart == 1) ? 1 : 0,
            "validate_stock_on_save": ($rootScope.formView.form.data.validate_stock_on_save == 1) ? 1 : 0,
            "ignore_pricing_rule": ($rootScope.formView.form.data.ignore_pricing_rule == 1) ? 1 : 0,
            "allow_rate_change": ($rootScope.formView.form.data.allow_rate_change == 1) ? 1 : 0,
            "allow_discount_change": ($rootScope.formView.form.data.allow_discount_change == 1) ? 1 : 0,
            "print_format": stringVal($rootScope.formView.form.data.print_format),
            "letter_head": stringVal($rootScope.formView.form.data.letter_head),
            "select_print_heading": stringVal($rootScope.formView.form.data.select_print_heading),
            "tc_name": stringVal($rootScope.formView.form.data.tc_name),
            "selling_price_list": stringVal($rootScope.formView.form.data.selling_price_list),
            "income_account": stringVal($rootScope.formView.form.data.income_account),
            "expense_account": stringVal($rootScope.formView.form.data.expense_account),
            "write_off_account": stringVal($rootScope.formView.form.data.write_off_account),
            "taxes_and_charges": stringVal($rootScope.formView.form.data.taxes_and_charges),
            "write_off_cost_center": stringVal($rootScope.formView.form.data.write_off_cost_center),
            "tax_category": stringVal($rootScope.formView.form.data.tax_category),
            "applicable_for_users": $rootScope.formView.form.data.applicable_for_users,
            "payments": $rootScope.formView.form.data.payments,
            "item_groups": $rootScope.formView.form.data.item_groups,
            "customer_groups": $rootScope.formView.form.data.customer_groups,
        }
        return data;
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {
        $(document).on('field-link-blur', '[data-fieldname="company"]', function () {
            if (form_data && form_data.company) {
                setTimeout(() => {
                    $('[data-fieldname="warehouse"]').parents('.form-field-link').attr({
                        "data-filters": JSON.stringify([["Warehouse", "company", "in", ["", form_data.company]], ["Warehouse", "is_group", "=", 0]])
                    });
                    $('[data-fieldname="company_address"]').parents('.form-field-link').attr({
                        "data-filters": JSON.stringify({"link_doctype": "Company", "link_name": form_data.company})
                    });
                    $('[data-fieldname="income_account"]').parents('.form-field-link').attr({
                        "data-filters": JSON.stringify({"is_group": 0, "company": form_data.company, "account_type": "Income Account"})
                    });
                    $('[data-fieldname="expense_account"]').parents('.form-field-link').attr({
                        "data-filters": JSON.stringify({"report_type": "Profit and Loss", "company": form_data.company, "is_group": 0})
                    });
                    $('[data-fieldname="write_off_account"]').parents('.form-field-link').attr({
                        "data-filters": JSON.stringify({"report_type": "Profit and Loss", "is_group": 0, "company": form_data.company})
                    });
                    $('[data-fieldname="taxes_and_charges"]').parents('.form-field-link').attr({
                        "data-filters": JSON.stringify([["Sales Taxes and Charges Template", "company", "=", form_data.company], ["Sales Taxes and Charges Template", "docstatus", "!=", 2]])
                    });
                    $('[data-fieldname="write_off_cost_center"]').parents('.form-field-link').attr({
                        "data-filters": JSON.stringify({"is_group": 0, "company": form_data.company})
                    });
                    $('[data-fieldname="account_for_change_amount"]').parents('.form-field-link').attr({
                        "data-filters": JSON.stringify({"account_type": ["in", ["Cash", "Bank"]], "is_group": 0, "company": form_data.company})
                    });
                    $('[data-fieldname="cost_center"]').parents('.form-field-link').attr({
                        "data-filters": JSON.stringify({"dimension": "cost_center", "account": "", "company": form_data.company})
                    });
                }, 100);
                if (!form_data.country || !form_data.tax_id) {
                    frappe.call({
                        method: "frappe.client.validate_link",
                        args: {
                            doctype: 'Company',
                            docname: form_data.company,
                            fields: ["country", 'tax_id']
                        },
                        callback: function (response) {
                            if (response.message) {
                                $timeout(() => {
                                    form_data.country = response.message.country;
                                    form_data.tax_id = response.message.tax_id;
                                })
                            }
                        }
                    });
                }
            }
        });
    }
}

