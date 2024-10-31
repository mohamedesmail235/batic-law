/*
 * Dashboard Controller
*/

angular.module('baticNgApp', []).controller("dashboardController", function ($scope, $rootScope, $http, $timeout, Doctype) {

    let Ctrl = this;

    Ctrl.Charts = {};

    Ctrl.api_counts = ($scope.$resolve.api && $scope.$resolve.api.counts && $scope.$resolve.api.counts.data && $scope.$resolve.api.counts.data.message && $scope.$resolve.api.counts.data.message[0]) ? $scope.$resolve.api.counts.data.message[0] : {
        total_customer: 0,
        total_satisfied: 0,
        total_success_cases: 0,
        total_quotation_request: 0,
        total_new_customer: 0
    };

    Ctrl.chart_data = ($scope.$resolve.api && $scope.$resolve.api.chart_data && $scope.$resolve.api.chart_data.data && $scope.$resolve.api.chart_data.data.message) ? $scope.$resolve.api.chart_data.data.message : {}
    Ctrl.activity_log = ($scope.$resolve.api && $scope.$resolve.api.activity_log && $scope.$resolve.api.activity_log.data && $scope.$resolve.api.activity_log.data.message) ? $scope.$resolve.api.activity_log.data.message : {}


    $rootScope.dashboard = {
        todo_list: [],
        admin: {
            counts: Ctrl.api_counts,
            activity_log: Ctrl.activity_log?.data,
            recent_customers: [],
            head_lawyer_dashboard_case_decided: [],
        },
        employee: {},
        template() {
            if ($rootScope.app.user.info && $rootScope.app.user.info.employee_data && $rootScope.app.user.info.employee_data.name) {
                return 'dashboard-employee'
            } else {
                return 'dashboard-admin'
            }
        },
        pagination: {
            currentPage: 0,
            pageSize: 6,
            numberOfPages: function (data) {
                if (data.length) {
                    return Math.ceil(data.length / this.pageSize);
                } else {
                    return 0;
                }
            },
        },
        get_recent_customers() {
            Doctype.get_api('batic.cases.page.overview.overview.get_recent_customers?limit=6').then((response) => {
                if (response.status === 200) {
                    const {data: {message}} = response;
                    this.admin.recent_customers = message;
                }
            });
        },
        get_head_lawyer_dashboard_case_decided() {
            Doctype.get_api('batic.cases.page.overview.overview.head_lawyer_dashboard_case_decided?page=1&limit=100').then((response) => {
                if (response.status === 200) {
                    const {data: {message: {data}}} = response;
                    this.admin.head_lawyer_dashboard_case_decided = data;
                }
            });
        },
        get_todo_list() {
            Doctype.get_api('batic.cases.page.overview.overview.get_todo_list?page=1&limit=10&filters={"owner":' + frappe.session.user + '}').then((response) => {
                if (response.status === 200) {
                    const {data: {message: {data}}} = response;
                    this.todo_list = data;
                    console.log('this.todo_list', this.todo_list)
                }
            });
        },
    };

    $timeout(() => {
        // baticApp.dashboard.init();
        $rootScope.dashboard.get_recent_customers();
        $rootScope.dashboard.get_head_lawyer_dashboard_case_decided();
        // $rootScope.dashboard.get_todo_list();
        if (feather) {
            feather.replace({
                width: 14,
                height: 14
            });
        }
        if ($('#cases-updates-chart').length) {
            cases_updates_chart();
        }
    }, 500);

    function cases_updates_chart() {
        const options = {
            series: [{
                name: $rootScope.__lang('Cases'),
                data: Ctrl.chart_data['y-axis']
            }],
            chart: {
                height: 405,
                type: 'line',
                zoom: {
                    enabled: false
                },
                toolbar: {
                    tools: {
                        download: false,
                    }
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight'
            },
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.5
                },
            },
            xaxis: {
                categories: Ctrl.chart_data['x-axis-v2'],
            }
        };
        const chart = new ApexCharts(document.querySelector("#cases-updates-chart"), options);
        chart.render();
    }

}).filter('htmlFilter', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    };
}).directive("listPagination", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
         <div class="table-list-pagination" ng-class="className">
            <div class="row row-sm margin-sm-0">
                <div class="col-6 text-start">
                    <div class="btn-group btn-group-toggle" data-toggle="buttons">
                        <label ng-repeat="count in pageSizeList" class="btn btn-page-count btn-outline-secondary waves-effect waves-float" data-page-count="{{count}}" ng-class="(pageSize==count)?'active':''" ng-disabled="numberOfPages<=count">
                            <input type="radio" class="btn-check" name="per_page_count" ng-value="{{count}}" ng-disabled="numberOfPages<=count">{{count}}
                        </label>
                    </div>
                </div>
                <div class="col-6 text-end">
                    <span class="text-secondary">
                        <span class="hide-on-mobile">${$rootScope.__lang('Showing')} {{(currentPage==0)?'1':(currentPage*pageSize)+1}} ${$rootScope.__lang('to')} {{(currentPage<(numberOfPages - 1))?pageSize*(currentPage+1):totalCount}} ${$rootScope.__lang('of')}</span>
                        <span class="hide-on-mobile">{{totalCount}} ${$rootScope.__lang('Rows')}</span>
                        <span class="show-on-mobile">{{totalCount}} ${$rootScope.__lang('Rows')}</span>
                     </span>
                    <div class="d-inline-block ml-2">
                        <button type="button" class="btn btn-sm btn-prev btn-outline-secondary waves-effect waves-float" ng-disabled="currentPage == 0"><i class="far fa-angle-left rotate-rtl-right"></i></button>
                        <button type="button" class="btn btn-sm btn-next btn-outline-secondary waves-effect waves-float" ng-disabled="currentPage >= numberOfPages - 1"><i class="far fa-angle-right rotate-rtl-left"></i></button>
                    </div>
                </div>
            </div>
        </div>
        `,
        link: function (scope, element, attrs) {
            element.on('click', '.btn.btn-next', function (event) {
                event.preventDefault();
                scope.currentPage = scope.currentPage + 1;
                scope.$apply();
            });
            element.on('click', '.btn.btn-prev', function (event) {
                event.preventDefault();
                scope.currentPage = scope.currentPage - 1;
                scope.$apply();
            });
            element.on('click', '.btn.btn-page-count', function (event) {
                event.preventDefault();
                if ($('input', event.currentTarget).is(":not(:disabled)")) {
                    scope.pageSize = angular.element('input', event.currentTarget)[0].value;
                    scope.currentPage = 0;
                }
                scope.$apply();
            });
            setTimeout(() => {
                if (!element.find('.btn.btn-page-count.active').length)
                    element.find('.btn.btn-page-count[data-page-count="' + scope.pageSize + '"]').trigger('click');
            }, 500)
        },
        scope: {
            className: '@',
            currentPage: '=',
            pageSize: '=',
            totalCount: '=',
            numberOfPages: '=',
            pageSizeList: '=',
        }
    };
});
