baticApp.doctypes['selling-settings'] = {
    load: function (form, scope) {


    },
    data: function ($rootScope) {
        let data = {
            "cust_master_name": stringVal($rootScope.formView.form.data.cust_master_name),
            "territory": stringVal($rootScope.formView.form.data.territory),
            "customer_group": stringVal($rootScope.formView.form.data.customer_group),
            "campaign_naming_by": stringVal($rootScope.formView.form.data.campaign_naming_by),
            "contract_naming_by": stringVal($rootScope.formView.form.data.contract_naming_by),
            "default_valid_till": stringVal($rootScope.formView.form.data.default_valid_till),
            "close_opportunity_after_days": intVal($rootScope.formView.form.data.close_opportunity_after_days),
            "selling_price_list": stringVal($rootScope.formView.form.data.selling_price_list),
            "so_required": stringVal($rootScope.formView.form.data.so_required),
            "dn_required": stringVal($rootScope.formView.form.data.dn_required),
            "sales_update_frequency": stringVal($rootScope.formView.form.data.sales_update_frequency),
            "maintain_same_sales_rate": ($rootScope.formView.form.data.maintain_same_sales_rate == 1) ? 1 : 0,
            "editable_price_list_rate": ($rootScope.formView.form.data.editable_price_list_rate == 1) ? 1 : 0,
            "validate_selling_price": ($rootScope.formView.form.data.validate_selling_price == 1) ? 1 : 0,
            "editable_bundle_item_rates": ($rootScope.formView.form.data.editable_bundle_item_rates == 1) ? 1 : 0,
            "allow_multiple_items": ($rootScope.formView.form.data.allow_multiple_items == 1) ? 1 : 0,
            "allow_against_multiple_purchase_orders": ($rootScope.formView.form.data.allow_against_multiple_purchase_orders == 1) ? 1 : 0,
            "hide_tax_id": ($rootScope.formView.form.data.hide_tax_id == 1) ? 1 : 0
        }
        return data;
    }
}
