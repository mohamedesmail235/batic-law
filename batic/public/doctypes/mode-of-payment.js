baticApp.doctypes['mode-of-payment'] = {
    load: function (form, scope) {

    },
    data: function ($rootScope) {
        return {
            "mode_of_payment": stringVal($rootScope.formView.form.data.mode_of_payment),
            "type": stringVal($rootScope.formView.form.data.type),
            "enabled": ($rootScope.formView.form.data.enabled == 1) ? 1 : 0,
            "accounts": ($rootScope.formView.form.data.accounts) ? this.taxes($rootScope.formView.form.data.accounts) : []
        }
    },
    taxes: function (accounts) {
        let list = [];
        for (let key in accounts) {
            if (accounts.hasOwnProperty(key)) {
                let account = accounts[key];
                let list_account = {};
                list_account['company'] = account.company;
                list_account['default_account'] = account.default_account;
                list.push(list_account);
            }
        }
        return list;
    }
}
