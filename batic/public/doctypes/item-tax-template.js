baticApp.doctypes['item-tax-template'] = {
    load: function (form, scope) {

    },
    data: function ($rootScope) {
        return {
            "title": stringVal($rootScope.formView.form.data.title),
            "enabled": ($rootScope.formView.form.data.enabled == 1) ? 1 : 0,
            "accounts": ($rootScope.formView.form.data.accounts) ? this.taxes($rootScope.formView.form.data.accounts) : []
        }
    }
}
