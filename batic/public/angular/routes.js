/*
* App Routes
*/

function web_routes($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("dashboard");

    $stateProvider.state('app', {
        url: "/",
        redirectTo: 'app.dashboard',
        resolve: {
            user_info: function ($ocLazyLoad, $injector, $q, $state, $rootScope, AuthService) {
                if (!AuthService.isLoggedIn()) {
                    return $state.go('app.auth.login');
                }
                return $ocLazyLoad.load(load_service('userService')).then(function () {
                    return $injector.get('User').info();
                });
            }
        }
    }).state('app.dashboard', {
        url: "dashboard",
        title: baticApp.app.__lang('Dashboard'),
        controller: 'dashboardController',
        controllerAs: 'Ctrl',
        templateUrl: load_template('dashboard'),
        data: {
            requiresAuth: true
        },
        resolve: {
            loadMyCtrl: function ($ocLazyLoad) {
                return $ocLazyLoad.load(load_app_assets('vendors/js/charts/apexcharts.min.js')).then(function () {
                    return $ocLazyLoad.load(load_controller('dashboardController')).then(function () {
                        return $ocLazyLoad.load(load_views('dashboard'));
                    });
                });
            },
            api: function ($ocLazyLoad, $injector, $q, $stateParams, $rootScope) {
                return $ocLazyLoad.load(load_service('doctypeService')).then(function () {
                    console.log('$rootScope.app.user.info', $rootScope.app.user?.info)
                    return $q.all({
                        counts: $injector.get('Doctype').get_api('batic.cases.page.overview.overview.get_dashboard_status'),
                        chart_data: $injector.get('Doctype').get_api('batic.cases.page.overview.overview.get_chart_data'),
                        activity_log: $injector.get('Doctype').get_api('batic.cases.page.overview.overview.activity_log?page=1&limit=100')
                    });
                });
            }
        }
    }).state('app.workspace', {
        url: "workspaces/:workspace",
        title: baticApp.app.__lang('Workspace'),
        controller: 'workspaceController',
        controllerAs: 'Ctrl',
        templateUrl: load_template('workspace'),
        data: {
            requiresAuth: true
        },
        resolve: {
            loadMyCtrl: function ($ocLazyLoad) {
                return $ocLazyLoad.load(load_views('workspace')).then(function () {
                    return $ocLazyLoad.load([load_controller('workspaceController')]);
                });
            },
            workspace: function ($stateParams) {
                return $stateParams.workspace;
            },
            api: function ($ocLazyLoad, $injector, $q, $stateParams) {
                return $ocLazyLoad.load(load_service('desktopService')).then(function () {
                    return $q.all({
                        get_workspace: $injector.get('Desktop').get_workspace(capitalizeText($stateParams.workspace)),
                    });
                });
            }
        }
    }).state('app.page', {
        url: "page/:page",
        title: baticApp.app.__lang('Page'),
        controller: 'pageController',
        controllerAs: 'Ctrl',
        templateUrl: load_template('page'),
        data: {
            requiresAuth: true
        },
        resolve: {
            loadMyCtrl: function ($ocLazyLoad, $stateParams) {
                return $ocLazyLoad.load(load_service('doctypeService')).then(function () {
                    return $ocLazyLoad.load(load_views(`page/${$stateParams.page}`)).then(function () {
                        return $ocLazyLoad.load(load_plugins('air-datepicker/js/datepicker.min.js')).then(function () {
                            return $ocLazyLoad.load(load_plugins('air-datepicker/js/i18n/datepicker.en.js')).then(function () {
                                return $ocLazyLoad.load(load_plugins('air-datepicker/js/i18n/datepicker.ar.js')).then(function () {
                                    return $ocLazyLoad.load([
                                        load_controller('pageController')
                                    ]);
                                });
                            });
                        });
                    });
                });
            },
            page: function ($stateParams) {
                return $stateParams.page;
            },
        }
    }).state('app.list', {
        url: ":parent/:doctype/list",
        params: {
            parent: null,
            doctype: null,
        },
        title: baticApp.app.__lang('List'),
        controllerProvider: function ($stateParams) {
            return (["account"].includes($stateParams.doctype)) ? 'treeController' : 'listController';
        },
        controllerAs: 'Ctrl',
        templateProvider: function ($stateParams, $templateRequest) {
            return (["account"].includes($stateParams.doctype)) ? $templateRequest(load_template('tree')) : $templateRequest(load_template('list'));
        },
        data: {
            requiresAuth: true
        },
        resolve: {
            loadMyCtrl: function ($ocLazyLoad, $stateParams) {
                return $ocLazyLoad.load(load_views('workspace')).then(function () {
                    if (["account"].includes($stateParams.doctype)) {
                        return $ocLazyLoad.load(load_views('tree')).then(function () {
                            return $ocLazyLoad.load(load_plugins('jstree/jstree.js')).then(function () {
                                return $ocLazyLoad.load([
                                    load_controller('treeController'),
                                    load_assets('plugins/jstree/jstree.css')
                                ]);
                            });
                        });
                    } else {
                        return $ocLazyLoad.load(load_plugins('air-datepicker/js/datepicker.min.js')).then(function () {
                            return $ocLazyLoad.load(load_plugins('air-datepicker/js/i18n/datepicker.en.js')).then(function () {
                                return $ocLazyLoad.load(load_plugins('air-datepicker/js/i18n/datepicker.ar.js')).then(function () {
                                    return $ocLazyLoad.load([load_controller('listController')]);
                                });
                            });
                        });
                    }
                });
            },
            workspace: function ($stateParams) {
                return $stateParams.workspace;
            },
            parent: function ($stateParams) {
                return $stateParams.parent;
            },
            doctype: function ($stateParams) {
                return $stateParams.doctype;
            },
            api: function ($ocLazyLoad, $injector, $q, $stateParams) {
                return $ocLazyLoad.load(load_service('doctypeService')).then(function () {
                    if (["account"].includes($stateParams.doctype)) {
                        return $q.all({
                            companies: $injector.get('Doctype').get_list('Company', {}, ['company_name'])
                        });
                    } else {
                        return $q.all({
                            doctype: $injector.get('Doctype').get_doctype(capitalizeText($stateParams.doctype)),
                        });
                    }
                });
            }
        }
    }).state('app.form', {
        url: ":parent/:doctype/form/:type/:docname",
        params: {
            parent: null,
            doctype: null,
        },
        title: baticApp.app.__lang('Form'),
        controller: 'formController',
        controllerAs: 'Ctrl',
        templateProvider: function ($stateParams, $templateRequest) {
            return $templateRequest(load_template('form'));
        },
        data: {
            requiresAuth: true
        },
        resolve: {
            loadMyCtrl: function ($ocLazyLoad, $stateParams) {
                return $ocLazyLoad.load(load_plugins('air-datepicker/js/datepicker.min.js')).then(function () {
                    return $ocLazyLoad.load(load_plugins('air-datepicker/js/i18n/datepicker.en.js')).then(function () {
                        return $ocLazyLoad.load(load_plugins('air-datepicker/js/i18n/datepicker.ar.js')).then(function () {
                            return $ocLazyLoad.load(load_plugins('angular-fcsa-number/fcsaNumber.min.js')).then(function () {
                                return $ocLazyLoad.load(load_plugins('jquery-calendars/jquery.calendars.js')).then(function () {
                                    return $ocLazyLoad.load(load_plugins('jquery-calendars/jquery.calendars.plus.min.js')).then(function () {
                                        return $ocLazyLoad.load(load_plugins('jquery-calendars/jquery.plugin.min.js')).then(function () {
                                            return $ocLazyLoad.load(load_plugins('jquery-calendars/jquery.calendars.picker.js')).then(function () {
                                                return $ocLazyLoad.load(load_plugins('jquery-calendars/jquery.calendars.islamic.min.js')).then(function () {
                                                    return $ocLazyLoad.load(load_plugins('quill/quill.js')).then(function () {
                                                        return $ocLazyLoad.load(load_views(`form/${$stateParams.doctype}`)).then(function () {
                                                            return $ocLazyLoad.load(load_doctypes($stateParams.doctype)).then(function () {
                                                                return $ocLazyLoad.load([
                                                                    load_controller('formController'),
                                                                    load_plugins('quill/quill.snow.css')
                                                                ]);
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            },
            workspace: function ($stateParams) {
                return $stateParams.workspace;
            },
            parent: function ($stateParams) {
                return $stateParams.parent;
            },
            doctype: function ($stateParams) {
                return $stateParams.doctype;
            },
            docname: function ($stateParams) {
                return $stateParams.docname;
            },
            form_type: function ($stateParams) {
                return $stateParams.type;
            },
            load_data: function ($ocLazyLoad, $injector, $q, $stateParams) {
                let data = {}
                if ($stateParams.doctype == 'payment-entry' && $stateParams.type == 'new' && baticApp.create_payment_for_invoice && baticApp.create_payment_for_invoice.doctype && baticApp.create_payment_for_invoice.docname) {
                    data[$stateParams.doctype] = $injector.get('Doctype').get_payment_entry(capitalizeText(baticApp.create_payment_for_invoice.doctype), baticApp.create_payment_for_invoice.docname);
                    baticApp.create_payment_for_invoice = {};
                }
                if (($stateParams.doctype == 'sales-invoice' || $stateParams.doctype == 'purchase-invoice') && $stateParams.type == 'new' && baticApp.create_return_for_invoice && baticApp.create_return_for_invoice.doctype && baticApp.create_return_for_invoice.docname) {
                    let method = ($stateParams.doctype == 'sales-invoice') ? 'erpnext.accounts.doctype.sales_invoice.sales_invoice.make_sales_return' : 'erpnext.accounts.doctype.purchase_invoice.purchase_invoice.make_debit_note'
                    data[$stateParams.doctype] = $injector.get('Doctype').make_mapped_doc(method, baticApp.create_return_for_invoice.docname);
                    baticApp.create_return_for_invoice = {};
                }
                return $q.all(data);
            },
            api: function ($ocLazyLoad, $injector, $q, $stateParams) {
                return $ocLazyLoad.load(load_service('doctypeService')).then(function () {
                    return $q.all({
                        doctype: $injector.get('Doctype').get_doctype(capitalizeText($stateParams.doctype)),
                        doctype_print_format: ($stateParams.type == 'view' && $stateParams.docname.substring(0, 4) != "new-") ? $injector.get('Doctype').get_doctype_print_format(capitalizeText($stateParams.doctype)) : '',
                        docdata: ($stateParams.type == 'view' && $stateParams.docname.substring(0, 4) != "new-") ? $injector.get('Doctype').get_docinfo(capitalizeText($stateParams.doctype), $stateParams.docname) : {}
                    });
                });
            }
        }
    }).state('app.form.view', {
        url: "workspaces/:workspace/:doctype/form/:type/:docname",
        title: baticApp.app.__lang('View'),
        controller: 'viewController',
        controllerAs: 'Ctrl',
        templateUrl: load_template('view-form'),
        data: {
            requiresAuth: true
        },
        resolve: {
            loadMyCtrl: function ($ocLazyLoad, $stateParams) {
                return $ocLazyLoad.load(load_plugins('air-datepicker/js/datepicker.min.js')).then(function () {
                    return $ocLazyLoad.load(load_plugins('air-datepicker/js/i18n/datepicker.en.js')).then(function () {
                        return $ocLazyLoad.load(load_plugins('air-datepicker/js/i18n/datepicker.ar.js')).then(function () {
                            return $ocLazyLoad.load(load_plugins('angular-fcsa-number/fcsaNumber.min.js')).then(function () {
                                return $ocLazyLoad.load(load_plugins('summernote/summernote-bs4.min.js')).then(function () {
                                    return $ocLazyLoad.load(load_plugins('summernote/angular-summernote.min.js')).then(function () {
                                        return $ocLazyLoad.load(load_views('forms')).then(function () {
                                            return $ocLazyLoad.load([
                                                load_controller('formController'),
                                                load_plugins('summernote/summernote-bs4.min.css')
                                            ]);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            },
            workspace: function ($stateParams) {
                return $stateParams.workspace;
            },
            doctype: function ($stateParams) {
                return $stateParams.doctype;
            },
            form_type: function ($stateParams) {
                return $stateParams.type;
            },
            api: function ($ocLazyLoad, $injector, $q, $stateParams) {
                return $ocLazyLoad.load(load_service('doctypeService')).then(function () {
                    return $q.all({
                        doctype: $injector.get('Doctype').get_doctype(capitalizeText($stateParams.doctype))
                    });
                });
            }
        }
    }).state('app.report_view', {
        url: "reports/view/:report_name",
        title: baticApp.app.__lang('Report'),
        controller: 'reportController',
        controllerAs: 'Ctrl',
        templateProvider: function ($stateParams, $templateRequest) {
            return $templateRequest(load_template('report'));
        },
        data: {
            requiresAuth: true
        },
        resolve: {
            loadMyCtrl: function ($ocLazyLoad, $stateParams) {
                return $ocLazyLoad.load(load_plugins('air-datepicker/js/datepicker.min.js')).then(function () {
                    return $ocLazyLoad.load(load_plugins('air-datepicker/js/i18n/datepicker.en.js')).then(function () {
                        return $ocLazyLoad.load(load_plugins('air-datepicker/js/i18n/datepicker.ar.js')).then(function () {
                            return $ocLazyLoad.load(load_plugins('angular-fcsa-number/fcsaNumber.min.js')).then(function () {
                                return $ocLazyLoad.load(load_plugins('angularjs-dropdown-multiselect/angularjs-dropdown-multiselect.min.js')).then(function () {
                                    return $ocLazyLoad.load([load_controller('reportController')]);
                                });
                            });
                        });
                    });
                });
            },
            workspace: function ($stateParams) {
                return $stateParams.workspace;
            },
            report_name: function ($stateParams) {
                return $stateParams.report_name;
            },
            api: function ($ocLazyLoad, $injector, $q, $stateParams) {
                return $ocLazyLoad.load(load_service('doctypeService')).then(function () {
                    return $q.all({
                        // query_report_script: $injector.get('Doctype').query_report_script($stateParams.report_name),
                        get_report: $injector.get('Doctype').get_report($stateParams.report_name)
                    });
                });
            }
        }
    }).state('app.reports', {
        url: "reports",
        title: baticApp.app.__lang('Reports'),
        controller: 'reportsController',
        controllerAs: 'Ctrl',
        templateProvider: function ($stateParams, $templateRequest) {
            return $templateRequest(load_template('reports'));
        },
        data: {
            requiresAuth: true
        },
        resolve: {
            loadMyCtrl: function ($ocLazyLoad, $stateParams) {
                return $ocLazyLoad.load([load_controller('reportsController')]);
            },
            api: function ($ocLazyLoad, $injector, $q, $stateParams) {
                return $ocLazyLoad.load(load_service('desktopService'));
            }
        }
    }).state('app.setup', {
        url: "setup",
        title: baticApp.app.__lang('Setup'),
        controller: 'setupController',
        controllerAs: 'Ctrl',
        templateProvider: function ($stateParams, $templateRequest) {
            return $templateRequest(load_template('setup'));
        },
        data: {
            requiresAuth: true
        },
        resolve: {
            loadMyCtrl: function ($ocLazyLoad, $stateParams) {
                return $ocLazyLoad.load([load_controller('setupController')]);
            },
            api: function ($ocLazyLoad, $injector, $q, $stateParams) {
                return $ocLazyLoad.load(load_service('desktopService'));
            }
        }
    });


    /*
   * Auth
   */
    $stateProvider.state('app.auth', {
        url: "auth",
        redirectTo: 'app.auth.login',
        template: `<div class="card card-page full-height"><div class="card-body"><ui-view></ui-view></div></div>`
    }).state('app.auth.login', {
        url: "/login",
        title: baticApp.app.__lang('Login'),
        controller: 'authController',
        controllerAs: 'Ctrl',
        templateUrl: load_template('auth.login'),
        data: {
            requiresAuth: false
        },
        resolve: {
            loadMyCtrl: function ($ocLazyLoad) {
                return $ocLazyLoad.load(load_service('userService')).then(function () {
                    return $ocLazyLoad.load([
                        load_controller('authController'),
                        load_views('auth'),
                        load_assets('app-assets/css/pages/authentication.css', true)
                    ]);
                });
            },
            auth: function ($state, AuthService) {
                if (AuthService.isLoggedIn()) {
                    return $state.go('app.dashboard');
                }
            }
        }
    });


    /*
    * Errors
    */
    $stateProvider.state('app.errors', {
        url: "error",
        redirectTo: 'app.error.404',
        template: `<div class="card card-page full-height"><div class="card-body"><ui-view></ui-view></div></div>`,
        data: {
            requiresAuth: true
        },
        auth: function ($state, AuthService) {
            if (!AuthService.isLoggedIn()) {
                return $state.go('app.auth.login');
            }
        },
    }).state('app.errors.403', {
        url: "/403",
        title: baticApp.app.__lang('Forbidden'),
        template: `<div class="notfound">
                            <div class="notfound-404"></div>
                            <h1>403</h1>
                            <h2>${baticApp.app.__lang('Forbidden')}</h2>
                            <p>${__("You haven't permissions to access on this page")}</p>
                        </div>`,
        data: {
            requiresAuth: true
        }
    }).state('app.errors.404', {
        url: "/404",
        title: baticApp.app.__lang('Not Found'),
        template: `<div class="notfound">
                            <div class="notfound-404"></div>
                            <h1>404</h1>
                            <h2>${baticApp.app.__lang('Oops! Page Not Be Found')}</h2>
                            <p>${baticApp.app.__lang('Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable')}</p>
                        </div>`,
        data: {
            requiresAuth: true
        }
    });

}
