/*
* Page View
*/

baticApp.page['timesheet'] = {
    pageName: 'timesheet',
    view_type: 'custom',
    filters_list: [],
    filters_required: false,
    $http: undefined,
    $rootScope: undefined,
    $timeout: undefined,
    pageData: undefined,
    toolBarButtons: () => {
        const me = baticApp.page['timesheet'];
        return [
            {
                label: __("New Timesheet"),
                condition() {
                    return (baticApp.app.user && baticApp.app.user.info && baticApp.app.user.info.employee_data && baticApp.app.user.info.employee_data.employee)
                },
                action: () => {
                    $('#newTimesheetModal').modal('show');
                }
            }
        ]
    },
    pageActions: {
        delete(doctype, docname) {
            const me = baticApp.page['timesheet'];
            frappe.confirm(__("Permanently Delete {0}?", [docname]), () => {
                me.$http.post(frappe_api_url('frappe.client.delete'), {
                    doctype: doctype,
                    name: docname
                }).then(response => {
                    frappe.show_alert({message: baticApp.app.__lang("Row has been deleted"), indicator: 'green'});
                    me.$rootScope.pageView.toolbar.refresh()
                });
            });
        }
    },
    init($http, $rootScope, $timeout, toast) {
        this.$http = $http;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.setup_filters();
    },
    setup_filters() {
        this.filters_list = [];
    },
    create_timesheet($event) {
        $event.preventDefault();
        this.form_loading = true;
        const form = $($event.currentTarget);
        const data = {
            start: $('[name="start_session_time"]').val(),
            end: $('[name="end_session_time"]').val(),
            task: $('[name="task"]').val(),
            description: $('[name="description"]').val(),
            user: baticApp.user_session,
            timeZone: baticApp.boot.time_zone?.user || baticApp.boot.time_zone?.system
        }
        this.$http.post(frappe_api_url('batic.cases.page.overview.overview.vue_create_worktime_manual'), data).then((response) => {
            if (response.status === 200) {
                this.form_loading = false;
                frappe.show_alert({message: baticApp.app.__lang("Work Time Created"), indicator: 'green'});
                $('#newTimesheetModal').modal('hide');
                this.$rootScope.pageView.toolbar.refresh();
            } else {
                this.form_loading = false;
            }
        });
    },
    get_data(filters = {}) {
        return this.$http.get(frappe_api_url('batic.cases.page.overview.overview.get_admin_workhistory?page=1&limit=2500'), filters);
    },
}
