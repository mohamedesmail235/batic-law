baticApp.doctypes['customer'] = {
    load: function (form, scope) {

    },
    data: function ($rootScope) {
        return {
            "image": stringVal($rootScope.formView.form.data.image),
            "customer_name": stringVal($rootScope.formView.form.data.customer_name),
            "customer_name_in_arabic": stringVal($rootScope.formView.form.data.customer_name_in_arabic),
            "customer_group": stringVal($rootScope.formView.form.data.customer_group),
            "customer_type": stringVal($rootScope.formView.form.data.customer_type),
            "territory": stringVal($rootScope.formView.form.data.territory),
            "tax_id": stringVal($rootScope.formView.form.data.tax_id),
            "mobile_no": stringVal($rootScope.formView.form.data.mobile_no),
            "mobile_number": stringVal($rootScope.formView.form.data.mobile_no),
            "email_address": stringVal($rootScope.formView.form.data.email_id),
            "email_id": stringVal($rootScope.formView.form.data.email_id)
        }
    }
}
