baticApp.doctypes['project'] = {
    load: function (form, scope) {

    },
    data: function ($rootScope) {
        let data = {};
        let fields = $rootScope.formView.form.get_fields();
        fields.map(field => {
            if (field.type === 'Fload' || field.type === 'Int' || field.type === 'Currency') {
                data[field.name] = floatVal($rootScope.formView.form.data[field.name]);
            } else if (field.type === 'Check') {
                data[field.name] = ($rootScope.formView.form.data[field.name] === '1') ? 1 : 0;
            } else {
                data[field.name] = stringVal($rootScope.formView.form.data[field.name]);
            }
        });
        return data
    }
}
