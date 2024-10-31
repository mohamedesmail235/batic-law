/*
 *  List Controller
 */

angular.module('baticNgApp', []).controller("formController", function ($scope, $rootScope, $http, $state, $timeout, $stateParams, Doctype) {

    let Ctrl = this;
    let widget = $('.card.card-page');

    Ctrl.formView = baticApp.forms[$scope.$resolve.doctype]?.form || [];
    Ctrl.formViewChanged = false;
    Ctrl.formViewLoaded = false;
    Ctrl.is_submittable = false;


    $rootScope.formType = $stateParams.type;
    $rootScope.formDoctypes = $scope.$resolve.api.doctype.data.docs;
    $rootScope.getDoctype = $scope.$resolve.api.doctype.data.docs[0];
    $rootScope.docData = ($scope.$resolve.api.docdata.data && $scope.$resolve.api.docdata.data.docs && $scope.$resolve.api.docdata.data.docs[0]) ? $scope.$resolve.api.docdata.data.docs[0] : {};
    $rootScope.loadData = ($scope.$resolve.load_data && $scope.$resolve.load_data[$scope.$resolve.doctype] && $scope.$resolve.load_data[$scope.$resolve.doctype].data && $scope.$resolve.load_data[$scope.$resolve.doctype].data.message) ? $scope.$resolve.load_data[$scope.$resolve.doctype].data.message : null;
    $rootScope.doctype_print_format = ($scope.$resolve.api.doctype_print_format.data && $scope.$resolve.api.doctype_print_format.data.message) ? $scope.$resolve.api.doctype_print_format.data.message : 'Standard';
    $rootScope.activeDoctype = $scope.$resolve.doctype;

    if ($rootScope.formDoctypes) {
        locals["DocType"] = null;
        let docs_list = {};
        const output = $rootScope.formDoctypes.reduce((acc, curr) => {
            acc[curr.name] = curr;
            return acc;
        }, {});
        locals["DocType"] = output || {};
    }

    // console.log('Ctrl.formView', Ctrl.formView)
    // console.log('$rootScope.getDoctype', $scope.$resolve.api.doctype.data)
    // console.log('$rootScope.docData', $rootScope.docData)
    // console.log('$stateParams', $stateParams)

    // $rootScope.docData.docstatus = 3

    $rootScope.formView = {
        workspace: $scope.$resolve.workspace,
        parent: $scope.$resolve.parent,
        doctype: $scope.$resolve.doctype,
        docname: $scope.$resolve.docname,
        form_type: $scope.$resolve.form_type,
        toolbar: {
            has_action: function () {
                if (!baticApp.forms[$scope.$resolve.doctype]?.actions)
                    return false;
                let actions = baticApp.forms[$scope.$resolve.doctype]?.actions(Ctrl, $scope, $rootScope, $http, $timeout);
                let doc = $rootScope.docData;
                if (actions.condition && doc)
                    return actions?.list.length && baticApp.app.eval(actions.condition, {doc});
                else
                    return actions?.list.length;
            },
            actions: (baticApp.forms[$scope.$resolve.doctype]?.actions) ? baticApp.forms[$scope.$resolve.doctype]?.actions(Ctrl, $scope, $rootScope, $http, $timeout)?.list : [],
            save: function ($event) {
                $event.preventDefault();
                let btn = $($event.currentTarget)
                NProgress.start();
                widget.addClass('loading');
                btn.attr('disabled', 'disabled');
                Doctype.save(capitalizeText($scope.$resolve.doctype.replace(/-/g, ' ')), baticApp.doctypes[$scope.$resolve.doctype].data($rootScope)).then(function (response) {
                    if (response.status === 200) {
                        frappe.utils.play_sound('click');
                        frappe.show_alert({message: baticApp.app.__lang("Saved"), indicator: 'green'});
                        $rootScope.view_doctype($state, $scope.$resolve.parent, $scope.$resolve.doctype, response.data.data);
                    } else {
                        NProgress.done();
                        widget.removeClass('loading');
                        btn.removeAttr('disabled');
                    }
                });
            },
            update: function ($event) {
                $event.preventDefault();
                let btn = $($event.currentTarget)
                NProgress.start();
                widget.addClass('loading');
                btn.attr('disabled', 'disabled');
                Doctype.update(capitalizeText($scope.$resolve.doctype.replace(/-/g, ' ')), $scope.$resolve.docname, baticApp.doctypes[$scope.$resolve.doctype].data($rootScope)).then(function (response) {
                    if (response.status === 200) {
                        frappe.utils.play_sound('click');
                        frappe.show_alert({message: baticApp.app.__lang("Updated"), indicator: 'green'});
                        $state.reload();
                    } else {
                        NProgress.done();
                        widget.removeClass('loading');
                        btn.removeAttr('disabled');
                    }
                });
            },
            submit: function ($event) {
                $event.preventDefault();
                let btn = $($event.currentTarget)
                frappe.confirm(__("Permanently Submit {0}?", [$scope.$resolve.docname]), function () {
                    NProgress.start();
                    widget.addClass('loading');
                    btn.attr('disabled', 'disabled');
                    Doctype.submit_or_cancel(capitalizeText($scope.$resolve.doctype.replace(/-/g, ' ')), $scope.$resolve.docname, 1).then(function (response) {
                        if (response.status === 200) {
                            frappe.utils.play_sound('submit');
                            frappe.show_alert({message: baticApp.app.__lang("Submitted"), indicator: 'green'});
                            $state.reload();
                        } else {
                            NProgress.done();
                            widget.removeClass('loading');
                            btn.removeAttr('disabled');
                        }
                    });
                });
            },
            cancel: function ($event) {
                $event.preventDefault();
                let btn = $($event.currentTarget)
                frappe.confirm(__("Permanently Cancel {0}?", [$scope.$resolve.docname]), function () {
                    NProgress.start();
                    widget.addClass('loading');
                    btn.attr('disabled', 'disabled');
                    Doctype.submit_or_cancel(capitalizeText($scope.$resolve.doctype.replace(/-/g, ' ')), $scope.$resolve.docname, 2).then(function (response) {
                        if (response.status === 200) {
                            frappe.utils.play_sound('cancel');
                            frappe.show_alert({message: baticApp.app.__lang("Canceled"), indicator: 'green'});
                            $state.reload();
                        } else {
                            NProgress.done();
                            widget.removeClass('loading');
                            btn.removeAttr('disabled');
                        }
                    });
                });
            },
            print: function ($event) {
                $event.preventDefault();
                window.open(`/printview?doctype=${capitalizeText($scope.$resolve.doctype.replace(/-/g, ' '))}&name=${$scope.$resolve.docname}&format=${$rootScope.doctype_print_format}&no_letterhead=1&letterhead=No Letterhead&settings={}&_lang=${($rootScope.app.user.info.language) ? $rootScope.app.user.info.language : 'en'}`, '_blank').focus();
            },
            refresh: function ($event) {
                $event.preventDefault();
                NProgress.start();
                Ctrl.invoice_value_changed = false;
                $state.reload();
            },
            create: function ($event, type = '') {
                $event.preventDefault();
                switch (type) {
                    case 'payment':
                        baticApp.create_payment_for_invoice = {
                            docname: $rootScope.formView.docname,
                            doctype: $scope.$resolve.doctype,
                        };
                        $state.transitionTo('app.form', {workspace: 'accounting', doctype: 'payment-entry', type: 'new', docname: 'new-payment-entry-1'});
                        break;
                    case 'return':
                        baticApp.create_return_for_invoice = {
                            docname: $rootScope.formView.docname,
                            doctype: $scope.$resolve.doctype,
                        };
                        $state.transitionTo('app.form', {workspace: $scope.$resolve.workspace, doctype: $scope.$resolve.doctype, type: 'new', docname: 'new-' + (($scope.$resolve.doctype == 'sales-invoice') ? 'sales' : 'purchase') + '-invoice-1'});
                        break;
                }
            },
            show_actions: function (doctype, status) {
                if ((['sales-invoice', 'purchase-invoice']).includes(doctype) && (['Unpaid', 'Credit Note Issued', 'Paid', 'Overdue']).includes(status)) {
                    return true;
                }
            },
            show_status: function (doctype) {
                if ((['sales-invoice', 'purchase-invoice', 'pos-opening-entry', 'pos-closing-entry', 'pos-opening-shift', 'pos-closing-shift']).includes(doctype)) {
                    return true;
                }
            },
        },
        form: {
            view: Ctrl.formView,
            data: {
                _form_view_type: $scope.$resolve.form_type
            },
            get_data: function () {
                let data = {};
                let fields = $rootScope.formView.form.get_fields();
                fields.map(field => {
                    if (field.type === 'Fload' || field.type === 'Int' || field.type === 'Currency') {
                        data[field.name] = ($rootScope.formView.form.data[field.name] || '0.00');
                    } else if (field.type === 'Check') {
                        data[field.name] = ($rootScope.formView.form.data[field.name] === 1) ? 1 : 0;
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
                        if (field.type !== 'HTML') {
                            data[field.name] = stringVal($rootScope.formView.form.data[field.name]);
                        }
                    }
                });
                return data;
            },
            get_fields: function () {
                let allFields = [];
                Ctrl.formView.forEach(row => {
                    row.fields.forEach(fieldObj => {
                        allFields.push(fieldObj.field);
                    });
                });
                return allFields;
            },
            submit: function ($event) {
                $event.preventDefault();
            }
        }
    };

    $timeout(() => {
        if ($rootScope.loadData) {
            $.extend($rootScope.formView.form.data, $rootScope.loadData);
            $rootScope.loadData = null;
        }
        Ctrl.is_submittable = Boolean(frappe.get_meta(capitalizeText($scope.$resolve.doctype))?.is_submittable)
        $timeout(() => {
            if ($('.form-textarea-editor').length) {
                $rootScope.formEditors = {};
                $('.form-textarea-editor').each(function () {
                    let id = $(this).attr('id');
                    $rootScope.formEditors[id] = new Quill(`#${id}`, {
                        modules: {
                            toolbar: [
                                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                                ['blockquote', 'code-block'],
                                ['link', 'image', 'video', 'formula'],

                                [{'header': 1}, {'header': 2}],               // custom button values
                                [{'list': 'ordered'}, {'list': 'bullet'}, {'list': 'check'}],
                                [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                                [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                                [{'direction': 'rtl'}],                         // text direction

                                [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
                                [{'header': [1, 2, 3, 4, 5, 6, false]}],

                                [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                                [{'font': []}],
                                [{'align': []}],

                                ['clean']                                         // remove formatting button
                            ]
                        },
                        theme: 'snow'
                    });
                    $('.form-textarea-editor').css('opacity', 1);
                    if ($rootScope.docData.docstatus == 1 || $rootScope.docData.docstatus == 2) {
                        $rootScope.formEditors[id].enable(false);
                    } else {
                        $rootScope.formEditors[id].on('text-change', () => {
                            $timeout(() => {
                                $rootScope.formView.form.data[$(this).data('fieldname')] = $rootScope.formEditors[id].getSemanticHTML();
                                Ctrl.formViewChanged = true;
                            }, 50);
                        });
                    }
                });
            }
        }, 1000)
    }, 250);

    $rootScope.fieldTable = {
        is_select_all: false,
        fields: {},
        rows: {},
        selected_rows: {},
        selected_ids: [],
    };

    $rootScope.fieldLink = function (link, txt = '', callback) {
        Doctype.search_link(link.doctype, link.reference_doctype, link.filters, txt, link.ignore_user_permissions, link.query).then(function (response) {
            callback(response);
        });
    }

    if (baticApp.doctypes[$stateParams.doctype].init !== "undefined" && typeof baticApp.doctypes[$stateParams.doctype].init === "function") {
        baticApp.doctypes[$stateParams.doctype].init($rootScope.formView.form.data, $rootScope, $scope, $http, $timeout);
    }

    if (baticApp.doctypes[$stateParams.doctype].events !== "undefined" && typeof baticApp.doctypes[$stateParams.doctype].events === "function") {
        baticApp.doctypes[$stateParams.doctype].events($rootScope.formView.form.data, $rootScope, $scope, $http, $timeout);
    }

    $(document).bind("keydown", function (e) {
        if (e.ctrlKey && e.which == 83) {
            e.preventDefault();
            if ($('.btn-form-save, .btn-form-update').prop('disabled') != true)
                $('.btn-form-save, .btn-form-update').prop('disabled', true).trigger('click');
            return false;
        }
    });

    $timeout(() => {
        $('[data-fieldtype="Link"]').each(function () {
            if ($.trim($(this).val()))
                $(this).trigger('field-link-blur');
        });
        Ctrl.formViewLoaded = true;
        $('.formView').removeClass('form-loading');

    }, 1000);

    $timeout(() => {
        $timeout(() => {
            $('.card-page form', document).each(function () {
                $(this).on('input change', 'input, select, textarea', function () {
                    if ($rootScope.docData.docstatus == 0) {
                        $timeout(() => {
                            Ctrl.formViewChanged = true;
                        }, 10);
                    }
                    if ($rootScope.docData.disabled == 0 || $rootScope.docData.disabled == 1) {
                        $timeout(() => {
                            Ctrl.formViewChanged = true;
                        }, 10);
                    }
                });
            });
        }, 250);
    }, 1800);

}).directive("formField", function ($rootScope, $stateParams, $timeout) {
    return {
        restrict: 'E',
        templateUrl: load_template('directives.form-field'),
        link: function (scope, element, attrs) {
            if (scope.field && scope.field.set_only_once == true) {
                if ($rootScope.formType == 'new') {
                    $timeout(function () {
                        scope.readonlyField = false;
                    }, 10);
                } else {
                    $timeout(function () {
                        scope.readonlyField = true;
                    }, 10);
                }
            }
            scope.$root.$watch('formView.form.data', function (form) {
                const doctype = baticApp.doctypes[$stateParams.doctype];
                if (scope.field && scope.field.depends_on) {
                    if (baticApp.app.eval(scope.field.depends_on, {form})) {
                        scope.hideField = false;
                    } else {
                        scope.hideField = true;
                    }
                }
                if (scope.field && scope.field.disabled_on_edit && scope.$root.formType === 'view') {
                    scope.readonlyField = true;
                }
                if (scope.field && scope.field.readonly === true) {
                    scope.readonlyField = true;
                }
                if (scope.field && scope.field.hide_label === true) {
                    scope.hideLabel = true;
                }
                if (scope.field && (scope.field.readonly_depends_on || scope.field.readonly_on)) {
                    if (baticApp.app.eval(scope.field.readonly_depends_on, {form})) {
                        scope.readonlyField = true;
                    } else if (scope.field.readonly_on) {
                        scope.readonlyField = true;
                    } else {
                        scope.readonlyField = false;
                    }
                }
                if ($rootScope.formType == 'view' && ($rootScope.docData.docstatus === 1 || $rootScope.docData.docstatus === 2)) {
                    $timeout(() => $('input, select, textarea', $('#doctypeForm')).prop('disabled', true), 1000);
                    $timeout(() => $('.btn-add-table-row', $('#doctypeForm')).hide(), 1000);
                    scope.readonlyField = true
                } else {
                    $timeout(() => $('input, select, textarea', $('#doctypeForm')).prop('disabled', false), 250);
                    $timeout(() => $('.btn-add-table-row', $('#doctypeForm')).show(), 250);
                    scope.readonlyField = false;
                }
                $timeout(() => {
                    doctype.load(form, scope)
                }, 400);
            }, true);
            scope.$watch('field', function (field) {
                $timeout(function () {
                    if ($rootScope.docData && $rootScope.docData.hasOwnProperty(field.name)) {
                        scope.ngModel = $rootScope.docData[field.name];
                    } else {
                        if (field.default_value && $rootScope.formType == 'new') {
                            scope.ngModel = field.default_value;
                        }
                    }
                }, 500);
            }, true);
        },
        scope: {
            field: '=',
            fieldType: '=?',
            ngModel: '=ngModel',
            formDataModel: '@',
            hideField: '@',
            readonlyField: '@',
            hideLabel: '@',
            sizeSmall: '@',
            isInTable: '=',
            tableRowIndex: '=',
        }
    }
}).directive("fieldData", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-data" ng-hide="hideField==true"> 
                <label for="{{field.name}}" ng-if="hideLabel!='true'" class="form-control-label" ng-class="(field.required)?'reqd':''">{{ field.title }}</label>  
                <input type="text" ng-model="ngModel" id="{{field.name}}" data-fieldname="{{field.name}}" class="form-control" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" data-fieldtype="{{field.type}}" ng-readonly="readonlyField" placeholder="{{(field.placeholder)?field.placeholder:''}}" autocomplete="off">
                <div class="font-s-12 font-w-400 mt-05" ng-if="field.description">{{field.description}}</div>
            </div>
        `,
        link: function (scope, element, attrs) {

        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            hideField: '=',
            readonlyField: '=',
            hideLabel: '=',
            sizeSmall: '=',
        }
    }
}).directive("fieldSmallText", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-data" ng-hide="hideField==true"> 
                <label for="{{field.name}}" ng-if="hideLabel!='true'" class="form-control-label" ng-class="(field.required)?'reqd':''">{{ field.title }}</label>  
                <textarea rows="6" ng-model="ngModel" id="{{field.name}}" data-fieldname="{{field.name}}" class="form-control" ng-class="{'form-control-sm':(sizeSmall=='true')}" ng-disabled="field.disabled" ng-required="field.required" data-fieldtype="{{field.type}}" ng-readonly="readonlyField" placeholder="{{(field.placeholder)?field.placeholder:''}}" autocomplete="off"></textarea>
                <div class="font-s-12 font-w-400 mt-05" ng-if="field.description">{{field.description}}</div>
            </div>
        `,
        link: function (scope, element, attrs) {

        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            hideField: '=',
            readonlyField: '=',
            hideLabel: '=',
            sizeSmall: '=',
            isEditor: '=',
        }
    }
}).directive("fieldEditorText", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-data" ng-hide="hideField==true"> 
                <label for="{{field.name}}" ng-if="hideLabel!='true'" class="form-control-label" ng-class="(field.required)?'reqd':''">{{ field.title }}</label>  
                <div class="form-textarea-editor" style="height:300px;opacity:0" ng-model="ngModel" id="editor-{{field.name}}" data-fieldname="{{field.name}}"></div>
                <div class="font-s-12 font-w-400 mt-05" ng-if="field.description">{{field.description}}</div>
            </div>
        `,
        link: function (scope, element, attrs) {
            setTimeout(() => {
                element.find('.form-textarea-editor').html(scope.formDataModel[scope.field.name]);
            }, 1000);
        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            hideField: '=',
            readonlyField: '=',
            hideLabel: '=',
            sizeSmall: '=',
            isEditor: '=',
            formDataModel: '='
        }
    }
}).directive("fieldCheck", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-check" ng-hide="hideField==true"> 
                <div class="form-checkbox" ng-class="(sizeSmall=='true')?'form-checkbox-sm':''">
                    <input type="checkbox" data-fieldtype="{{field.type}}" data-fieldname="{{field.name}}" id="field-check-{{(isInTable==true)?tableRowIndex+'-':''}}{{field.name}}" ng-model="ngModel" ng-true-value="1" ng-false-value="0" ng-disabled="field.disabled" ng-required="field.required">
                    <label for="field-check-{{(isInTable==true)?tableRowIndex+'-':''}}{{field.name}}"></label>
                </div>
                <label for="field-check-{{field.name}}" ng-hide="field.hide_label">{{ field.title }}</label>
            </div>
            <div class="font-s-12 font-w-400 mt-05" ng-if="field.description">{{field.description}}</div>
        `,
        link: function (scope, element, attrs) {

        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            hideField: '=',
            readonlyField: '=',
            hideLabel: '=',
            sizeSmall: '=',
            isInTable: '=',
            tableRowIndex: '=',
        }
    }
}).directive("fieldCurrency", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-currency" ng-hide="hideField==true"> 
                <label for="{{field.name}}" ng-if="hideLabel!='true'" class="form-control-label" ng-class="(field.required)?'reqd':''">{{ field.title }}</label>  
                <div class="input-group form-field-currency" ng-class="(sizeSmall=='true')?'input-group-sm':''">
                    <input type="text" ng-model="ngModel" valid-number allow-decimal="true" allow-negative="true" id="{{field.name}}" data-fieldname="{{field.name}}" class="form-control font-w-700" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" data-fieldtype="{{field.type}}" ng-readonly="readonlyField"  placeholder="{{(field.placeholder)?field.placeholder:''}}" autocomplete="off">
                    <span class="input-group-text font-w-700">${$rootScope.app.get_currency_symbol()}</span>
                </div>
                <div class="font-s-12 font-w-400 mt-05" ng-if="field.description">{{field.description}}</div>
            </div>
        `,
        link: function (scope, element, attrs) {

        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            hideField: '=',
            readonlyField: '=',
            hideLabel: '=',
            sizeSmall: '=',
        }
    }
}).directive("fieldFloat", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-float" ng-hide="hideField==true"> 
                <label for="{{field.name}}" ng-if="hideLabel!='true'" class="form-control-label" ng-class="(field.required)?'reqd':''">{{ field.title }}</label>  
                <input type="text" ng-model="ngModel" valid-number allow-decimal="true" allow-negative="true" id="{{field.name}}" data-fieldname="{{field.name}}" class="form-control font-w-700" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" data-fieldtype="{{field.type}}" ng-readonly="readonlyField" placeholder="{{(field.placeholder)?field.placeholder:''}}" autocomplete="off">
                <div class="font-s-12 font-w-400 mt-05" ng-if="field.description">{{field.description}}</div>
            </div>
        `,
        link: function (scope, element, attrs) {

        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            hideField: '=',
            readonlyField: '=',
            hideLabel: '=',
            sizeSmall: '=',
        }
    }
}).directive("fieldInt", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-int" ng-hide="hideField==true"> 
                <label for="{{field.name}}" ng-if="hideLabel!='true'" class="form-control-label" ng-class="(field.required)?'reqd':''">{{ field.title }}</label>  
                <input type="text" ng-model="ngModel" id="{{field.name}}" data-fieldname="{{field.name}}" class="form-control font-w-700" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" data-fieldtype="{{field.type}}" ng-readonly="readonlyField" placeholder="{{(field.placeholder)?field.placeholder:''}}" autocomplete="off">
                <div class="font-s-12 font-w-400 mt-05" ng-if="field.description">{{field.description}}</div>
            </div>
        `,
        link: function (scope, element, attrs) {
            element.on('keydown', '.form-field-int > input', function (evt) {
                let e = evt || window.event;
                let key = e.keyCode || e.which;
                if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                    // numbers
                    key >= 48 && key <= 57 ||
                    // Numeric keypad
                    key >= 96 && key <= 105 ||
                    // Backspace and Tab and Enter
                    key == 8 || key == 9 || key == 13 ||
                    // Home and End
                    key == 35 || key == 36 ||
                    // left and right arrows
                    key == 37 || key == 39 ||
                    // Del and Ins
                    key == 46 || key == 45) {
                    // input is VALID
                } else {
                    // input is INVALID
                    e.returnValue = false;
                    if (e.preventDefault) e.preventDefault();
                }
            });
        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            hideField: '=',
            readonlyField: '=',
            hideLabel: '=',
            sizeSmall: '=',
        }
    }
}).directive("fieldDate", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
             <div class="form-field-date" ng-hide="hideField==true">
                <label for="{{field.name}}" ng-if="hideLabel!='true'" class="form-control-label" ng-class="(field.required)?'reqd':''">{{ field.title }}</label>  
                <div class="input-group" ng-class="(sizeSmall=='true')?'input-group-sm':''">
                    <span class="input-group-text"><i class="fal fa-calendar-alt"></i></span>
                    <input type="text" ng-model="ngModel" data-toggle="datepicker" id="{{field.name}}" data-fieldname="{{field.name}}" class="form-control" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" data-fieldtype="{{field.type}}" ng-readonly="readonlyField" placeholder="{{(field.placeholder)?field.placeholder:''}}" autocomplete="off">
                </div>
                <div class="font-s-12 font-w-400 mt-05" ng-if="field.description">{{field.description}}</div>
            </div>
        `,
        link: function (scope, element, attrs) {
            if (scope.field && scope.field.readonly) {
                scope.readonlyField = true;
            }
        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            hideField: '=',
            readonlyField: '=',
            hideLabel: '=',
            sizeSmall: '=',
        }
    }
}).directive("fieldHijriDate", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
             <div class="form-field-hijri-date" ng-hide="hideField==true"> 
                <label for="{{field.name}}" ng-if="hideLabel!='true'" class="form-control-label" ng-class="(field.required)?'reqd':''">{{ field.title }}</label>  
                <div class="input-group" ng-class="(sizeSmall=='true')?'input-group-sm':''">
                    <span class="input-group-text"><i class="fal fa-calendar-alt"></i></span>
                    <input type="text" ng-model="ngModel" data-toggle="hijri-datepicker" id="{{field.name}}" data-fieldname="{{field.name}}" class="form-control" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" data-fieldtype="{{field.type}}" ng-readonly="readonlyField" placeholder="{{(field.placeholder)?field.placeholder:''}}" autocomplete="off">
                </div>
                <div class="font-s-12 font-w-400 mt-05" ng-if="field.description">{{field.description}}</div>
            </div>
        `,
        link: function (scope, element, attrs) {

        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            hideField: '=',
            readonlyField: '=',
            hideLabel: '=',
            sizeSmall: '=',
        }
    }
}).directive("fieldDateTime", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
             <div class="form-field-date" ng-hide="hideField==true"> 
                <label for="{{field.name}}" ng-if="hideLabel!='true'" class="form-control-label" ng-class="(field.required)?'reqd':''">{{ field.title }}</label>  
                <div class="input-group" ng-class="(sizeSmall=='true')?'input-group-sm':''">
                    <span class="input-group-text"><i class="fal fa-calendar-alt"></i></span>
                    <input type="text" ng-model="ngModel" data-toggle="datetimepicker" id="{{field.name}}" data-fieldname="{{field.name}}" class="form-control" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" data-fieldtype="{{field.type}}" ng-readonly="readonlyField" placeholder="{{(field.placeholder)?field.placeholder:''}}" autocomplete="off">
                </div>
                <div class="font-s-12 font-w-400 mt-05" ng-if="field.description">{{field.description}}</div>
            </div>
        `,
        link: function (scope, element, attrs) {

        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            hideField: '=',
            readonlyField: '=',
            hideLabel: '=',
            sizeSmall: '=',
        }
    }
}).directive("fieldTime", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
             <div class="form-field-date" ng-hide="hideField==true"> 
                <label for="{{field.name}}" ng-if="hideLabel!='true'" class="form-control-label" ng-class="(field.required)?'reqd':''">{{ field.title }}</label>  
                <div class="input-group" ng-class="(sizeSmall=='true')?'input-group-sm':''">
                    <span class="input-group-text"><i class="fal fa-clock"></i></span>
                    <input type="text" ng-model="ngModel" data-toggle="timepicker" id="{{field.name}}" data-fieldname="{{field.name}}" class="form-control" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" data-fieldtype="{{field.type}}" ng-readonly="readonlyField" placeholder="{{(field.placeholder)?field.placeholder:''}}" autocomplete="off">
                </div>
                <div class="font-s-12 font-w-400 mt-05" ng-if="field.description">{{field.description}}</div>
            </div>
        `,
        link: function (scope, element, attrs) {

        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            hideField: '=',
            readonlyField: '=',
            hideLabel: '=',
            sizeSmall: '=',
        }
    }
}).directive("fieldLink", function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-link dropdown" ng-hide="hideField==true" data-doctype="{{field.link.doctype}}" data-reference_doctype="{{field.link.reference_doctype}}" data-filters="{{field.link.filters}}" data-ignore_user_permissions="{{field.link.ignore_user_permissions}}" data-query="{{field.link.query}}"> 
                <label for="{{field.name}}" ng-if="hideLabel!='true'" class="form-control-label" ng-class="(field.required)?'reqd':''">{{ field.title }}</label>  
                <input type="text" ng-model="ngModel" id="{{field.name}}" data-fieldname="{{field.name}}" class="form-control" ng-class="(sizeSmall=='true')?'form-control-sm':''" ng-disabled="field.disabled" ng-required="field.required" data-fieldtype="{{field.type}}" ng-readonly="readonlyField" placeholder="{{(field.placeholder)?field.placeholder:''}}" autocomplete="off">
                <span class="form-field-link-loading" ng-if="linkIsLoading"></span>
                <div class="dropdown-menu animated fadeIn faster" style="max-height:280px;overflow:auto;transform:scale(1, 1);display:none;"> 
                    <button type="button" class="dropdown-item dropdown-item-link w-100" ng-repeat="item in linkResult" ng-click="click_link(item)" ng-if="linkResult.length && item.value">
                        <span class="font-w-700 d-block" style="style="overflow: hidden;text-overflow: ellipsis;">{{item.value}}</span>
                        <small class="d-block font-w-500 font-s-12" style="overflow: hidden;text-overflow: ellipsis;" ng-if="item.description.length"> {{item.description}}</small>
                    </button>
                    <span class="d-block p-2 text-center text-secondary" ng-if="!linkResult.length && !linkIsLoading">${baticApp.app.__lang('No Data Found')}</span>
                    <div class="dropdown-divider" ng-if="!linkIsLoading && (field.allow_new || (filters && filters!='{}'))"></div>
                    <div class="dropdown-item bg-white dropdown-item-filters" style="white-space:revert;" ng-if="(filters && filters!='{}')" ng-click="click_filter()"> 
                        <span class="text-secondary" style="line-height: 1.5" ng-bind-html="$root.get_filter_description(filters)"></span>
                    </div>
                    <a class="dropdown-item text-primary font-w-500 bg-light" ng-if="!linkIsLoading && field.allow_new"><i class="fas fa-plus"></i> {{(field.newButtonText)?field.newButtonText:newButtonText}}</a>
                </div>
                <div class="font-s-12 font-w-400 mt-05" ng-if="field.description">{{field.description}}</div>
            </div>
        `,
        link: function (scope, element, attrs) {
            let link;
            let doctype_fields = (scope.field.doctype && scope.field.doctype.length) ? $rootScope.formDoctypes.filter(doc => doc.name == scope.field.doctype)[0] : [];
            let current_fields = (doctype_fields && doctype_fields.fields) ? doctype_fields.fields : $rootScope.getDoctype.fields;
            if (current_fields) {
                let current_field = current_fields.filter(field => field.fieldname == scope.field.name)[0];
                if (current_field && current_field.default) {
                    scope.ngModel = current_field.default;
                }
            }
            scope.linkResult = [];
            scope.click_filter = function () {
                scope.linkIsLoading = false;
                $timeout(() => {
                    element.find('.form-field-link > input').trigger('focus');
                }, 100);
            };
            scope.click_link = function ({value}) {
                scope.ngModel = value;
                scope.linkIsLoading = false;
                element.find('.form-field-link > input').trigger('field-link-blur');
            };
            element.on('focus', '.form-field-link > input', function () {
                if ($(this).prop('readonly'))
                    return false;
                if (scope.ngModel)
                    return false;
                link = {}
                link['doctype'] = element.find('.form-field-link').attr('data-doctype');
                link['reference_doctype'] = element.find('.form-field-link').attr('data-reference_doctype');
                link['ignore_user_permissions'] = (element.find('.form-field-link').attr('data-ignore_user_permissions')) ? element.find('.form-field-link').attr('data-ignore_user_permissions') : 0;
                if (element.find('.form-field-link').attr('data-filters')) {
                    link['filters'] = element.find('.form-field-link').attr('data-filters');
                    $timeout(() => scope.filters = element.find('.form-field-link').attr('data-filters'), 50);
                } else {
                    $timeout(() => scope.filters = null, 50);
                }
                if (element.find('.form-field-link').attr('data-query')) {
                    link['query'] = element.find('.form-field-link').attr('data-query');
                }
                element.find('.dropdown-menu').width(element.find('.form-field-link > input').width() + 30).show();
                scope.linkIsLoading = true;
                scope.$root.fieldLink(link, scope.ngModel, function (response) {
                    // console.log('==scope.$root.fieldLink=', response.data.message)
                    if (response.status === 200) {
                        scope.linkResult = response.data.message;
                        scope.linkIsLoading = false;
                    }
                });
            });
            element.on('input', '.form-field-link > input', function () {
                if (!$.trim($(this).val()))
                    $(this).trigger('focus');
                let data = element.find('.form-field-link').data();
                link = {}
                link['doctype'] = element.find('.form-field-link').attr('data-doctype');
                link['reference_doctype'] = element.find('.form-field-link').attr('data-reference_doctype');
                link['ignore_user_permissions'] = (element.find('.form-field-link').attr('data-ignore_user_permissions')) ? element.find('.form-field-link').attr('data-ignore_user_permissions') : 0;
                if (element.find('.form-field-link').attr('data-filters')) {
                    $timeout(() => scope.filters = element.find('.form-field-link').attr('data-filters'), 50);
                    link['filters'] = element.find('.form-field-link').attr('data-filters');
                } else {
                    $timeout(() => scope.filters = null, 50);
                }
                if (element.find('.form-field-link').attr('data-query')) {
                    link['query'] = element.find('.form-field-link').attr('data-query');
                }
                scope.linkIsLoading = true;
                if (scope.ngModel)
                    element.find('.dropdown-menu').width(element.find('.form-field-link > input').width() + 30).show();
                scope.$root.fieldLink(link, scope.ngModel, function (response) {
                    if (response.status === 200) {
                        scope.linkResult = response.data.message;
                        scope.linkIsLoading = false;
                    }
                });
            });
            element.on('blur', '.form-field-link > input', function () {
                if (scope.linkResult) {
                    let link_exist = scope.linkResult.filter(link => $.trim(link.value) === $.trim(element.find('.form-field-link > input').val()))[0];
                    if (!link_exist) {
                        scope.linkIsLoading = false;
                    }
                    $timeout(() => element.find('.form-field-link > input').trigger('field-link-blur'), 100);
                }
            });
            element.on('field-link-blur', '.form-field-link > input', function () {
                element.find('.dropdown-menu').fadeOut(100);
            });
        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            linkResult: '@',
            filters: '@',
            linkIsLoading: '@',
            hideField: '=',
            readonlyField: '=',
            hideLabel: '=',
            sizeSmall: '=',
            allowNew: '=',
            newButtonText: '=',
        }
    }
}).directive("fieldSelect", function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-select" ng-hide="hideField==true"> 
               <label for="{{field.name}}" ng-if="hideLabel!='true'" class="form-control-label" ng-class="(field.required)?'reqd':''">{{ field.title }}</label>  
               <select class="form-select chosen-select" ng-class="(sizeSmall=='true')?'form-select-sm':''" ng-model="ngModel" id="{{field.name}}" data-fieldname="{{field.name}}" data-fieldtype="{{field.type}}" ng-disabled="field.disabled" ng-readonly="readonlyField"> 
                   <option ng-repeat="option in selectOptions track by $index" value="{{option}}">{{option}}</option>
               </select>
               <div class="font-s-12 font-w-400 mt-05" ng-if="field.description">{{field.description}}</div>
            </div>
        `,
        link: function (scope, element, attrs) {
            let doctype_fields = (scope.field.doctype && scope.field.doctype.length) ? $rootScope.formDoctypes.filter(doc => doc.name == scope.field.doctype)[0].fields : $rootScope.getDoctype.fields;
            let current_field = doctype_fields.filter(field => field.fieldname == scope.field.name)[0];
            let options = [];
            if (current_field && current_field.options && current_field.options.length) {
                options = $rootScope.splitLines(current_field.options);
            }
            scope.selectOptions = options;
            if (current_field && current_field.default) {
                scope.ngModel = current_field.default;
            } else if (scope.field.default_value) {
                scope.ngModel = scope.field.default_value;
            } else {
                if (options && options[0])
                    scope.ngModel = options[0];
            }
            if (scope.field && scope.field.name) {
                $timeout(function () {
                    if (scope.readonlyField) {
                        element.find('[data-fieldname="' + scope.field.name + '"]').prop('disabled', true);
                    } else {
                        element.find('[data-fieldname="' + scope.field.name + '"]').prop('disabled', false);
                    }
                }, 2500);
            }
        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            selectOptions: '@',
            hideField: '=',
            readonlyField: '=',
            hideLabel: '=',
            sizeSmall: '=',
        }
    }
}).directive("fieldAttachImage", function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-attach-image"> 
<!--               <div> -->
<!--                    <img ng-src="{{ngModel}}">-->
<!--               </div>-->
               <label for="{{field.name}}" ng-if="hideLabel!='true'" class="form-control-label" ng-class="(field.required)?'reqd':''">{{ field.title }}</label>  
               <div class="input-group">
                  <div class="form-control" ng-model="ngModel" id="{{field.name}}" data-fieldname="{{field.name}}" class="form-control" ng-class="(sizeSmall=='true')?'form-control-sm':''"  data-fieldtype="{{field.type}}"> 
                    <a href="{{ngModel}}" class="d-inline-block text-secondary font-s-12" ng-show="ngModel.length" target="_blank"><i class="far fa-paperclip"></i> {{ngModel}}</a>
                    <span ng-if="!ngModel.length" class="text-secondary">${baticApp.app.__lang('No file image')}</span>
                  </div>
                  <button class="btn btn-warning clear-attach-image" ng-class="(sizeSmall=='true')?'btn-sm':''" type="button" ng-if="ngModel.length" tooltip="${baticApp.app.__lang('Clear')}"><i class="far fa-trash-alt"></i></button>
                  <button class="btn btn-secondary add-attach-image" ng-class="(sizeSmall=='true')?'btn-sm':''" type="button" tooltip="${baticApp.app.__lang('Attach')}">
                        <i ng-if="field.type=='Attach Image'" class="far fa-camera-alt"></i>
                        <i ng-if="field.type=='Attach File'" class="far fa-paperclip"></i>
                  </button>
               </div>
           </div>
        `,
        link: function (scope, element, attrs) {
            const update_field = (value = '') => {
                $timeout(() => {
                    scope.ngModel = value;
                }, 50);
                if (!element.parents('.table-child').length) {
                    $timeout(() => {
                        $('.btn-form-update').trigger('click');
                    }, 100);
                }
            }
            element.on('click', '.add-attach-image', function () {
                let docname = $rootScope.formView.docname;
                let doctype = capitalizeText($rootScope.formView.doctype.replace(/-/g, ' '));
                new frappe.ui.FileUploader({
                    doctype: doctype,
                    docname: docname,
                    folder: 'Home/Attachments',
                    on_success: (file_doc) => {
                        update_field(file_doc.file_url);
                    }
                });

            });
            element.on('click', '.clear-attach-image', function () {
                update_field();
            });
            $timeout(() => {
                let $file_link = element.find('.form-control > a');
                if (scope.field.type == 'Attach Image')
                    $file_link.popover({
                        trigger: 'hover',
                        placement: 'top',
                        content: () => {
                            return `<div>
                                    <img src="${scope.ngModel}" class="form-field-attach-image-popover">
                                </div>`;
                        },
                        html: true
                    });
            }, 1500);
        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            selectOptions: '@',
            hideField: '=',
            readonlyField: '=',
            hideLabel: '=',
            sizeSmall: '=',
        }
    }
}).directive("fieldTable", function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        template: `
             <div class="child-datatable" ng-hide="hideField==true">
                <h2>{{ field.title }}</h2>
                <div class="font-s-12 font-w-400" ng-if="field.description">{{field.description}}</div>
                <table class="table table-bordered table-sm table-align-middle table-child" id="field-table-{{field.name}}" style="table-layout:fixed;">
                    <thead>
                        <tr>
                            <th style="width:90px;min-width:90px;max-width:90px;">
                                <div style="width:70px;min-width:70px;">
                                    <div class="datatable-checkbox datatable-checkbox-sm d-inline-block mr-2 ml-1">
                                        <input type="checkbox" class="child-datatable-select-all" id="select-all-{{field.name}}" value="true">
                                        <label for="select-all-{{field.name}}"></label>
                                    </div>
                                    ${baticApp.app.__lang('No.')}
                                </div>
                            </th>
                            <th ng-repeat="column in field.fields" style="{{(column.width)?'width:'+column.width+';':''}}{{(column.align_center)?'text-align:center;':''}}">{{column.title}}</th>
                        </tr>
                    </thead>
                    <tbody>
                         <tr ng-repeat="(uid,row) in formDataModel[field.name]" ng-if="formDataModel[field.name]" data-row-uid="{{field.name+'_'+$index}}"> 
                            <td>
                                <div class="datatable-checkbox datatable-checkbox-sm d-inline-block mr-2 ml-1">
                                    <input type="checkbox" id="item-{{field.name}}-{{ $index }}" ng-model="fieldTable.selected_rows[field.name+'_'+$index]" value="true">
                                    <label for="item-{{field.name}}-{{ $index }}"></label>
                                </div>
                                {{ $index + 1 }}
                            </td>
                            <td ng-repeat="column in field.fields" style="{{(column.align_center)?'text-align:center;':''}}"> 
                                <form-field field="column" hide-label="true" size-small="true" form-data-model="formDataModel" ng-model="formDataModel[field.name][uid][column.name]" is-in-table="true" table-row-index="field.name+uid"></form-field>
                            </td>
                        </tr>
                        <tr ng-if="!formDataModel[field.name] || !formDataModel[field.name].length || formDataModel[field.name]==[]">
                            <td colspan="{{field.fields.length+1}}">
                                <div class="table-child-no-items-rows">
                                    <svg width="34" height="40" viewBox="0 0 34 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M33 35.9989C33 37.6557 31.6568 39 30 39L4.00041 38.9995C2.3435 38.9995 1.00036 37.656 1.00025 35.9991C1.00016 34.5888 1 33.3235 1 32.1238V4.00023C1 2.34337 2.34356 1.00023 4.00042 1.00017C5.89004 1.0001 7.515 1 8.82222 1H25.1778C26.3765 1 28.2434 1.00008 30.0002 1.00015C31.657 1.00021 33 2.34337 33 4.00022V32.1238C33 33.4586 33 34.3864 33 35.9989Z" stroke="#A6B1B9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M9 12C10.1046 12 11 11.1046 11 10C11 8.89543 10.1046 8 9 8C7.89543 8 7 8.89543 7 10C7 11.1046 7.89543 12 9 12Z" stroke="#A6B1B9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M9 22C10.1046 22 11 21.1046 11 20C11 18.8954 10.1046 18 9 18C7.89543 18 7 18.8954 7 20C7 21.1046 7.89543 22 9 22Z" stroke="#A6B1B9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M15 8.5H27" stroke="#A6B1B9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M15 18.5H26" stroke="#A6B1B9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M15 11.5H23" stroke="#A6B1B9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M15 21.5H23" stroke="#A6B1B9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    ${baticApp.app.__lang('No Data')}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="mt-1">
                    <button type="button" ng-if="fieldTable.selected_ids.length" class="btn btn-xs btn-danger btn-remove-table-row">${baticApp.app.__lang('Delete')}</button>
                    <button type="button" class="btn btn-xs btn-light btn-add-table-row">{{field.addButtonTitle}}</button>
                </div>
            </div>
        `,
        link: function (scope, element, attrs) {
            let rows = [{
                uid: new Date().getTime(),
                data: {}
            }];
            scope.fieldTable = {};
            scope.fieldTable.is_select_all = false;
            scope.fieldTable.selected_rows = {};
            scope.fieldTable.selected_ids = [];
            scope.tableRows = rows
            scope.$root.fieldTable.fields[scope.field.name] = [];
            scope.$watch('fieldTable.selected_rows', function (rows) {
                $('.child-datatable').each(function () {
                    let length = $('.table-child tbody tr:visible', this).length;
                    angular.forEach(scope.fieldTable.selected_rows, function (value, id) {
                        if (value == true) {
                            if (!scope.fieldTable.selected_ids.includes(id))
                                scope.fieldTable.selected_ids.push(id);
                        } else {
                            scope.fieldTable.selected_ids.removeItem(id);
                        }
                    });
                    if ((scope.fieldTable.selected_ids.length) && scope.fieldTable.selected_ids.length >= length) {
                        // $('.child-datatable-select-all', this).prop('checked', true);
                    } else if (scope.fieldTable.selected_ids.length < length) {
                        // $('.child-datatable-select-all', this).prop('checked', false);
                    }
                });
            }, true);
            scope.$watch('formDataModel', function (formDataModel) {
                if (formDataModel && formDataModel[scope.field.name] && (formDataModel[scope.field.name]).length) {
                    scope.tableRows = formDataModel[scope.field.name];
                    scope.$root.fieldTable.fields[scope.field.name] = scope.field.fields;
                }
            }, true);
            element.on('click', '.child-datatable-select-all', function () {
                if ($(this).prop('checked')) {
                    // scope.fieldTable.is_select_all = true;
                    $(this).parents('.table-child').each(function () {
                        let table = $(this);
                        $('tbody tr', table).each(function () {
                            $('td:first', this).find('input[type="checkbox"]').prop('checked', false).trigger('click');
                        });
                    });
                } else {
                    // scope.fieldTable.is_select_all = false;
                    $(this).parents('.table-child').each(function () {
                        let table = $(this);
                        $('tbody tr', table).each(function () {
                            $('td:first', this).find('input[type="checkbox"]').prop('checked', true).trigger('click');
                        });
                    });
                }
            });
            element.on('click', 'button.btn-add-table-row', function () {
                if (!scope.formDataModel[scope.field.name])
                    scope.formDataModel[scope.field.name] = [];
                let row = {};
                row[(scope.formDataModel[scope.field.name].length - 1) + 1] = {};
                scope.formDataModel[scope.field.name].push({});
                setTimeout(() => $('#field-table-' + scope.field.name).trigger('child-table-add-row'), 150);
                scope.$apply();
            });
            element.on('click', 'button.btn-remove-table-row', function () {
                let ids = scope.fieldTable.selected_ids;
                if (ids.length) {
                    ids.map((id) => {
                        let uid = id.replace(scope.field.name + '_', '');
                        const index = ids.indexOf(id);
                        delete scope.fieldTable.selected_rows[id];
                        delete scope.formDataModel[scope.field.name][id];
                        scope.fieldTable.is_select_all = false;
                    });
                    ids.map((id) => {
                        let uid = id.replace(scope.field.name + '_', '');
                        scope.tableRows.splice(uid, 1);
                    });
                    setTimeout(() => $('#field-table-' + scope.field.name).trigger('child-table-remove-row'), 150);
                }
                scope.fieldTable.selected_ids = [];
                scope.$apply();
            });
        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            tableRows: '@',
            hideField: '=',
            hideLabel: '=',
            sizeSmall: '=',
            formDataModel: '='
        }
    }
}).directive("fieldHtml", function ($rootScope) {
    return {
        restrict: 'E',
        template: `
            <div class="form-field-text" ng-hide="hideField==true"> 
                <label for="{{field.name}}" ng-if="!hideLabel" class="form-control-label">{{ field.title }}</label>  
                <div ng-bind-html="ngModel"></div>
            </div>
        `,
        link: function (scope, element, attrs) {
            if (scope.field.default_value) {
                scope.ngModel = scope.field.default_value;
            }
        },
        scope: {
            field: '=',
            ngModel: '=ngModel',
            hideField: '=',
            readonlyField: '=',
            hideLabel: '=',
            sizeSmall: '=',
        }
    }
});
