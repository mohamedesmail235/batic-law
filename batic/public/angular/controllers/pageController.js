/*
 * Page Controller
*/

angular.module('baticNgApp', []).controller("pageController", function ($scope, $rootScope, $http, $timeout, $state, Doctype) {

    let Ctrl = this;
    let widget = $('.card.card-page');

    Ctrl.pageView = (baticApp.page[$scope.$resolve.page]) ? baticApp.page[$scope.$resolve.page] : {};

    $rootScope.pageView = {
        page: $scope.$resolve.page,
        pageLayout: Ctrl.pageView,
        pageData: Ctrl.pageView.pageData,
        pageActions: Ctrl.pageView.pageActions,
        init() {
            Ctrl.pageView.init($http, $rootScope, $timeout);
            widget.addClass('loading');
        },
        get_data(filters = {}, callback = Function()) {
            widget.addClass('loading');
            NProgress.start();
            if (Ctrl.pageView.get_data)
                Ctrl.pageView.get_data(filters).then((response) => {
                    NProgress.done();
                    widget.removeClass('loading');
                    callback(response)
                });
            else {
                NProgress.done();
                widget.removeClass('loading');
            }
        },
        toolbar: {
            refresh() {
                $state.reload();
            },
            filters_list: [],
            filters_data: null,
            buttons: (Ctrl.pageView.toolBarButtons) ? Ctrl.pageView.toolBarButtons() : []
        },
        listView: {
            show_no_data: false
        },
        pageDataColumns() {
            let columns = [];
            console.log('$rootScope.pageView.pageData', $rootScope.pageView.pageData)
            if ($rootScope.pageView.pageData && $rootScope.pageView.pageData.length) {
                for (let column in $rootScope.pageView.pageData[0]) {
                    columns.push({
                        name: column,
                        label: $rootScope.__lang(capitalizeText(column))
                    })
                }
            }
            return columns;
        },
        pagination: {
            currentPage: 0,
            pageSize: 10,
            numberOfPages: function (data) {
                if (data.length) {
                    return Math.ceil(data.length / this.pageSize);
                } else {
                    return 0;
                }
            },
        },
    };

    $rootScope.$watch('pageView.toolbar.filters_data', function (filters) {
        if (Ctrl.pageView?.filters_required) {
            if (filters && Object.keys(filters).length) {
                $rootScope.pageView.get_data(filters, ({status, data: {message}}) => {
                    let dataList = (message && message.data) ? message.data : message;
                    if (Ctrl.pageView.view_type == 'list') {
                        let columns = [];
                        if (dataList && dataList.length) {
                            for (let column in dataList[0]) {
                                columns.push({
                                    id: column,
                                    name: $rootScope.__lang(capitalizeText(column)),
                                    resizable: true,
                                    align: ($rootScope.is_rtl) ? 'right' : 'left',
                                })
                            }
                            runListView(columns, dataList);

                        } else {
                            $rootScope.pageView.listView.show_no_data = true;
                        }
                    } else {
                        $rootScope.pageView.pageData = dataList;
                    }
                });
            }
        } else {
            $rootScope.pageView.get_data(filters, ({status, data: {message}}) => {
                let dataList = (message && message.data) ? message.data : message;
                if (Ctrl.pageView.view_type == 'list') {
                    let columns = [];
                    if (dataList && dataList.length) {
                        for (let column in dataList[0]) {
                            columns.push({
                                id: column,
                                name: $rootScope.__lang(capitalizeText(column)),
                                resizable: true,
                                align: ($rootScope.is_rtl) ? 'right' : 'left',
                            })
                        }
                        runListView(columns, dataList);

                    } else {
                        $rootScope.pageView.listView.show_no_data = true;
                    }
                } else {
                    $rootScope.pageView.pageData = dataList;
                }
            });
        }
    }, true);

    $timeout(() => {
        $rootScope.pageView.toolbar.filters_list = Ctrl.pageView?.filters_list || [];
    }, 500);

    function runListView(columns = [], data = [], tree_report = null) {
        $timeout(function () {
            let report_datatable = new baticApp.DataTable(document.querySelector('.report-datatable'), {
                columns: columns,
                data: (data && data.length) ? data : [],
                pagination: true,
                pageSize: 10,
                layout: 'fluid',
                inlineFilters: true,
                showTotalRow: false,
                serialNoColumn: true,
            });
            $timeout(function () {
                $('.dt-scrollable').each(function () {
                    $(this).css('height', $(this).height() + 6);
                    $(this).css('width', $(this).width() - 10);
                });
            }, 10);
        }, 500);
    }

    $rootScope.fieldLink = function (link, txt = '', callback) {
        Doctype.search_link(link.doctype, link.reference_doctype, link.filters, txt, link.ignore_user_permissions, link.query).then(function (response) {
            callback(response);
        });
    }

    $(document).on('page-refresh', function () {
        $rootScope.pageView.toolbar.refresh();
    })


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
                        <button type="button" class="btn btn-prev btn-outline-secondary waves-effect waves-float" ng-disabled="currentPage == 0"><i class="far fa-angle-left rotate-rtl-right"></i></button>
                        <button type="button" class="btn btn-next btn-outline-secondary waves-effect waves-float" ng-disabled="currentPage >= numberOfPages - 1"><i class="far fa-angle-right rotate-rtl-left"></i></button>
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
}).directive("filterPageField", function ($rootScope, $stateParams) {
    return {
        restrict: 'E',
        templateUrl: load_template('directives.filters-page-field'),
        link: function (scope, element, attrs) {
            scope.$watch('field', function (field) {
                if (field.default_value && $.trim(field.default_value)) {
                    scope.ngModel = field.default_value;
                    setTimeout(() => element.find('input[data-fieldname="' + field.name + '"]').trigger('input change'), 250);
                }
            }, true);
        },
        scope: {
            field: '=',
            fieldType: '=?',
            ngModel: '=ngModel',
            formDataModel: '@',
            sizeSmall: '@',
        }
    }
}).directive("filterPageFieldData", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-data" ng-hide="hideField==true" tooltip="{{ $root.__lang(field.title) }}"> 
                <input type="text" ng-model="ngModel" id="{{field.name}}" data-fieldname="{{field.name}}" data-fieldtype="{{field.type}}" class="form-control" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" placeholder="{{ $root.__lang(field.title) }}">
            </div>
        `,
        link: function (scope, element, attrs) {

        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            sizeSmall: '=',
        }
    }
}).directive("filterPageFieldCheck", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-check" ng-hide="hideField==true"> 
                <div class="form-checkbox" ng-class="(sizeSmall=='true')?'form-checkbox-sm':''">
                    <input type="checkbox" class="child-datatable-select-all" id="select-all-{{field.name}}" data-fieldname="{{field.name}}" data-fieldtype="{{field.type}}" ng-model="ngModel" ng-true-value="1" ng-false-value="0" ng-disabled="field.disabled" ng-required="field.required">
                    <label for="select-all-{{field.name}}"></label>
                </div>
                <label for="select-all-{{field.name}}">{{ $root.__lang(field.title) }}</label>
            </div>
        `,
        link: function (scope, element, attrs) {

        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            sizeSmall: '=',
        }
    }
}).directive("filterPageFieldCurrency", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-currency" ng-hide="hideField==true" tooltip="{{ $root.__lang(field.title) }}"> 
                <div class="input-group form-field-currency" ng-class="(sizeSmall=='true')?'input-group-sm':''">
                    <input type="text" ng-model="ngModel" fcsa-number="{maxDecimals:2,min:0,preventInvalidInput:true}" id="{{field.name}}" data-fieldname="{{field.name}}" data-fieldtype="{{field.type}}" class="form-control font-w-700" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" placeholder="{{ $root.__lang(field.title) }}">
                    <div class="input-group-append">
                        <span class="input-group-text font-w-700">${$rootScope.app.defaults.currency}</span>
                    </div>
                </div>
            </div>
        `,
        link: function (scope, element, attrs) {
            element.on('input', '.form-field-currency > input', function (event) {
                var RE = /^\d*\.?\d{0,2}$/
                const value = $(this).val();
                const [beforeDot, afterDot] = value.split('.');
                const afterDotTrimmed = (afterDot) ? afterDot.slice(0, 2) : '';
                if (!RE.test($(this).val())) {
                    $(this).val(beforeDot + '.' + afterDotTrimmed)
                }
            });
        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            sizeSmall: '=',
        }
    }
}).directive("filterPageFieldFloat", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-currency" ng-hide="hideField==true" tooltip="{{ $root.__lang(field.title) }}"> 
                <input type="text" ng-model="ngModel" fcsa-number="{maxDecimals:2,min:0,preventInvalidInput:true}" id="{{field.name}}" data-fieldname="{{field.name}}" data-fieldtype="{{field.type}}" class="form-control font-w-700" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" placeholder="{{ $root.__lang(field.title) }}">
            </div>
        `,
        link: function (scope, element, attrs) {
            element.on('input', '.form-field-currency > input', function (event) {
                var RE = /^\d*\.?\d{0,2}$/
                const value = $(this).val();
                const [beforeDot, afterDot] = value.split('.');
                const afterDotTrimmed = (afterDot) ? afterDot.slice(0, 2) : '';
                if (!RE.test($(this).val())) {
                    $(this).val(beforeDot + '.' + afterDotTrimmed)
                }
            });
        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            sizeSmall: '=',
        }
    }
}).directive("filterPageFieldDate", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
             <div class="form-field-date" ng-hide="hideField==true" tooltip="{{ $root.__lang(field.title) }}"> 
                <div class="input-group" ng-class="(sizeSmall=='true')?'input-group-sm':''">
                    <span class="input-group-text"><i class="fal fa-calendar-alt"></i></span>
                    <input type="text" ng-model="ngModel" data-toggle="datepicker" id="{{field.name}}" data-fieldname="{{field.name}}" data-fieldtype="{{field.type}}" class="form-control" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" placeholder="{{ $root.__lang(field.title) }}">
                </div>
            </div>
        `,
        link: function (scope, element, attrs) {

        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            sizeSmall: '=',
        }
    }
}).directive("filterPageFieldTime", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
             <div class="form-field-date" ng-hide="hideField==true" tooltip="{{ $root.__lang(field.title) }}"> 
                <div class="input-group" ng-class="(sizeSmall=='true')?'input-group-sm':''">
                    <span class="input-group-text"><i class="fal fa-clock"></i></span>
                    <input type="text" ng-model="ngModel" data-toggle="timepicker" id="{{field.name}}" data-fieldname="{{field.name}}" data-fieldtype="{{field.type}}" class="form-control" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" placeholder="{{ $root.__lang(field.title) }}">
                </div>
            </div>
        `,
        link: function (scope, element, attrs) {

        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            sizeSmall: '=',
        }
    }
}).directive("filterPageFieldLink", function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-link dropdown" ng-hide="hideField==true" data-doctype="{{field.options}}" data-reference_doctype="${$rootScope.pageView.doctype}" tooltip="{{ $root.__lang(field.title) }}"> 
                <input type="text" ng-model="ngModel" id="{{field.name}}" data-fieldname="{{field.name}}" data-fieldtype="{{field.type}}" class="form-control" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" placeholder="{{ $root.__lang(field.title) }}" autocomplete="off">
                <div class="dropdown-menu show animated fadeIn faster" style="max-height:280px;overflow-y:auto;overflow-x:hidden;transform:scale(1, 1)" ng-show="linkShowMenu"> 
                    <button type="button" class="dropdown-item w-100" ng-repeat="item in linkResult">
                        <span class="d-block w-100 font-w-700" style="overflow:hidden;text-overflow:ellipsis;">{{item.value}}</span>
                        <small class="d-block w-100 font-w-500 font-s-12" style="overflow:hidden;text-overflow:ellipsis;" ng-if="item.description.length"> {{item.description}}</small>
                    </button>
                    <span class="d-block w-100 pt-1 pb-1 text-center text-secondary" ng-if="!linkResult.length && !linkIsLoading">${baticApp.app.__lang('No Data Found')}</span>
                </div>
            </div>
        `,
        link: function (scope, element, attrs) {
            let link;
            element.on('focus', '.form-field-link > input', function () {
                link = {}
                link['doctype'] = element.find('.form-field-link').attr('data-doctype');
                link['reference_doctype'] = element.find('.form-field-link').attr('data-reference_doctype');
                link['ignore_user_permissions'] = (element.find('.form-field-link').attr('data-ignore_user_permissions')) ? element.find('.form-field-link').attr('data-ignore_user_permissions') : 0;
                if (element.find('.form-field-link').attr('data-filters')) {
                    link['filters'] = element.find('.form-field-link').attr('data-filters');
                }
                if (element.find('.form-field-link').attr('data-query')) {
                    link['query'] = element.find('.form-field-link').attr('data-query');
                }
                $timeout(() => {
                    scope.linkIsLoading = true;
                    scope.linkShowMenu = true;
                    element.find('.dropdown-menu').width(element.find('.form-field-link > input').width() + 30);
                }, 100);
                scope.$root.fieldLink(link, scope.ngModel, function (response) {
                    scope.linkResult = response.data.message;
                    scope.linkIsLoading = false;
                });
            });
            element.on('input', '.form-field-link > input', function () {
                let data = element.find('.form-field-link').data();
                link = {}
                link['doctype'] = element.find('.form-field-link').attr('data-doctype');
                link['reference_doctype'] = element.find('.form-field-link').attr('data-reference_doctype');
                link['ignore_user_permissions'] = (element.find('.form-field-link').attr('data-ignore_user_permissions')) ? element.find('.form-field-link').attr('data-ignore_user_permissions') : 0;
                if (element.find('.form-field-link').attr('data-filters')) {
                    link['filters'] = element.find('.form-field-link').attr('data-filters');
                }
                if (element.find('.form-field-link').attr('data-query')) {
                    link['query'] = element.find('.form-field-link').attr('data-query');
                }
                scope.$root.fieldLink(link, scope.ngModel, function (response) {
                    scope.linkResult = response.data.message;
                    scope.linkIsLoading = false;
                });
            });
            element.on('blur', '.form-field-link > input', function () {
                $timeout(() => {
                    scope.linkShowMenu = false;
                    if (scope.linkResult) {
                        let link_exist = scope.linkResult.filter(link => link.value == element.find('.form-field-link > input').val())[0];
                        if (!link_exist) {
                            if (element.find('.form-field-link > input').val()) {
                                element.find('.form-field-link > input').val('').trigger('input');
                                element.find('.form-field-link > input').trigger('field-link-blur');
                            }
                            scope.linkIsLoading = false;
                        }
                    }
                }, 150);
            });
            element.on('click', '.dropdown-menu > button.dropdown-item', function () {
                element.find('.form-field-link > input').val($('span', this).text()).trigger('input');
                element.find('.form-field-link > input').trigger('field-link-blur');
                scope.linkIsLoading = false;
                scope.linkShowMenu = false;
            });
        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            linkResult: '@',
            linkIsLoading: '@',
            linkShowMenu: '@',
            hideField: '=',
            hideLabel: '=',
            sizeSmall: '=',
        }
    }
}).directive("filterPageFieldSelect", function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-select" ng-hide="hideField==true" tooltip="{{ $root.__lang(field.title) }}"> 
               <select class="form-select chosen-select" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-model="ngModel" id="{{field.name}}" data-fieldname="{{field.name}}" data-fieldtype="{{field.type}}"> 
                    <option value="" hidden selected default class="text-secondary">{{ $root.__lang(field.title) }}</option>
                    <option></option>
                    <option ng-repeat="option in selectOptions" ng-if="option" value="{{option}}">{{ $root.__lang(option) }}</option>
               </select>
            </div>
        `,
        link: function (scope, element, attrs) {
            let options = [];
            scope.ngModel = "";
            if (scope.field && scope.field.options && scope.field.options.length) {
                options = $rootScope.splitLines(scope.field.options);
            }
            scope.selectOptions = options;
        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            selectOptions: '@',
            sizeSmall: '=',
        }
    }
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
                        <button type="button" class="btn btn-prev btn-outline-secondary waves-effect waves-float" ng-disabled="currentPage == 0"><i class="far fa-angle-left rotate-rtl-right"></i></button>
                        <button type="button" class="btn btn-next btn-outline-secondary waves-effect waves-float" ng-disabled="currentPage >= numberOfPages - 1"><i class="far fa-angle-right rotate-rtl-left"></i></button>
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
