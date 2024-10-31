/*
* Page View
*/

baticApp.page['vacation-request'] = {
    pageName: 'vacation-request',
    view_type: 'custom',
    filters_list: [],
    filters_required: false,
    $http: undefined,
    $rootScope: undefined,
    $timeout: undefined,
    pageData: undefined,
    active_tab: 'request_list',
    toolBarButtons: () => {
        const me = baticApp.page['vacation-request'];
        return [
            {
                label: __("New Vacation Request"),
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
            const me = baticApp.page['vacation-request'];
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
    table_actions: {
        accept(row) {
            const me = baticApp.page['vacation-request'];
            frappe.confirm(__("Approve vacation for {0}?", [row.employee]), () => {
                console.log(row)
                me.$http.post(frappe_api_url('batic.cases.page.overview.overview.vacation_request_change_status'), {
                    docname: row.name,
                    status: "Approved"
                }).then(response => {
                    frappe.show_alert({message: baticApp.app.__lang("vacation has been approved"), indicator: 'green'});
                    me.$rootScope.pageView.toolbar.refresh()
                });
            });
        },
        decline(row) {
            const me = baticApp.page['vacation-request'];
            frappe.confirm(__("Reject vacation for {0}?", [row.employee]), () => {
                console.log(row)
                me.$http.post(frappe_api_url('batic.cases.page.overview.overview.vacation_request_change_status'), {
                    docname: row.name,
                    status: "Rejected"
                }).then(response => {
                    frappe.show_alert({message: baticApp.app.__lang("vacation has been rejected"), indicator: 'orange'});
                    me.$rootScope.pageView.toolbar.refresh()
                });
            });
        },
    },
    change_tab(tab) {
        this.$timeout(() => {
            this.$rootScope.pageView.pageLayout.active_tab = tab;
        }, 10);
    },
    template() {
        if ((baticApp.app.user && baticApp.app.user.info && baticApp.app.user.info.employee_data && baticApp.app.user.info.employee_data.employee))
            return 'vacation-request';
        else
            return 'vacation-request-admin';
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
    create_vacation($event) {
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
        if (baticApp.app.user.info.employee_data && baticApp.app.user.info.employee_data.employee)
            return this.$http.get(frappe_api_url('batic.cases.page.overview.overview.vacation_status?employee_id=' + baticApp.app.user.info.employee_data.employee), filters);
        else
            return this.$http.get(frappe_api_url('batic.cases.page.overview.overview.vacation_request'), filters);
    },
}
