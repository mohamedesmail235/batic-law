/*
* Page View
*/

baticApp.page['top-employee'] = {
    pageName: 'top-employee',
    view_type: 'list',
    filters_list: [],
    filters_required: true,
    $http: undefined,
    init($http) {
        this.$http = $http;
        this.setup_filters();
    },
    setup_filters() {
        this.filters_list = [
            {
                name: 'start',
                type: 'Date',
                title: 'Start Date',
                default_value: moment().subtract(30, 'days').format('YYYY-MM-DD')
            },
            {
                name: 'end',
                type: 'Date',
                title: 'End Date',
                default_value: moment().format('YYYY-MM-DD')
            }
        ];
    },
    get_data(filters = {}) {
        return this.$http.post(frappe_api_url('batic.cases.page.overview.overview.top_employee'), filters);
    }
}
