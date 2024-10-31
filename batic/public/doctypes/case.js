baticApp.doctypes['case'] = {
    load: function (form, scope) {
        if (form.linked_document_type_ && form.linked_document_type_.length) {
            $('[data-fieldname="linked_document"]').parents('.form-field-link').attr({
                "data-doctype": form.linked_document_type_,
                "data-reference_doctype": 'Task',
                "data-ignore_user_permissions": 0,
            });
        } else {
            form.linked_document_type_ = '';
        }
        $('[data-fieldname="parent_task"]').parents('.form-field-link').attr({
            "data-filters": JSON.stringify({"is_group": 1, "name": ["!=", scope.$root.formView.docname]}),
        });
    },
    data: function ($rootScope) {
        let data = {};
        let fields = $rootScope.formView.form.get_fields();
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
        //start_date_in_hijri
        $(document).on('input', '[data-fieldname="start_date_in_hijri"]', function () {
            $timeout(() => {
                console.log(form_data.start_date_in_hijri)
                const hijriDate = moment(form_data.start_date_in_hijri, 'iYYYY-iMM-iDD');
                const gregorianDate = hijriDate.format('YYYY-MM-DD');
                form_data.start_date = gregorianDate;
            }, 10);
        });
        //close_date_in_hijri
        $(document).on('input', '[data-fieldname="close_date_in_hijri"]', function () {
            $timeout(() => {
                console.log(form_data.close_date_in_hijri)
                const hijriDate = moment(form_data.close_date_in_hijri, 'iYYYY-iMM-iDD');
                const gregorianDate = hijriDate.format('YYYY-MM-DD');
                form_data.close_date = gregorianDate;
            }, 10);
        });
    }
}
