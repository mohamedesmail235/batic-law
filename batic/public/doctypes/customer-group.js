baticApp.doctypes['customer-group'] = {
    load: function (form, scope) {

    },
    data: function ($rootScope) {
        return {
            "customer_group_name": stringVal($rootScope.formView.form.data.customer_group_name),
            "parent_customer_group": stringVal($rootScope.formView.form.data.parent_customer_group),
            "is_group": ($rootScope.formView.form.data.is_group == 1) ? 1 : 0
        }
    }
}
