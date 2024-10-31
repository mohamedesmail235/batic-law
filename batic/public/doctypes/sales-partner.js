baticApp.doctypes['sales-partner'] = {
    load: function (form, scope) {

    },
    data: function ($rootScope) {
        return {
            "partner_name": stringVal($rootScope.formView.form.data.partner_name),
            "commission_rate": floatVal($rootScope.formView.form.data.commission_rate),
            "partner_type": stringVal($rootScope.formView.form.data.partner_type),
            "territory": stringVal($rootScope.formView.form.data.territory)
        }
    }
}
