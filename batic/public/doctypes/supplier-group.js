baticApp.doctypes['supplier-group'] = {
    load: function (form, scope) {

    },
    data: function ($rootScope) {
        return {
            "supplier_group_name": stringVal($rootScope.formView.form.data.supplier_group_name),
            "parent_supplier_group": stringVal($rootScope.formView.form.data.parent_supplier_group),
            "is_group": ($rootScope.formView.form.data.is_group == 1) ? 1 : 0
        }
    }
}
