baticApp.doctypes['buying-settings'] = {
    load: function (form, scope) {


    },
    data: function ($rootScope) {
        let data = {
            "supp_master_name": stringVal($rootScope.formView.form.data.supp_master_name),
            "supplier_group": stringVal($rootScope.formView.form.data.supplier_group),
            "buying_price_list": stringVal($rootScope.formView.form.data.buying_price_list),
            "maintain_same_rate_action": stringVal($rootScope.formView.form.data.maintain_same_rate_action),
            "role_to_override_stop_action": stringVal($rootScope.formView.form.data.role_to_override_stop_action),
            "po_required": stringVal($rootScope.formView.form.data.po_required),
            "pr_required": stringVal($rootScope.formView.form.data.pr_required),
            "backflush_raw_materials_of_subcontract_based_on": stringVal($rootScope.formView.form.data.backflush_raw_materials_of_subcontract_based_on),
            "over_transfer_allowance": floatVal($rootScope.formView.form.data.over_transfer_allowance),
            "maintain_same_rate": ($rootScope.formView.form.data.maintain_same_rate == 1) ? 1 : 0,
            "allow_multiple_items": ($rootScope.formView.form.data.allow_multiple_items == 1) ? 1 : 0,
            "bill_for_rejected_quantity_in_purchase_invoice": ($rootScope.formView.form.data.bill_for_rejected_quantity_in_purchase_invoice == 1) ? 1 : 0
        }
        return data;
    }
}
