baticApp.doctypes['item'] = {
    load: function (form, scope) {

    },
    data: function ($rootScope) {
        return {
            "image": stringVal($rootScope.formView.form.data.image),
            "item_code": stringVal($rootScope.formView.form.data.item_code),
            "item_name": stringVal($rootScope.formView.form.data.item_name),
            "item_group": stringVal($rootScope.formView.form.data.item_group),
            "stock_uom": stringVal($rootScope.formView.form.data.stock_uom),
            "opening_stock": floatVal($rootScope.formView.form.data.opening_stock),
            "standard_rate": floatVal($rootScope.formView.form.data.standard_rate),
            "standard_buying_rate": floatVal($rootScope.formView.form.data.standard_buying_rate),
            "valuation_rate": floatVal($rootScope.formView.form.data.valuation_rate),
            "description": stringVal($rootScope.formView.form.data.description),
            "disabled": ($rootScope.formView.form.data.disabled == 1) ? 1 : 0,
        }
    }
}
