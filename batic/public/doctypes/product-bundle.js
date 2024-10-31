baticApp.doctypes['product-bundle'] = {
    load: function (form, scope) {


    },
    data: function ($rootScope) {
        return {
            "company_name": stringVal($rootScope.formView.form.data.company_name),
            "company_name_in_arabic": stringVal($rootScope.formView.form.data.company_name_in_arabic),
            "domain": stringVal($rootScope.formView.form.data.domain),
            "abbr": stringVal($rootScope.formView.form.data.abbr),
            "parent_company": stringVal($rootScope.formView.form.data.parent_company),
            "default_currency": stringVal($rootScope.formView.form.data.default_currency),
            "country": stringVal($rootScope.formView.form.data.country),
            "default_finance_book": stringVal($rootScope.formView.form.data.default_finance_book),
            "tax_id": stringVal($rootScope.formView.form.data.tax_id),
            "is_group": ($rootScope.formView.form.data.is_group == 1) ? 1 : 0
        }
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {

    }
}
