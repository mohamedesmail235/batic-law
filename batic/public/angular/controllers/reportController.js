/*
 *  Report Controller
 */

angular.module('baticNgApp', ['angularjs-dropdown-multiselect']).controller("reportController", function ($scope, $rootScope, $http, $state, $timeout, $localStorage, Doctype) {

    let Ctrl = this;
    let widget = $('.card.card-page');

    frappe.query_reports = [];

    $rootScope.reports_has_generate = ['Stock Balance'];

    $scope.reportView = {
        workspace: $scope.$resolve.workspace,
        report_name: $scope.$resolve.report_name,
        loading_doctype: false,
        loading_table: false,
        show_no_data: false,
        report: {
            data: ($scope.$resolve.api.get_report && $scope.$resolve.api.get_report.data && $scope.$resolve.api.get_report.data.message && $scope.$resolve.api.get_report.data.message[0]) ? $scope.$resolve.api.get_report.data.message[0] : {},
            filters: {},
            filters_list: [],
            filters_data: {},
            table: {},
            print_data: {
                filters: {},
                columns: {},
                data: [],
            }
        },
        toolbar: {
            refresh: function () {
                NProgress.start();
                $state.reload();
            },
            export: function () {
                $scope.reportView.make_access_log('Export', 'CSV');
                const column_row = $scope.reportView.report.print_data.columns.reduce((acc, col) => {
                    acc.push(col.name);
                    return acc;
                }, []);
                const data = $scope.reportView.get_data_for_csv(false);
                const out = [column_row].concat(data);
                frappe.tools.downloadify(out, null, $scope.$resolve.report_name);
            },
            print: function () {
                delete $rootScope.$storage.print_report;
                delete $localStorage.print_report;
                $rootScope.$storage = $localStorage.$default({
                    print_report: {}
                });
                $timeout(() => {
                    $rootScope.$storage.print_report = {
                        name: $scope.$resolve.report_name,
                        filters: $scope.reportView.report.print_data.filters,
                        columns: $scope.reportView.report.print_data.columns,
                        data: $scope.reportView.report.print_data.data,
                    };
                    $rootScope.$storage.user_data = $rootScope.app.user
                    $rootScope.$storage.baticApp_app_defaults = baticApp.app.defaults;
                    $rootScope.$storage.boot__messages = frappe.boot.__messages;
                }, 100);
                $timeout(() => {
                    window.open(`/reports/print?report_name=${$scope.$resolve.report_name}`, '_blank').focus();
                }, 500);
            },
            generate: function () {
                NProgress.start();
                Doctype.query_report_background($scope.$resolve.report_name, JSON.stringify($scope.reportView.report.print_data.filters)).then(function (response) {
                    $state.reload();
                });
            }
        },
        get_doctype: function (callback) {
            Doctype.get_doctype($scope.reportView.report.data.ref_doctype).then(callback);
        },
        get_report_filters: function (report_name) {
            return new Promise((resolve, reject) => {
                frappe.xcall('frappe.desk.query_report.get_script', {
                    report_name: report_name
                }).then(settings => {
                    frappe.dom.eval(settings.script || '');
                    frappe.after_ajax(() => {
                        resolve();
                    });
                }).catch(reject);
            });
        },
        make_access_log(method, file_format) {
            frappe.call("frappe.core.doctype.access_log.access_log.make_access_log", {
                doctype: $scope.reportView.report.data.ref_doctype || '',
                report_name: $scope.$resolve.report_name,
                filters: $scope.reportView.report.print_data.filters,
                file_type: file_format,
                method: method
            });
        },
        get_data_for_csv(include_indentation) {
            const rows = $scope.reportView.report.table.bodyRenderer.visibleRows;
            rows.push($scope.reportView.report.table.bodyRenderer.getTotalRow());
            return rows.map(row => {
                const standard_column_count = $scope.reportView.report.table.datamanager.getStandardColumnCount();
                return row.slice(standard_column_count).map((cell, i) => {
                    if (cell.column.fieldtype === "Duration") {
                        cell.content = frappe.utils.get_formatted_duration(cell.content);
                    }
                    if (include_indentation && i === 0) {
                        cell.content = '   '.repeat(row.meta.indent) + (cell.content || '');
                    }
                    return cell.content || '';
                });
            });
        }
    };

    // try {
    //     eval($scope.reportView.report.script);
    // } catch (e) {
    //     if (e instanceof SyntaxError) {
    //         console.error('reportView.report.script', e.message);
    //     }
    // }

    $scope.reportView.get_doctype(function (response) {
        console.log('$scope.reportView.get_doctype', response);
    });


    $scope.reportView.get_report_filters($scope.reportView.report_name).then(() => {
        $timeout(() => {
            let report_name = decodeURI($scope.$resolve.report_name);
            if (report_name && frappe.query_reports[report_name] && frappe.query_reports[report_name].filters && frappe.query_reports[report_name].filters.length) {
                frappe.query_reports[report_name].filters.map(filter => {
                    if (filter.hidden != 1 && filter.fieldtype != 'Break') {
                        let field = {};
                        field['name'] = filter.fieldname;
                        field['title'] = filter.label;
                        field['type'] = filter.fieldtype;
                        field['options'] = filter.options;
                        field['default_value'] = filter.default;
                        if (filter.get_data) {
                            field['get_data'] = filter.get_data;
                        }
                        if (filter.fieldtype == 'Link') {
                            field['link'] = {
                                txt: '',
                                doctype: filter.options,
                                reference_doctype: $scope.reportView.report.data.ref_doctype,
                                filters: {}
                            }
                        }
                        $scope.reportView.report.filters_list.push(field);
                    }

                    if (filter.reqd || filter.default) {
                        $scope.reportView.report.filters[filter.fieldname] = (Array.isArray(filter.default)) ? filter.default[0] : filter.default;
                    }
                });
                frappe.query_report['filters'] = frappe.query_reports[report_name].filters;
            }
        }, 500);
    });

    $rootScope.fieldLink = function (link, txt = '', callback) {
        Doctype.search_link(link.doctype, link.reference_doctype, link.filters, txt, link.ignore_user_permissions, link.query).then(function (response) {
            callback(response);
        });
    }

    $scope.$watch('reportView.report.filters_data', function (filters) {
        $scope.reportView.report.print_data.filters = _prepare_filters(filters);
        widget.addClass('loading');
        if (Object.keys(filters).length) {
            Doctype.get_report_data($scope.$resolve.report_name, _prepare_filters(filters)).then(function (response) {
                widget.removeClass('loading');
                _run_report(response);
            }, function (error) {
                widget.removeClass('loading');
                console.error(error)
                if (error.status == 417 || error.status == 409 || error.status == 404) {
                    frappe.msgprint((new Function('return ' + JSON.parse(error.data._server_messages)))());
                } else if (error.status == 500) {
                    frappe.msgprint({message: error.data.exception, title: baticApp.app.__lang('Validation Errors'), indicator: 'red'});
                }
            });
        }
    }, true);


    function _run_report(response) {
        let columns = [];
        let data = [];
        if (response && response.data && response.data.message && response.data.message.result)
            data = response.data.message.result.filter(e => Object.values(e).join("") != 0)
        let tree_report = data.some(d => 'indent' in d);
        if (response && response.data && response.data.message.columns && response.data.message.columns.length) {
            response.data.message.columns.map(col => {
                let column = {}
                column['id'] = col.fieldname;
                column['name'] = col.label;
                column['type'] = (col.fieldtype) ? col.fieldtype : 'Data';
                if (col.width)
                    column['width'] = col.width;

                if (col.fieldtype == 'Float')
                    column['format'] = (value, row, column, data) => {
                        if (!data.parent_account && tree_report) {
                            return (value) ? `<b style="font-weight:700;">${numberWithCommas(parseFloat(value))}</b>` : '<b style="font-weight:700;">' + parseFloat(0) + '</b>';
                        } else {
                            return (value) ? numberWithCommas(parseFloat(value)) : parseFloat(0);
                        }
                    };
                else if (col.fieldtype == 'Currency')
                    column['format'] = (value, row, column, data) => {
                        if (!data.parent_account && tree_report) {
                            return (value) ? '<b style="font-weight:700;">' + numberWithCommas(parseFloat(value).toFixed(2)) + ' ' + __(baticApp.app.defaults.currency) + '</b>' : '<b style="font-weight:700;">' + parseFloat(0).toFixed(2) + ' ' + __(baticApp.app.defaults.currency) + '</b>';
                        } else {
                            return (value) ? numberWithCommas(parseFloat(value).toFixed(2)) + ' ' + __(baticApp.app.defaults.currency) : parseFloat(0).toFixed(2) + ' ' + __(baticApp.app.defaults.currency);
                        }
                    };
                else
                    column['format'] = (value, row, column, data) => {
                        if (value && value.length) {
                            if (value[0] == "'" && value[value.length - 1] == "'")
                                return value.replace(/'([^']+)'/g, '<b style="font-weight:700">$1</b>')
                            if (!data.parent_account && tree_report) {
                                return `<b style="font-weight:700;">${value}</b>`
                            }
                            return value
                        } else {
                            return ''
                        }
                    };

                if (!col.hidden || col.hidden != 1)
                    columns.push(column);
            });
        }
        $scope.reportView.report.print_data.data = (data && data.length) ? data : [];
        $scope.reportView.report.print_data.columns = columns;
        if (data && data.length) {
            $scope.reportView.show_no_data = false;
            $timeout(function () {
                let report_datatable = new baticApp.DataTable(document.querySelector('.report-datatable'), {
                    columns: columns,
                    data: (data && data.length) ? data : [],
                    layout: 'fixed',
                    inlineFilters: true,
                    treeView: tree_report,
                });
                $scope.reportView.report.table = report_datatable;
                // const visible_column_ids = report_datatable.datamanager.getColumns(true).map(col => col.id);
                // console.log('visible_column_ids', visible_column_ids.map(id => columns.find(col => col.id === id)).filter(Boolean))
            }, 500);
        } else {
            $scope.reportView.show_no_data = true;
        }
    }

    function _prepare_filters(filters) {
        let filters_obj = {};
        angular.forEach(filters, function (value, index) {
            if (Array.isArray(value)) {
                let array_values = [];
                value.map(v => {
                    if (v.id)
                        array_values.push(v.id);
                    else
                        array_values = v
                });
                filters_obj[index] = array_values;
            } else {
                filters_obj[index] = value;
            }
        });
        return filters_obj;
    }

    function uniqByKeepFirst(a, key) {
        let seen = new Set();
        return a.filter(item => {
            let k = key(item);
            return seen.has(k) ? false : seen.add(k);
        });
    }

    function numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

}).directive("reportFilterFormField", function ($rootScope, $stateParams) {
    return {
        restrict: 'E',
        templateUrl: load_template('directives.report-filters-form-field'),
        link: function (scope, element, attrs) {
            scope.$watch('field', function (field) {
                if (field.default_value && $.trim(field.default_value)) {
                    scope.ngModel = field.default_value;
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
}).directive("reportFilterFieldData", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-data" ng-hide="hideField==true" tooltip="{{ field.title }}"> 
                <input type="text" ng-model="ngModel" id="{{field.name}}" data-fieldname="{{field.name}}" class="form-control" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" placeholder="{{ field.title }}">
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
}).directive("reportFilterFieldCheck", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-check" ng-hide="hideField==true"> 
                <div class="form-checkbox" ng-class="(sizeSmall=='true')?'form-checkbox-sm':''">
                    <input type="checkbox" class="child-datatable-select-all" id="select-all-{{field.name}}" ng-model="ngModel" ng-true-value="1" ng-false-value="0" ng-disabled="field.disabled" ng-required="field.required">
                    <label for="select-all-{{field.name}}"></label>
                </div>
                <label for="select-all-{{field.name}}">{{ field.title }}</label>
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
}).directive("reportFilterFieldCurrency", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-currency" ng-hide="hideField==true" tooltip="{{ field.title }}"> 
                <div class="input-group form-field-currency" ng-class="(sizeSmall=='true')?'input-group-sm':''">
                    <input type="text" ng-model="ngModel" fcsa-number="{maxDecimals:2,min:0,preventInvalidInput:true}" id="{{field.name}}" data-fieldname="{{field.name}}" class="form-control font-w-700" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" placeholder="{{ field.title }}">
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
}).directive("reportFilterFieldFloat", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-currency" ng-hide="hideField==true" tooltip="{{ field.title }}"> 
                <input type="text" ng-model="ngModel" fcsa-number="{maxDecimals:2,min:0,preventInvalidInput:true}" id="{{field.name}}" data-fieldname="{{field.name}}" class="form-control font-w-700" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" placeholder="{{ field.title }}">
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
}).directive("reportFilterFieldDate", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
             <div class="form-field-date" ng-hide="hideField==true" tooltip="{{ field.title }}"> 
                <div class="input-group" ng-class="(sizeSmall=='true')?'input-group-sm':''">
                    <span class="input-group-text"><i class="fal fa-calendar-alt"></i></span>
                    <input type="text" ng-model="ngModel" data-toggle="datepicker" id="{{field.name}}" data-fieldname="{{field.name}}" class="form-control" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" placeholder="{{ field.title }}">
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
}).directive("reportFilterFieldTime", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
             <div class="form-field-date" ng-hide="hideField==true" tooltip="{{ field.title }}"> 
                <div class="input-group" ng-class="(sizeSmall=='true')?'input-group-sm':''">
                    <span class="input-group-text"><i class="fal fa-clock-o"></i></span>
                    <input type="text" ng-model="ngModel" data-toggle="timepicker" id="{{field.name}}" data-fieldname="{{field.name}}" class="form-control" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" placeholder="{{ field.title }}">
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
}).directive("reportFilterFieldLink", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-link dropdown" ng-hide="hideField==true" data-doctype="{{field.link.doctype}}" data-reference_doctype="{{field.link.reference_doctype}}" data-filters="{{field.link.filters}}" data-ignore_user_permissions="{{field.link.ignore_user_permissions}}" data-query="{{field.link.query}}" tooltip="{{ field.title }}"> 
                <input type="text" ng-model="ngModel" id="{{field.name}}" data-fieldname="{{field.name}}" class="form-control" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" placeholder="{{ field.title }}">
                <div class="dropdown-menu animated fadeIn faster" style="max-height:280px;transform:scale(1, 1);"> 
                    <button type="button" class="dropdown-item dropdown-item-link w-100" ng-repeat="item in linkResult">
                    <span class="font-w-700">{{item.value}}</span>
                    <small class="d-block font-s-12" ng-if="item.description.length"> {{item.description}}</small>
                    </button>
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
                element.find('.dropdown-menu').width(element.find('.form-field-link > input').width() + 20).show();
                scope.$root.fieldLink(link, scope.ngModel, function (response) {
                    scope.linkResult = response.data.results;
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
                    scope.linkResult = response.data.results;
                });
            });
            element.on('blur', '.form-field-link > input', function () {
                setTimeout(() => {
                    element.find('.dropdown-menu').hide();
                    let link_exist = scope.linkResult.filter(link => link.value == element.find('.form-field-link > input').val())[0];
                    if (!link_exist) {
                        element.find('.form-field-link > input').val('').trigger('input').trigger('change');
                    }
                }, 150);
            });
            element.on('click', '.dropdown-menu > button.dropdown-item', function () {
                element.find('.form-field-link > input').val($('span', this).text()).trigger('input').trigger('change');
            });
        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            linkResult: '@',
            hideField: '=',
            hideLabel: '=',
            sizeSmall: '=',
        }
    }
}).directive("reportFilterFieldSelect", function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-select" ng-hide="hideField==true" tooltip="{{ field.title }}"> 
               <select class="form-select chosen-select" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-model="ngModel" id="{{field.name}}" data-fieldname="{{field.name}}"> 
                   <option ng-repeat="option in selectOptions" value="{{(option.label)?option.label:option}}">{{(option.label)?option.label:option}}</option>
               </select>
            </div>
        `,
        link: function (scope, element, attrs) {
            let options = [];
            if (scope.field && scope.field.options && scope.field.options.length) {
                options = scope.field.options;
            }
            scope.selectOptions = options;
        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            selectOptions: '@',
            hideField: '=',
            hideLabel: '=',
            sizeSmall: '=',
        }
    }
}).directive("reportFilterFieldMultiSelect", function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-multi-select" ng-hide="hideField==true" tooltip="{{ field.title }}"> 
              <div ng-dropdown-multiselect options="selectOptions" selected-model="ngModel" extra-settings="{enableSearch: true,displayProp: 'value', idProp: 'value'}" translation-texts="{buttonDefaultText:'${$rootScope.__lang('Select')} '+field.title}"></div>
            <!--              <input type="text" ng-model="ngModel" id="{{field.name}}" data-fieldname="{{field.name}}" class="form-control" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" placeholder="{{ field.title }}">-->
            </div>
        `,
        link: function (scope, element, attrs) {
            scope.ngModel = [];
            scope.selectOptions = [];
            element.on('click', '.form-field-multi-select .dropdown-multiselect > .btn', function (event) {
                let txt = $('.form-field-multi-select .dropdown-header > input.searchField').val()
                event.preventDefault();
                scope.selectOptions = [];
                scope.field.get_data(txt).then(function (response) {
                    $timeout(function () {
                        if (response.length) {
                            response.map(item => {
                                scope.selectOptions.push(item)
                            });
                        }
                    }, 10);
                });
            });
            element.on('input', '.form-field-multi-select .dropdown-header > input.searchField', function () {
                let txt = $(this).val()
                if (txt.length >= 1) {
                    scope.field.get_data(txt).then(function (response) {
                        scope.selectOptions = [];
                        $timeout(function () {
                            if (response.length) {
                                response.map(item => {
                                    scope.selectOptions.push(item)
                                });
                            }
                        }, 10);
                    });
                } else {
                    scope.field.get_data().then(function (response) {
                        scope.selectOptions = [];
                        $timeout(function () {
                            if (response.length) {
                                response.map(item => {
                                    scope.selectOptions.push(item)
                                });
                            }
                        }, 10);
                    });
                }
            });
        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            selectOptions: '@',
            selectedModel: '@',
            hideField: '=',
            hideLabel: '=',
            sizeSmall: '=',
        }
    }
});

// ✅ Promise check
function isPromise(p) {
    if (typeof p === 'object' && typeof p.then === 'function') {
        return true;
    }
    return false;
}

// ✅ Check if return value is promise
function returnsPromise(f) {
    if (f.constructor.name === 'AsyncFunction' || (typeof f === 'function' && isPromise(f()))) {
        // console.log('✅ Function returns promise');
        return true;
    }
}
