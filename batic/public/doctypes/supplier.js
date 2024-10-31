baticApp.doctypes['supplier'] = {
    load: function (form, scope) {

    },
    data: function ($rootScope) {
        return {
            "image": stringVal($rootScope.formView.form.data.image),
            "supplier_name": stringVal($rootScope.formView.form.data.supplier_name),
            "supplier_name_in_arabic": stringVal($rootScope.formView.form.data.supplier_name_in_arabic),
            "supplier_group": stringVal($rootScope.formView.form.data.supplier_group),
            "supplier_type": stringVal($rootScope.formView.form.data.supplier_type),
            "country": stringVal($rootScope.formView.form.data.country),
            "tax_id": stringVal($rootScope.formView.form.data.tax_id),
            "email_id": stringVal($rootScope.formView.form.data.email_id),
            "mobile_no": stringVal($rootScope.formView.form.data.mobile_no)

        }
    }
}
