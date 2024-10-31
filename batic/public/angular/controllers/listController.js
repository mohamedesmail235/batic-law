/*
 *  List Controller
 */

angular.module('baticNgApp', []).controller("listController", function ($scope, $rootScope, $http, $state, $stateParams, $timeout, Doctype) {

    let Ctrl = this;
    let widget = $('.card.card-page');

    Ctrl.listView = undefined; //baticApp.list_view[$scope.$resolve.doctype];

    Ctrl.doctypes = ($scope.$resolve.api.doctype && $scope.$resolve.api.doctype.data) ? $scope.$resolve.api.doctype.data : {};
    // console.log('Ctrl.doctypes', Ctrl.doctypes)
    if (Ctrl.doctypes && Ctrl.doctypes.docs) {
        locals["DocType"] = null;
        let docs_list = {};
        const output = Ctrl.doctypes.docs.reduce((acc, curr) => {
            acc[curr.name] = curr;
            return acc;
        }, {});
        locals["DocType"] = output || {};
    }
    Ctrl.doctype_name = capitalizeText($scope.$resolve.doctype.replace(/-/g, ' '));
    Ctrl.doctype_data = Ctrl.doctypes.docs.filter(doc => doc.name == Ctrl.doctype_name)[0];
    $rootScope.docs = Ctrl.doctypes.docs;
    Ctrl.standard_filters = Ctrl.doctype_data.fields.filter(field => field.in_standard_filter == 1).map(f => {
        return {
            id: f.name,
            name: f.fieldname,
            type: f.fieldtype,
            title: f.label,
            options: f.options
        }
    });

    // console.log('Ctrl.standard_filters', Ctrl.standard_filters)

    Ctrl.list_fields = Ctrl.doctype_data.fields.filter(field => field.in_list_view == 1).map(f => f.fieldname);

    if (!Ctrl.listView)
        Ctrl.listView = doctypeListView($scope.$resolve.doctype);

    $rootScope.listView = {
        workspace: $scope.$resolve.workspace,
        doctype: $scope.$resolve.doctype,
        toolbar: {
            new: function () {
                baticApp.create_payment_for_invoice = {};
                baticApp.create_return_for_invoice = {};
                $rootScope.activeDoctype = $scope.$resolve.doctype;
                $state.transitionTo('app.form', {parent: $scope.$resolve.parent, doctype: $scope.$resolve.doctype, type: 'new', docname: ($rootScope.__lang('New') + ' ' + capitalizeText($scope.$resolve.doctype))});
            },
            refresh: function () {
                let widget = $('.card.card-page');
                widget.addClass('loading');
                NProgress.start();
                $rootScope.listView.list.selected_rows = {};
                $rootScope.listView.list.selected_ids = [];
                Doctype.get_list(capitalizeText($scope.$resolve.doctype.replace(/-/g, ' ')), (Object.keys($rootScope.listView.list.filters_data).length) ? _prepare_filters($rootScope.listView.list.filters_data) : {}, ['*'], `${$rootScope.listView.list.active_sort.fieldname} ${$rootScope.listView.list.active_sort.order}`).then(function (response) {
                    NProgress.done();
                    widget.removeClass('loading');
                    $rootScope.listView.list.data = response.data.message;
                    $timeout(() => {
                        $('[data-body-column="status"]').each(function () {
                            let value = $.trim($(this).text());
                            if (value && value.length) {
                                $('[data-body-column="status"], [data-head-column="status"]').show();
                            } else {
                                $('[data-body-column="status"], [data-head-column="status"]').hide();
                            }
                        });
                    }, 10);
                });
            }
        },
        list: {
            data: [],
            loading: true,
            is_select_all: false,
            indicator: function (status, type = 'label') {
                return {
                    label: (Ctrl.listView.status[status] && Ctrl.listView.status[status].label) ? Ctrl.listView.status[status].label : status,
                    color: (Ctrl.listView.status[status] && Ctrl.listView.status[status].color) ? Ctrl.listView.status[status].color : 'gray'
                };
            },
            filters_list: Ctrl.standard_filters,
            filters_data: {},
            active_sort: {
                fieldname: 'modified',
                order: 'desc',
                label: baticApp.app.__lang('Last Updated On')
            },
            sort_fields: [
                {fieldname: 'name', fieldtype: 'Link', label: __('ID')},
                {fieldname: 'idx', fieldtype: 'Int', label: __('Index')},
                {fieldname: 'creation', fieldtype: 'Date', label: __('Created On')},
                {fieldname: 'modified', fieldtype: 'Date', label: __('Last Updated On')}
            ],
            change_order: function (type, field = {}) {
                switch (type) {
                    case 'order':
                        let order = (this.active_sort.order == 'desc') ? 'asc' : 'desc';
                        this.active_sort.order = order;
                        break;
                    case 'field':
                        this.active_sort.fieldname = field.fieldname;
                        this.active_sort.label = field.label;
                        break;
                }
                $rootScope.listView.toolbar.refresh();
            },
            bulk_actions: {
                delete: function () {
                    let docnames = $rootScope.listView.list.selected_ids;
                    frappe.confirm(
                        baticApp.app.__lang("Delete {0} rows permanently?", [docnames.length]),
                        () => {
                            NProgress.start();
                            widget.addClass('loading');
                            frappe.call({
                                method: 'frappe.desk.reportview.delete_items',
                                freeze: true,
                                args: {
                                    items: docnames,
                                    doctype: capitalizeText($scope.$resolve.doctype.replace(/-/g, ' '))
                                }
                            }).then((r) => {
                                let failed = r.message;
                                if (!failed) failed = [];

                                if (failed.length && !r._server_messages) {
                                    frappe.throw(baticApp.app.__lang('Cannot delete {0}', [failed.map(f => f.bold()).join(', ')]));
                                    NProgress.done();
                                    widget.removeClass('loading');
                                }
                                if (failed.length < docnames.length) {
                                    frappe.show_alert({message: baticApp.app.__lang("{0} Rows delete", [docnames.length]), indicator: 'green'});
                                    frappe.utils.play_sound('delete');
                                    $rootScope.listView.toolbar.refresh();
                                }
                            });
                        }
                    );
                }
            },
            pagination: {
                currentPage: 0,
                pageSize: 10,
                numberOfPages: function () {
                    if ($scope.listView.list.data.length) {
                        return Math.ceil($scope.listView.list.data.length / this.pageSize);
                    } else {
                        return 0;
                    }
                },
            },
            selected_rows: {},
            selected_ids: [],
            select_id: function () {
                const $this = this;
                let length = $('.ng-datatable tbody tr').length;
                angular.forEach($this.selected_rows, function (value, id) {
                    if (value == true) {
                        if (!$this.selected_ids.includes(id))
                            $this.selected_ids.push(id);
                    } else {
                        $this.selected_ids.removeItem(id);
                    }
                });
                if ($this.selected_ids.length >= length) {
                    $this.is_select_all = true;
                } else if ($this.selected_ids.length < length) {
                    $this.is_select_all = false;
                }
            },
            select_all: function () {
                if (!this.is_select_all) {
                    this.is_select_all = true;
                    $('.ng-datatable').each(function () {
                        let table = $(this);
                        $('tbody tr', table).each(function () {
                            $('td:first', this).find('input[type="checkbox"]').prop('checked', false).trigger('click');
                        });
                    });
                } else {
                    this.is_select_all = false;
                    $('.ng-datatable').each(function () {
                        let table = $(this);
                        $('tbody tr', table).each(function () {
                            $('td:first', this).find('input[type="checkbox"]').prop('checked', true).trigger('click');
                        });
                    });
                }
            },
            get: function (callback) {
                NProgress.start();
                Doctype.get_list(capitalizeText($scope.$resolve.doctype.replace(/-/g, ' '))).then(callback);
            }
        }
    };

    $timeout(() => {
        Doctype.get_list(capitalizeText($scope.$resolve.doctype.replace(/-/g, ' ')), _prepare_filters({}), ['*'], `${$rootScope.listView.list.active_sort.fieldname} ${$rootScope.listView.list.active_sort.order}`).then(function (response) {
            $rootScope.listView.list.loading = false;
            $rootScope.listView.list.data = response.data.message;
            $timeout(() => {
                $('[data-body-column="status"]').each(function () {
                    let value = $.trim($(this).text());
                    if (value && value.length) {
                        $('[data-body-column="status"], [data-head-column="status"]').show();
                    } else {
                        $('[data-body-column="status"], [data-head-column="status"]').hide();
                    }
                });
            }, 10);
        });
        $('.report-filter-area', '[data-doctype="' + $rootScope.listView.doctype + '"]').each(function () {
            $('select, input', this).each(function () {
                if ($(this).data('fieldtype') == 'Link') {
                    $(this).on('field-link-blur input', function () {
                        $timeout(() => {
                            $rootScope.listView.list.filters_data = $rootScope.buildRequestStringData($('.report-filter-area', '[data-doctype="' + $rootScope.listView.doctype + '"]'));
                            $rootScope.listView.toolbar.refresh();
                        }, 100);
                    });
                } else if (['Select', 'Check', 'Date', 'Time'].includes($(this).data('fieldtype'))) {
                    $(this).on('change', function () {
                        $timeout(() => {
                            $rootScope.listView.list.filters_data = $rootScope.buildRequestStringData($('.report-filter-area', '[data-doctype="' + $rootScope.listView.doctype + '"]'));
                            $rootScope.listView.toolbar.refresh();
                        }, 100);
                    });
                } else {
                    $(this).on('input', function () {
                        $timeout(() => {
                            $rootScope.listView.list.filters_data = $rootScope.buildRequestStringData($('.report-filter-area', '[data-doctype="' + $rootScope.listView.doctype + '"]'));
                            $rootScope.listView.toolbar.refresh();
                        }, 100);
                    });
                }
            });

        });
    }, 1000);


    $rootScope.fieldLink = function (link, txt = '', callback) {
        Doctype.search_link(link.doctype, link.reference_doctype, link.filters, txt, link.ignore_user_permissions, link.query).then(function (response) {
            callback(response);
        });
    }

    function doctypeListView(doctype) {
        let doc_fields = Ctrl.doctype_data.fields;
        let doctype_data = Ctrl.doctype_data;
        let columns = [];
        let workflow_state = doc_fields.filter(field => field.fieldname == 'workflow_state')[0];
        let doc_title = {
            fieldname: 'name',
            fieldtype: 'Data',
            label: $rootScope.__lang('ID'),
        };
        if (doctype_data && doctype_data.title_field) {
            let title_field = doc_fields.filter(df => df.fieldname == doctype_data.title_field)[0];
            if (title_field) {
                doc_title = {
                    fieldname: title_field.fieldname,
                    fieldtype: title_field.fieldtype,
                    label: $rootScope.__lang(title_field.label),
                }
            }
        }
        let columns_in_listview = [
            doc_title,
            {
                fieldname: 'status',
                fieldtype: 'Data',
                options: (workflow_state && workflow_state.options) ? workflow_state.options : '',
                label: $rootScope.__lang('Status'),
            }
        ];
        if (doctype_data.title_field)
            columns_in_listview = [...columns_in_listview, ...doc_fields.filter(field => (field.in_list_view === 1 && field.fieldname !== 'status' && field.fieldname !== doctype_data.title_field))];
        else
            columns_in_listview = [...columns_in_listview, ...doc_fields.filter(field => (field.in_list_view === 1 && field.fieldname !== 'status'))];

        // console.log('doctype_data', doctype_data)
        // console.log('doc_fields', doc_fields)
        // console.log('columns_in_listview', columns_in_listview)

        columns_in_listview.map((field, index) => {
            let title = (field && field.label) ? baticApp.app.__lang(field.label) : baticApp.app.__lang(frappe.capitalizeFirstLetter(baticApp.app.__lang(field.fieldname.replace(/_/g, ' '))));
            let template = `{{row.${field.fieldname}}}`;
            if (field.fieldname == (doctype_data?.title_field || 'name')) {
                let img = '';
                if (frappe.meta.has_field(capitalizeText(doctype), 'image')) {
                    img = `<div class="list-thumbnail list-thumbnail-md"><div class="centered"><img ng-src="{{(row.image)?row.image:'/assets/batic/images/null.png'}}"></div></div>`;
                }
                template = `<a class="docname-link d-flex align-items-center" ui-sref="app.form({parent:current_route_params.parent,doctype:'${doctype}',type:'view',docname:row.name})">
                                ${img} {{row.${field.fieldname}}}
                            </a>`;
            } else if (field.fieldtype === "Select") {
                template = `<span class="indicator-pill light ellipsis">
                                <span class="ellipsis">{{row.${field.fieldname}}}</span>
                            </span>`;

            } else if (field.fieldtype === "Small Text" || field.fieldtype === "Text Editor") {
                template = `<span class="ellipsis"><span class="ellipsis">{{ getTextFromHTML(row.${field.fieldname}) }}</span></span>`;
            } else if (field.fieldtype === "Check") {
                template = `<span class="indicator-check" ng-class="(row.${field.fieldname}==1)?'check-true':''">
                                <span class="ellipsis">{{row.${field.fieldname}}}</span>
                            </span>`;

            } else if (field.fieldname === "status" || field?.options == "Workflow State") {
                let show_workflow_state = field.options == "Workflow State";
                template = `<div class="list-row-col" ng-bind-html="list_get_indicator_html(row, '${doctype}', '${show_workflow_state}')"></div>`;
            }
            columns.push({
                name: field.fieldname,
                label: title,
                template: template
            });
        });
        let list_view = {
            columns: columns
        };

        return list_view;
    }

    function _prepare_filters(filters) {
        let filters_obj = {};
        angular.forEach(filters, function (value, index) {
            if (value) {
                if (index == 'name')
                    filters_obj[index] = ['like', `%${value}%`];
                else
                    filters_obj[index] = ['=', value];
            }
        });
        return filters_obj;
    }

}).filter('htmlFilter', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    };
}).directive("filterFormField", function ($rootScope, $stateParams) {
    return {
        restrict: 'E',
        templateUrl: load_template('directives.filters-form-field'),
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
}).directive("filterFieldData", function ($rootScope) {
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
}).directive("filterFieldCheck", function ($rootScope) {
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
}).directive("filterFieldCurrency", function ($rootScope) {
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
}).directive("filterFieldFloat", function ($rootScope) {
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
}).directive("filterFieldDate", function ($rootScope) {
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
}).directive("filterFieldTime", function ($rootScope) {
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
}).directive("filterFieldLink", function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-link dropdown" ng-hide="hideField==true" data-doctype="{{field.options}}" data-reference_doctype="${$rootScope.listView.doctype}" tooltip="{{ $root.__lang(field.title) }}"> 
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
}).directive("filterFieldSelect", function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-select" ng-hide="hideField==true" tooltip="{{ $root.__lang(field.title) }}"> 
               <select class="form-select chosen-select" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-model="ngModel" id="{{field.name}}" data-fieldname="{{field.name}}" data-fieldtype="{{field.type}}"> 
                    <option value="" hidden selected default class="text-secondary">{{ $root.__lang(field.title) }}</option>
                    <option></option>
                    <option ng-repeat="option in selectOptions track by $index" ng-if="option" value="{{option}}">{{ $root.__lang(option) }}</option>
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
