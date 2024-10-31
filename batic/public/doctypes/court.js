baticApp.doctypes['court'] = {
    load: function (form, scope) {

    },
    data: function ($rootScope) {
        let data = {};
        let fields = $rootScope.formView.form.get_fields();
        console.log('fields', fields)
        fields.map(field => {
            if (field.type === 'Fload' || field.type === 'Int' || field.type === 'Currency') {
                data[field.name] = ($rootScope.formView.form.data[field.name] || '0.00');
            } else if (field.type === 'Check') {
                data[field.name] = ($rootScope.formView.form.data[field.name] === '1') ? 1 : 0;
            } else if (field.type === 'Table') {
                let table_data = $rootScope.formView.form.data[field.name];
                let send_data = [];
                let fields_names = field.fields.map(f => f.name);
                if (table_data && table_data.length) {
                    send_data = table_data.map(item => {
                        let newObj = {};
                        fields_names.forEach(key => {
                            if (item.hasOwnProperty(key)) {
                                newObj[key] = item[key];
                            }
                        });
                        return newObj;
                    });
                }
                data[field.name] = send_data;
            } else {
                data[field.name] = stringVal($rootScope.formView.form.data[field.name]);
            }
        });
        return data
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {

    }
}
