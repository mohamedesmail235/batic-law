baticApp.doctypes['cost-center'] = {
    load: function (form, scope) {

    },
    data: function ($rootScope) {
        return {
            "cost_center_name": stringVal($rootScope.formView.form.data.cost_center_name),
            "parent_cost_center": stringVal($rootScope.formView.form.data.parent_cost_center),
            "company": stringVal($rootScope.formView.form.data.company),
            "disabled": ($rootScope.formView.form.data.disabled == 1) ? 1 : 0,
            "is_group": ($rootScope.formView.form.data.is_group == 1) ? 1 : 0,
        }
    }
}
