/*
* Page View
*/

baticApp.page['annual-calender'] = {
    pageName: 'annual-calender',
    view_type: 'custom',
    filters_list: [],
    filters_required: false,
    $http: undefined,
    $rootScope: undefined,
    pageData: undefined,
    pageActions: {},
    init($http, $rootScope) {
        this.$http = $http;
        this.$rootScope = $rootScope;
        this.setup_filters();
        setTimeout(() => {
            $(document).trigger('run-annual-calender-component');
        }, 500);
    },
    setup_filters() {
        this.filters_list = [];
    },
}
