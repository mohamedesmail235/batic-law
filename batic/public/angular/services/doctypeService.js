/*
* Doctype Service
*/

angular.module('services.api.doctype', []).service('Doctype', function ($http) {
    return {
        get_api: function (method) {
            return $http.get(frappe_api_url(method));
        },
        get_standard_filters: function (doctype) {
            return $http.post(api_url('get_standard_filters'), {doctype: doctype});
        },
        get_list: function (doctype, filters = {}, fields = ['*'], order_by = 'modified desc') {
            return $http.post(api_url('get_list'), {doctype: doctype, filters: filters, fields: fields, order_by: order_by});
        },
        get_report: function (report_name) {
            return $http.post(api_url('get_report'), {report_name: report_name});
        },
        get_report_data: function (report_name, filters) {
            return $http.post(frappe_api_url('frappe.desk.query_report.run'), {report_name: report_name, filters: filters});
        },
        query_report_script: function (report_name) {
            return $http.post(frappe_api_url('frappe.desk.query_report.get_script'), {report_name: report_name});
        },
        query_report_background: function (report_name, filters) {
            return $http.post(frappe_api_url('frappe.desk.query_report.background_enqueue_run'), {report_name: report_name, filters: filters});
        },
        get_doctype: function (doctype) {
            return $http.post(frappe_api_url('frappe.desk.form.load.getdoctype'), {doctype: doctype});
        },
        get_docinfo: function (doctype, name) {
            return $http.post(frappe_api_url('frappe.desk.form.load.getdoc'), {doctype: doctype, name: name});
        },
        get_doctype_print_format: function (doctype) {
            return $http.post(api_url('get_doctype_print_format'), {doctype: doctype});
        },
        get_naming_series: function (doctype) {
            return $http.post(api_url('get_naming_series'), {doctype: doctype});
        },
        validate_link: function (doctype, name, fields = []) {
            return $http.post(frappe_api_url('frappe.client.validate_link'), {doctype: doctype, name: name, fields: fields});
        },
        save: function (doctype, data) {
            return $http.post(frappe_api_resource(doctype), data);
        },
        update: function (doctype, name, data) {
            return $http.put(frappe_api_resource(doctype + '/' + name), data);
        },
        submit_or_cancel: function (doctype, name, status = 0) {
            return $http.put(frappe_api_resource(doctype + '/' + name), {docstatus: status});
        },
        search_link: function (doctype, reference_doctype, filters, txt = '', ignore_user_permissions = '0', query = '') {
            return $http.post(frappe_api_url('frappe.desk.search.search_link'), {
                'txt': txt,
                'doctype': doctype,
                'reference_doctype': reference_doctype,
                'query': query,
                'filters': filters,
                'ignore_user_permissions': ignore_user_permissions
            });
        },
        get_payment_entry: function (doctype, docname) {
            if (doctype && docname)
                return $http.post(frappe_api_url('erpnext.accounts.doctype.payment_entry.payment_entry.get_payment_entry'), {
                    'dt': doctype,
                    'dn': docname
                });
            else
                return {};
        },
        make_mapped_doc: function (method, docname, args, selected_children = {}) {
            if (method && docname)
                return $http.post(frappe_api_url('frappe.model.mapper.make_mapped_doc'), {
                    method: method,
                    source_name: docname,
                    args: args,
                    selected_children: selected_children
                });
            else
                return {};
        },
    }
});
