/*
* Angular App
* Abdo Hamoud (abdo.host@gmail.com)
* https://www.abdo-host.com
*/

const production = false;
const version = '1.0';
let build_version = (production) ? version : new Date().getTime();

angular.module('ngHtmlCompile', []).directive('ngHtmlCompile', function ($compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.ngHtmlCompile, function (newValue, oldValue) {
                element.html(newValue);
                $compile(element.contents())(scope);
            });
        }
    }
});

const baticNgApp = angular.module('baticNgApp', ['ui.router', 'ngStorage', 'oc.lazyLoad', 'ngSanitize', 'cp.ngConfirm', 'ngHtmlCompile']);

baticNgApp.config(function ($httpProvider, $locationProvider, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.headers.common['X-Frappe-CSRF-Token'] = frappe.csrf_token;
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push(function ($q, $location) {
        return {
            response: function (response) {
                if (response.data && response.data._server_messages)
                    frappe.msgprint((new Function('return ' + JSON.parse(response.data._server_messages)))());
                return response;
            },
            responseError: function (response) {
                if (response.status == 403 || response.status == 500) {
                    if (response.data && response.data._server_messages)
                        frappe.msgprint((new Function('return ' + JSON.parse(response.data._server_messages)))());
                    else
                        frappe.msgprint({message: response.data._error_message || response.data.exception, title: baticApp.app.__lang('Error {0}', [response.status]), indicator: 'red'});
                    return response;
                } else if (response.status == 422 || response.status == 417 || response.status == 409 || response.status == 404 || response.status == 401) {
                    if (response.data && response.data._server_messages)
                        frappe.msgprint((new Function('return ' + JSON.parse(response.data._server_messages)))());
                    else
                        frappe.msgprint({message: response.data._error_message || response.data.exception, title: baticApp.app.__lang('Error {0}', [response.status]), indicator: 'red'});
                    return response;
                }
            }
        };
    });
    web_routes($stateProvider, $urlRouterProvider);
});

baticNgApp.service('AuthService', function () {

    let isAuthenticated = (baticApp.user_session != 'Guest');

    this.login = function () {
        isAuthenticated = true;
    };

    this.logout = function () {
        isAuthenticated = false;
    };

    this.isLoggedIn = function () {
        return isAuthenticated;
    };
});

baticNgApp.run(function ($ngConfirmDefaults, $rootScope, $localStorage, $transitions, $state, $http, $timeout, $filter, $interval, AuthService) {

    $ngConfirmDefaults.theme = 'material';
    $ngConfirmDefaults.closeIcon = true;
    $rootScope.page_title = 'Batic';
    $rootScope.parent_title = '';
    $rootScope.parent_url = '';
    $rootScope.current_route = '';
    $rootScope.current_route_params = {};
    $rootScope.workspaces_icons = {
        'accounting': 'fal fa-file-invoice-dollar',
        'inventory': 'fal fa-warehouse-alt',
        'selling': 'fal fa-analytics',
        'purchase': 'fal fa-cart-arrow-down',
    };

    $rootScope.app = {
        version: version,
        active_lang: getCookie("preferred_language", "en"),
        lang_list: {
            en: {
                label: 'English',
                flag: 'flag-icon-us'
            },
            ar: {
                label: __('Arabic'),
                flag: 'flag-icon-sa'
            }
        },
        change_lang: function (lang = 'en') {
            frappe.call({
                method: "batic.api.change_language",
                args: {
                    currentLanguage: lang
                },
                callback: function (r) {
                    if (r.message) {
                        setCookie("preferred_language", lang, 30);
                        baticApp.clear_cache();
                    }
                }
            });
        },
        set_dark_mode: function (dark_mode = false) {
            $rootScope.$storage.dark_mode = dark_mode;
            frappe.call({
                method: "batic.api.set_dark_mode",
                args: {
                    dark_mode: (dark_mode) ? 1 : 0,
                },
                callback: function (response) {

                }
            });
        },
        user: {
            session: frappe.session,
            info: {}
        },
        workspaces: [],
        sideMenu: [],
        defaults: baticApp.boot.sysdefaults || {},
        datetime: {},
        get_currency_symbol: function () {
            return get_currency_symbol();
        },
        get_workspace_icon: function (workspace) {
            let icon = '';
            if (workspace && this.workspaces && this.workspaces.length) {
                let get_icon = this.workspaces.filter(w => w.name == capitalizeText(workspace.replace(/-/g, ' ')))[0];
                if (get_icon && get_icon.icon) {
                    icon = get_icon.icon;
                } else {
                    if ($rootScope.workspaces_icons[workspace] && $.trim($rootScope.workspaces_icons[workspace])) {
                        icon = $rootScope.workspaces_icons[workspace];
                    } else {
                        icon = 'fal fa-cog';
                    }
                }
            }
            return icon;
        },
        validate_link: (doctype, docname, fields) => {
            frappe.call({
                method: "frappe.client.validate_link",
                args: {
                    doctype: 'Company',
                    docname: form.company,
                    fields: ['cost_center'],
                },
                callback: function (response) {
                    if (response.message) {
                        form.cost_center = (response.message.cost_center) ? response.message.cost_center : '';
                        scope.$apply();
                    }
                }
            });
        },
        eval: function (code, context = {}) {
            let variable_names = Object.keys(context);
            let variables = Object.values(context);
            code = `let out = ${code}; return out`;
            try {
                let expression_function = new Function(...variable_names, code);
                return expression_function(...variables);
            } catch (error) {
                console.log('Error evaluating the following expression:'); // eslint-disable-line no-console
                console.error(code); // eslint-disable-line no-console
                throw error;
            }
        },
        in_list: function (list, item) {
            return list.includes(item);
        },
        logout: function () {
            frappe.call({
                method: "batic.api.change_language",
                args: {
                    currentLanguage: 'en'
                },
                callback: function (r) {
                    setCookie("preferred_language", 'en', 30);
                    $http.post(api_url('web_logout'), {}).then(function (response) {
                        window.location.assign("/law-app/auth/login");
                    });
                }
            });
        }
    };

    $rootScope.build_version = window._version_number;

    $rootScope.$storage = $localStorage.$default({
        dark_mode: false,
        active_doctype: {},
    });

    $rootScope.user_profile = {
        is_loading: false,
        errors: {},
        data: {},
        open() {
            $('#profileModal').modal('show');
            this.data.user_image = $rootScope.app.user.info.user_image;
            this.data.first_name = $rootScope.app.user.info.first_name;
            this.data.last_name = $rootScope.app.user.info.last_name;
            this.data.phone = $rootScope.app.user.info.phone;
            this.data.gender = $rootScope.app.user.info.gender;
        },
        change_photo() {
            new frappe.ui.FileUploader({
                doctype: "User",
                docname: frappe.session.user,
                folder: 'Home/Attachments',
                allow_multiple: false,
                restrictions: {
                    allowed_file_types: ["image/*"],
                },
                on_success: (file_doc) => {
                    $timeout(() => {
                        this.data.user_image = file_doc.file_url;
                    }, 100);
                }
            });
        },
        submit($event) {
            $event.preventDefault();
            this.is_loading = true;
            if (this.data.password && this.data.password.length) {
                if (this.data.password.length < 6) {
                    this.errors.password = $rootScope.__lang('Password must be equal or greater than 6 char');
                    this.is_loading = false;
                    return false;
                } else {
                    if (this.data.password !== this.data.confirm_password) {
                        this.errors.confirm_password = $rootScope.__lang("Confirm password didn't match");
                        this.is_loading = false;
                        return false;
                    }
                }
                $http.post(frappe_api_url('batic.api.update_doc'),
                    {
                        doctype: "User",
                        docname: frappe.session.user,
                        new_values: this.data
                    }
                ).then(() => {
                    $http.post(frappe_api_url('batic.api.update_user_password'),
                        {
                            name: frappe.session.user,
                            password: this.data.password
                        }
                    ).then((response) => {
                        if (response.status === 200) {
                            window.location.reload();
                        } else {
                            this.is_loading = false;
                        }
                    });
                });
            } else {
                $http.post(frappe_api_url('batic.api.update_doc'),
                    {
                        doctype: "User",
                        docname: frappe.session.user,
                        new_values: this.data
                    }
                ).then(function (response) {
                    if (response.status === 200) {
                        window.location.reload();
                    } else {
                        this.is_loading = false;
                    }
                });
            }

        }
    };

    $rootScope.is_rtl = baticApp.is_rtl

    $rootScope.$extend = function (object, another_object) {
        return angular.extend(object, another_object);
    }

    $rootScope.splitLines = function (string) {
        return string.split(/\r\n|\r|\n/);
    }

    // Datetime
    $rootScope.app.defaults.defaultDatetimeFormat = $rootScope.app.defaults.date_format + " " + $rootScope.app.defaults.time_format;
    // moment.defaultFormat = $rootScope.app.defaults.date_format;

    $.extend($rootScope.app.datetime, {
        convert_to_user_tz: function (date, format) {
            // format defaults to true
            if ($rootScope.app.defaults.time_zone) {
                var date_obj = moment.tz(date, $rootScope.app.defaults.time_zone).local();
            } else {
                var date_obj = moment(date);
            }

            return (format === false) ? date_obj : date_obj.format($rootScope.app.defaults.defaultDatetimeFormat);
        },

        convert_to_system_tz: function (date, format) {
            // format defaults to true

            if ($rootScope.app.defaults.time_zone) {
                var date_obj = moment(date).tz($rootScope.app.defaults.time_zone);
            } else {
                var date_obj = moment(date);
            }

            return (format === false) ? date_obj : date_obj.format($rootScope.app.defaults.defaultDatetimeFormat);
        },

        is_timezone_same: function () {
            if ($rootScope.app.defaults.time_zone) {
                return moment().tz($rootScope.app.defaults.time_zone).utcOffset() === moment().utcOffset();
            } else {
                return true;
            }
        },

        str_to_obj: function (d) {
            return moment(d, $rootScope.app.defaults.defaultDatetimeFormat)._d;
        },

        obj_to_str: function (d) {
            return moment(d).locale("en").format();
        },

        obj_to_user: function (d) {
            return moment(d).format($rootScope.app.datetime.get_user_date_fmt().toUpperCase());
        },

        get_diff: function (d1, d2) {
            return moment(d1).diff(d2, "days");
        },

        get_hour_diff: function (d1, d2) {
            return moment(d1).diff(d2, "hours");
        },

        get_day_diff: function (d1, d2) {
            return moment(d1).diff(d2, "days");
        },

        add_days: function (d, days) {
            return moment(d).add(days, "days").format();
        },

        add_months: function (d, months) {
            return moment(d).add(months, "months").format();
        },

        week_start: function () {
            return moment().startOf("week").format();
        },

        week_end: function () {
            return moment().endOf("week").format();
        },

        month_start: function () {
            return moment().startOf("month").format();
        },

        month_end: function () {
            return moment().endOf("month").format();
        },

        quarter_start: function () {
            return moment().startOf("quarter").format();
        },

        quarter_end: function () {
            return moment().endOf("quarter").format();
        },

        year_start: function () {
            return moment().startOf("year").format();
        },

        year_end: function () {
            return moment().endOf("year").format();
        },

        get_user_time_fmt: function () {
            return $rootScope.app.defaults && $rootScope.app.defaults.time_format || "HH:mm:ss";
        },

        get_user_date_fmt: function () {
            return $rootScope.app.defaults && $rootScope.app.defaults.date_format || "yyyy-mm-dd";
        },

        get_user_fmt: function () {  // For backwards compatibility only
            return $rootScope.app.defaults && $rootScope.app.defaults.date_format || "yyyy-mm-dd";
        },

        str_to_user: function (val, only_time = false) {
            if (!val) return "";
            var user_time_fmt = $rootScope.app.datetime.get_user_time_fmt();
            if (only_time) {
                return moment(val, $rootScope.app.defaults.time_format).format(user_time_fmt);
            }
            var user_date_fmt = $rootScope.app.datetime.get_user_date_fmt().toUpperCase();
            if (typeof val !== "string" || val.indexOf(" ") === -1) {
                return moment(val).format(user_date_fmt);
            } else {
                return moment(val, "YYYY-MM-DD HH:mm:ss").format(user_date_fmt + " " + user_time_fmt);
            }
        },

        get_datetime_as_string: function (d) {
            return moment(d).format("YYYY-MM-DD HH:mm:ss");
        },

        user_to_str: function (val, only_time = false) {
            var user_time_fmt = $rootScope.app.datetime.get_user_time_fmt();
            if (only_time) {
                return moment(val, user_time_fmt).format($rootScope.app.defaults.time_format);
            }
            var user_fmt = $rootScope.app.datetime.get_user_date_fmt().toUpperCase();
            var system_fmt = "YYYY-MM-DD";
            if (val.indexOf(" ") !== -1) {
                user_fmt += " " + user_time_fmt;
                system_fmt += " HH:mm:ss";
            }
            // user_fmt.replace("YYYY", "YY")? user might only input 2 digits of the year, which should also be parsed
            return moment(val, [user_fmt.replace("YYYY", "YY"), user_fmt]).locale("en").format(system_fmt);
        },

        user_to_obj: function (d) {
            return $rootScope.app.datetime.str_to_obj($rootScope.app.datetime.user_to_str(d));
        },

        global_date_format: function (d) {
            var m = moment(d);
            if (m._f && m._f.indexOf("HH") !== -1) {
                return m.format("Do MMMM YYYY, h:mma")
            } else {
                return m.format('Do MMMM YYYY');
            }
        },

        now_date: function (as_obj = false) {
            return $rootScope.app.datetime._date($rootScope.app.defaults.date_format, as_obj);
        },

        now_time: function (as_obj = false) {
            return $rootScope.app.datetime._date($rootScope.app.defaults.time_format, as_obj);
        },

        now_datetime: function (as_obj = false) {
            return $rootScope.app.datetime._date($rootScope.app.defaults.defaultDatetimeFormat, as_obj);
        },

        _date: function (format, as_obj = false, add_months = 0, add_days = 0) {
            const time_zone = $rootScope.app.defaults && $rootScope.app.defaults.time_zone;
            let date;
            if (time_zone) {
                date = moment.tz(time_zone);
            } else {
                date = moment();
            }
            if (add_months >= 1)
                date.add(add_months, "months");
            if (add_days >= 1)
                date.add(add_days, "days");
            if (as_obj) {
                return $rootScope.app.datetime.moment_to_date_obj(date);
            } else {
                return date.format(format);
            }
        },

        moment_to_date_obj: function (moment) {
            const date_obj = new Date();
            const date_array = moment.toArray();
            date_obj.setFullYear(date_array[0]);
            date_obj.setMonth(date_array[1]);
            date_obj.setDate(date_array[2]);
            date_obj.setHours(date_array[3]);
            date_obj.setMinutes(date_array[4]);
            date_obj.setSeconds(date_array[5]);
            date_obj.setMilliseconds(date_array[6]);
            return date_obj;
        },

        nowdate: function () {
            return $rootScope.app.datetime.now_date();
        },

        get_today: function () {
            return $rootScope.app.datetime.now_date();
        },

        get_time: (timestamp) => {
            // return time with AM/PM
            return moment(timestamp).format('hh:mm A');
        },

        validate: function (d) {
            return moment(d, [
                $rootScope.app.defaults.date_format,
                $rootScope.app.defaults.defaultDatetimeFormat,
                $rootScope.app.defaults.time_format
            ], true).isValid();
        },

    });

    $.extend(baticApp.app, $rootScope.app);

    $rootScope.convertToSlug = function (text) {
        return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    $rootScope.page_template = function (page) {
        return load_template(`pages/${page}`)
    }

    $rootScope.list_get_indicator_html = function (doc, doctype, show_workflow_state = '') {
        const indicator = frappe.get_indicator(doc, capitalizeText(doctype), show_workflow_state);

        // console.log('indicator---doc', doc)
        // console.log('indicator---doctype', doctype)
        // console.log('indicator---show_workflow_state', show_workflow_state)
        // console.log('indicator---indicator', indicator)

        // sequence is important
        const docstatus_description = [
            __("Document is in draft state"),
            __("Document has been submitted"),
            __("Document has been cancelled"),
        ];
        const title = docstatus_description[doc.docstatus || 0];
        if (indicator) {
            return `<span class="indicator-pill ${
                indicator[1]
            } filterable no-indicator-dot ellipsis"
				data-filter='${indicator[2]}' title='${title}'>
				<span class="ellipsis"> ${__(indicator[0])}</span>
			</span>`;
        }
        return null;
    }

    $rootScope.replace_route_attr = function (route, ...attrs) {
        let variables = {};
        const interpolate_route = (string, values) => string.replace(/{(.*?)}/g, (match, offset) => values[offset]);
        let string_route = ''
        attrs.map(attr => {
            attr = attr.split(':');
            variables[attr[0]] = attr[1];
        });
        string_route = interpolate_route(route, variables);
        return string_route;
    };

    $rootScope.array_search = function (array, key, value) {
        return array.filter(obj => obj[key] == value)[0];
    };

    $rootScope.__lang = function (text, replace) {
        let messages = (baticApp.boot && baticApp.boot.__messages) ? baticApp.boot.__messages : {};
        let string = (messages[text] && $.trim(messages[text])) ? messages[text] : text;
        if (replace && typeof replace === "object") {
            string = $rootScope.format(string, replace);
        }
        return string;
    };

    $rootScope.format = function (str, args) {
        if (str == undefined) return str;
        this.unkeyed_index = 0;
        return str.replace(/\{(\w*)\}/g, function (match, key) {
            if (key === '') {
                key = this.unkeyed_index;
                this.unkeyed_index++
            }
            if (key == +key) {
                return args[key] !== undefined
                    ? args[key]
                    : match;
            }
        }.bind(this));
    }

    $rootScope.modal_dialog = {
        title: $rootScope.__lang('Message'), content: [], color: 'blue', size: 'medium', position: 'top', show: function () {
            $('#appModal').modal('show');
        }, hide: function () {
            $('#appModal').modal('hide');
        }
    };

    $rootScope.show_modal_dialog = (title, content, color = 'blue', size = 'medium', position = 'top') => {
        $rootScope.modal_dialog.title = title;
        $rootScope.modal_dialog.content = content;
        $rootScope.modal_dialog.color = color;
        $rootScope.modal_dialog.size = size;
        $rootScope.modal_dialog.position = position;
        $rootScope.modal_dialog.show();
    };

    $rootScope.view_doctype = function (state, workspace, doctype, data) {
        $rootScope.activeDoctype = doctype;
        switch (doctype) {
            case 'customer':
                state.transitionTo('app.form', {parent: workspace, doctype: doctype, type: 'view', docname: data.customer_name});
                break;
            case 'supplier':
                state.transitionTo('app.form', {parent: workspace, doctype: doctype, type: 'view', docname: data.supplier_name});
                break;
            default:
                state.transitionTo('app.form', {parent: workspace, doctype: doctype, type: 'view', docname: data.name});
                break;
        }
    }

    $rootScope.getTextFromHTML = function (htmlString, limit = 30) {
        let tempElement = document.createElement("div");
        tempElement.innerHTML = htmlString;
        let textContent = tempElement.textContent || tempElement.innerText || "";
        if (limit && textContent.length > limit) {
            textContent = textContent.substring(0, limit) + "...";
        }
        return textContent;
    }

    $rootScope.tableLang = {
        en: {}, ar: {
            "sProcessing": "جارٍ التحميل...",
            "sLengthMenu": "أظهر _MENU_ مدخلات",
            "sZeroRecords": "لم يعثر على أية سجلات",
            "sInfo": "إظهار _START_ إلى _END_ من أصل _TOTAL_ مدخل",
            "sInfoEmpty": "يعرض 0 إلى 0 من أصل 0 سجل",
            "sInfoFiltered": "(منتقاة من مجموع _MAX_ مُدخل)",
            "sInfoPostFix": "", "sSearch": "ابحث:",
            "sUrl": "", "oPaginate": {
                "sFirst": "الأول",
                "sPrevious": "السابق",
                "sNext": "التالي",
                "sLast": "الأخير"
            }
        }
    };

    $rootScope.parse_date = function (date, format = 'dd-MM-yyyy') {
        return $filter('date')(new Date(Date.parse(date)), format);
    };

    $rootScope.date_time_ago = function (date, show_date = false, format = 'DD-MM-YYYY') {
        return frappe.datetime.prettyDate(frappe.datetime.convert_to_user_tz(date), true);
    };

    $rootScope.time_ago = function (date, days = 1, format = 'DD-MM-yyyy') {
        let one_day = moment().subtract(days, 'd');
        return moment(date).startOf('second').fromNow();
        if (moment(date).isBefore(one_day)) {
            return moment(date).format(format);
        } else {
        }
    };

    $rootScope.file_size_format = function (size = 0) {
        let file_size_ext = ['Bytes', 'KB', 'MB', 'GB'], i = 0;
        while (size > 900) {
            size /= 1024;
            i++;
        }
        return (Math.round(size * 100) / 100) + file_size_ext[i];
    }

    $rootScope.taskTimer = {
        is_active: false,
        timer: '00:00:00',
        spend_time: '0:00:00',
        start_timer: undefined,
        is_pause: false,
        startTimeInSeconds: 0,
        selected_task: '',
        selected_task_description: '',
        data: {},
        errors: {},
        open() {
            $('#taskTimerModal').modal('show');
        },
        start() {
            this.startTimeInSeconds = this.timeToSeconds(this.spend_time);
            this.is_active = true;
            this.is_pause = false;
            this.updateTimer();
            //cases.page.overview.overview.vue_addWorkTime
            $http.post(frappe_api_url('batic.cases.page.overview.overview.vue_addWorkTime'), {
                dialog_data: {
                    case_task: this.selected_task,
                    description: this.selected_task_description
                },
                user: baticApp.user_session,
                timeZone: baticApp.boot.time_zone?.user || baticApp.boot.time_zone?.system
            }).then(({data: {message}}) => {
                frappe.show_alert({message: baticApp.app.__lang("Task work time started"), indicator: 'green'});
                this.start_timer = $interval(() => {
                    if (!this.is_pause) {
                        this.startTimeInSeconds++;
                        this.updateTimer();
                    }
                }, 1000);
            });
            // $('#taskTimerModal').modal('hide');
        },
        pause() {
            $http.post(frappe_api_url('batic.cases.page.overview.overview.vue_pauseWorkTime'), {
                user: baticApp.user_session,
                timeZone: baticApp.boot.time_zone?.user || baticApp.boot.time_zone?.system
            }).then(({data: {message}}) => {
                frappe.show_alert({message: baticApp.app.__lang("Task work time pause"), indicator: 'orange'});
            });
            this.is_pause = true;
        },
        resume() {
            $http.post(frappe_api_url('batic.cases.page.overview.overview.vue_resumeWorkTime'), {
                user: baticApp.user_session,
                timeZone: baticApp.boot.time_zone?.user || baticApp.boot.time_zone?.system
            }).then(({data: {message}}) => {
                frappe.show_alert({message: baticApp.app.__lang("Task work time resume"), indicator: 'blue'});
            });
            this.is_pause = false;
        },
        stop() {
            if (!$.trim(this.selected_task_description)) {
                this.errors.selected_task_description = $rootScope.__lang('Must add a description before end task');
                $('#taskTimer-selected_task_description').addClass('animate__shakeX')
                $timeout(() => {
                    $('#taskTimer-selected_task_description').removeClass('animate__shakeX')
                }, 800);
            } else {
                this.is_pause = true;
                this.is_active = false;
                $interval.cancel(this.start_timer);
                //vue_endWorkTime
                $http.post(frappe_api_url('batic.cases.page.overview.overview.vue_endWorkTime'), {
                    user: baticApp.user_session,
                    timeZone: baticApp.boot.time_zone?.user || baticApp.boot.time_zone?.system
                }).then(({data: {message}}) => {
                    frappe.show_alert({message: baticApp.app.__lang("Task work time has been ended"), indicator: 'green'});
                    this.errors.selected_task_description = null;
                    this.selected_task = '';
                    this.selected_task_description = '';
                    $http.post(frappe_api_url('batic.cases.page.overview.overview.vue_reactiveWorkTimeList'), {
                        user: baticApp.user_session,
                    }).then(({data: {message}}) => {
                        $rootScope.reactiveWorkTimeList = message;
                    });
                });
            }
        },
        save() {
            if (!$.trim(this.selected_task_description)) {
                this.errors.selected_task_description = $rootScope.__lang('Must add a description for the task before save');
                $('#taskTimer-selected_task_description').addClass('animate__shakeX')
                $timeout(() => {
                    $('#taskTimer-selected_task_description').removeClass('animate__shakeX')
                }, 800);
            } else {
                this.errors.selected_task_description = null;
                $http.post(frappe_api_url('batic.cases.page.overview.overview.vue_editCurrentWorkTimeData'), {
                    dialog_data: {
                        case_task: this.selected_task,
                        description: this.selected_task_description
                    },
                    user: baticApp.user_session,
                    timeZone: baticApp.boot.time_zone?.user || baticApp.boot.time_zone?.system
                }).then(({data: {message}}) => {
                    frappe.show_alert({message: baticApp.app.__lang("Task description updated"), indicator: 'green'});
                });
            }
            //animate__animated animate__shakeX animate__fast
        },
        reactive(task) {
            $http.post(frappe_api_url('batic.cases.page.overview.overview.vue_reactiveWorkTime'), {
                user: baticApp.user_session,
                timeZone: baticApp.boot.time_zone?.user || baticApp.boot.time_zone?.system,
                worktimeDoc: task.name,
            }).then(({data: {message}}) => {
                $timeout(() => {
                    this.spend_time = task.spend_session_time;
                    this.selected_task = task.task;
                    this.selected_task_description = task.description;
                    this.start();
                }, 10);
            });
        },
        updateTimer() {
            let remainingSeconds = this.startTimeInSeconds % 3600;
            this.data.hours = Math.floor(this.startTimeInSeconds / 3600);
            this.data.minutes = Math.floor(remainingSeconds / 60);
            this.data.seconds = remainingSeconds % 60;
            // Pad with leading zeros if necessary
            this.data.hours = this.data.hours < 10 ? '0' + this.data.hours : this.data.hours;
            this.data.minutes = this.data.minutes < 10 ? '0' + this.data.minutes : this.data.minutes;
            this.data.seconds = this.data.seconds < 10 ? '0' + this.data.seconds : this.data.seconds;
        },
        timeToSeconds(timeString) {
            let timeParts = timeString.split(":");
            let hours = parseInt(timeParts[0]);
            let minutes = parseInt(timeParts[1]);
            let seconds = parseInt(timeParts[2]);
            return (hours * 3600) + (minutes * 60) + seconds;
        }
    }

    $transitions.onStart({}, function (transition) {
        const current = transition.$to();
        let requiresAuth = transition.to().data && transition.to().data.requiresAuth;
        if (requiresAuth && AuthService.isLoggedIn()) {
            // $state.target('app.dashboard');
            NProgress.start();
        }
    });

    $transitions.onEnter({}, function (transition, state) {
        if ($('.wrapper').hasClass('mobile-menu-open')) {
            $('.wrapper').removeClass('mobile-menu-open');
            $('.page-sidebar-overlay').fadeOut();
            if ($('body').hasClass('body-rtl-style')) {
                $('.page-sidebar').fadeOut().css('right', '-260px');
            } else {
                $('.page-sidebar').fadeOut().css('left', '-260px');
            }
        }
    });

    $transitions.onSuccess({}, function (transition) {
        const current = transition.$to();
        $rootScope.page_title = `Batic - ${current.self?.title}` || 'Batic';
        $rootScope.parent_title = (current.self.parent_title && current.self.parent_title.length) ? current.self.parent_title : '';
        $rootScope.parent_url = (current.self.parent_url && current.self.parent_url.length) ? current.self.parent_url : '';
        $rootScope.current_route = current.name;
        $rootScope.current_route_params = transition.params();
        baticApp.app.get_route = () => {
            return transition.params();
        }
        if (AuthService.isLoggedIn()) {
            let params = transition.params();
            if (transition.injector().get('user_info') && transition.injector().get('user_info').data && transition.injector().get('user_info').data.message)
                $rootScope.app.user.info = transition.injector().get('user_info').data.message
            $rootScope.app.workspaces = baticApp?.workspaces || [];
            $rootScope.app.sideMenu = baticApp?.sideMenu || [];
            $timeout(() => {
                sideMenuInit();
                $('.window-loader').hide();
            }, 300);
            $rootScope.activeDoctype = params.doctype;
            NProgress.done();
        } else {
            $timeout(() => $('.window-loader').hide(), 100);
            NProgress.done();
        }
        $timeout(() => {
            $('.main-menu.menu-light .navigation > li > ul li:not(.has-sub).active').each(function () {
                if (!$(this).parent().prev().parent().hasClass('open'))
                    $(this).parent().prev().parent().addClass('open')
            })
        }, 1000);
        if (baticApp.user_session != 'Guest') {
            $http.post(frappe_api_url('batic.cases.page.overview.overview.vue_CheckLastWorkTimeStillContinue'), {
                user: baticApp.user_session,
                timeZone: baticApp.boot.time_zone?.user || baticApp.boot.time_zone?.system
            }).then(({data: {message}}) => {
                if ($rootScope.app.user.info && $rootScope.app.user.info.employee_data && $rootScope.app.user.info.employee_data.name) {
                    $http.post(frappe_api_url('batic.cases.page.overview.overview.task_custom_list'), {
                        employee_id: $rootScope.app.user.info.employee_data.name,
                    }).then(({data: {message}}) => {
                        $rootScope.employee_task_list = message;
                    });
                }
                $rootScope.CheckLastWorkTime = message;
                if (message && message.on_work) {
                    $rootScope.taskTimer.spend_time = $rootScope.CheckLastWorkTime.spend_time;
                    $rootScope.taskTimer.startTimeInSeconds = $rootScope.taskTimer.timeToSeconds($rootScope.taskTimer.spend_time);
                    $rootScope.taskTimer.is_active = true;
                    $rootScope.taskTimer.is_pause = ($rootScope.CheckLastWorkTime.status === 'Pause');
                    $rootScope.taskTimer.selected_task = $rootScope.CheckLastWorkTime.worktime.task;
                    $rootScope.taskTimer.selected_task_description = $rootScope.CheckLastWorkTime.worktime.description;
                    $rootScope.taskTimer.updateTimer();
                    $rootScope.taskTimer.start_timer = $interval(() => {
                        if (!$rootScope.taskTimer.is_pause) {
                            $rootScope.taskTimer.startTimeInSeconds++;
                            $rootScope.taskTimer.updateTimer();
                        }
                    }, 1000);
                } else {
                    if ($rootScope.app.user.info && $rootScope.app.user.info.employee_data && $rootScope.app.user.info.employee_data.name) {
                        $http.post(frappe_api_url('batic.cases.page.overview.overview.vue_reactiveWorkTimeList'), {
                            user: baticApp.user_session,
                        }).then(({data: {message}}) => {
                            $rootScope.reactiveWorkTimeList = message;
                        });
                    }
                }
            });
        }
    });

    $rootScope.active_route = function (routes) {
        return (routes.includes($rootScope.current_route)) ? 'active' : '';
    }

    $rootScope.active_sub_route = function (name, value, doctype = '') {

        if (value && $rootScope.current_route_params && $rootScope.current_route_params[name]) {
            if (value.constructor === Array) {
                return (value.replace(/\s+/g, '-').toLowerCase().includes($rootScope.current_route_params[name].replace(/\s+/g, '-').toLowerCase())) ? 'sidebar-group-active open' : '';
            } else {
                if ($rootScope.current_route_params[name] == 'core-data') {
                    return ($rootScope.current_route_params['doctype'].replace(/\s+/g, '-').toLowerCase() == doctype.replace(/\s+/g, '-').toLowerCase()) ? 'active' : '';
                }
                if (!$rootScope.current_route_params[name] != 'core-data')
                    return ($rootScope.current_route_params[name].replace(/\s+/g, '-').toLowerCase() == value.replace(/\s+/g, '-').toLowerCase()) ? 'sidebar-group-active open' : '';
            }
        } else {
            if ($rootScope.current_route_params['page']) {
                return ($rootScope.current_route_params['page'] == value.replace(/\s+/g, '-').toLowerCase()) ? 'active' : ''
            }
        }
    }

    $rootScope.getChanges = function (oldArray, newArray) {
        let changes, i, item, j, len;
        if (JSON.stringify(oldArray) === JSON.stringify(newArray)) {
            return false;
        }
        changes = [];
        for (i = j = 0, len = newArray.length; j < len; i = ++j) {
            item = newArray[i];
            if (JSON.stringify(item) !== JSON.stringify(oldArray[i])) {
                changes.push(item);
            }
        }
        return changes;
    };

    $rootScope.buildRequestStringData = function (form) {
        let values = {};
        let inputs = $('input, select', form);
        inputs.each(function () {
            values[this.id] = $(this).val();
        });
        return values
    }

    $rootScope.get_filter_description = function (_filters, doctype) {
        let filter_array = [];
        let meta = null;

        if (!_filters || _filters == '{}')
            return null;
        try {
            filters = JSON.parse(_filters);
        } catch (e) {
            return null;
        }

        // convert object style to array
        if (!Array.isArray(filters)) {
            for (let fieldname in filters) {
                let value = filters[fieldname];
                if (!Array.isArray(value)) {
                    value = ["=", value];
                }
                filter_array.push([fieldname, ...value]); // fieldname, operator, value
            }
        } else {
            filter_array = filters;
        }

        // add doctype if missing
        filter_array = filter_array.map((filter) => {
            if (filter.length === 3) {
                return [doctype, ...filter]; // doctype, fieldname, operator, value
            }
            return filter;
        });

        function get_filter_description(filter) {
            let doctype = filter[0];
            let fieldname = filter[1];
            let docfield = frappe.meta.get_docfield(doctype, fieldname);
            let label = docfield ? docfield.label : frappe.model.unscrub(fieldname);

            if (docfield && docfield.fieldtype === "Check") {
                filter[3] = filter[3] ? __("Yes") : __("No");
            }

            if (filter[3] && Array.isArray(filter[3]) && filter[3].length > 5) {
                filter[3] = filter[3].slice(0, 5);
                filter[3].push("...");
            }

            let value = filter[3] == null || filter[3] === "" ? __("empty") : String(filter[3]);

            return [__(label).bold(), filter[2], value.bold()].join(" ");
        }

        let filter_string = filter_array.map(get_filter_description).join(", ");

        return __("Filters applied for {0}", [filter_string]);
    }

    // run datepicker
    $(document).on('focus', '[data-toggle="datepicker"]', function () {
        if ($('[data-toggle="datepicker"]').length && $.isFunction($.fn.datepicker) && !$(this).prop('readonly')) {
            let $input = $(this);
            let value = $input.val();
            let full_date_time = $input.data('full-date-time');
            let lang = 'en'
            if (!$.fn.datepicker.language[lang]) {
                lang = 'en';
            }
            let date_format = $rootScope.app.defaults && $rootScope.app.defaults.date_format ? $rootScope.app.defaults.date_format : 'yyyy-mm-dd';
            let now_date = new Date();
            let datepicker = $input.data('datepicker');
            if (!datepicker) {
                $input.datepicker({
                    language: lang,
                    dateFormat: 'yyyy-mm-dd',
                    startDate: now_date,
                    autoClose: true,
                    todayButton: true,
                    keyboardNav: false,
                    onSelect: (date) => {
                        $input.trigger('input');
                    },
                    onShow: () => {
                        $input.data('datepicker').$datepicker.find('.datepicker--button:visible').text($rootScope.__lang('Today'));
                        $input.data('datepicker').$datepicker.find('[data-action="today"]').click(() => {
                            $input.data('datepicker').selectDate($rootScope.app.datetime.now_date(true));
                        });
                    }
                });
            }
        }
    });

    //hijri-datepicker
    $(document).on('focus', '[data-toggle="hijri-datepicker"]', function () {
        if ($('[data-toggle="hijri-datepicker"]').length && $.isFunction($.fn.calendarsPicker) && !$(this).prop('readonly')) {
            let $input = $(this);
            let value = $input.val();
            $input.calendarsPicker({
                calendar: $.calendars.instance('islamic'),
                showOtherMonths: true,
                // showOtherYears: false,
                // selectOtherYears: false,
                dateFormat: "yyyy-mm-dd",
                onSelect: function (date) {
                    // alert('You picked ' + date[0].formatDate());
                    $input.trigger('input');
                }
            });
        }
    });
    // run datepicker
    $(document).on('focus', '[data-toggle="datetimepicker"]', function () {
        console.log($(this).prop('readonly'))
        if ($('[data-toggle="datetimepicker"]').length && $.isFunction($.fn.datepicker) && !$(this).prop('readonly')) {
            let $input = $(this);
            let value = $input.val();
            let full_date_time = $input.data('full-date-time');
            let lang = 'en'
            if (!$.fn.datepicker.language[lang]) {
                lang = 'en';
            }
            let date_format = $rootScope.app.defaults && $rootScope.app.defaults.date_format ? $rootScope.app.defaults.date_format : 'yyyy-mm-dd';
            let time_format = $rootScope.app.defaults && $rootScope.app.defaults.time_format ? $rootScope.app.defaults.time_format : 'HH:mm:ss';
            let now_date = new Date();
            let datepicker = $input.data('datepicker');
            if (!datepicker) {
                $input.datepicker({
                    language: lang,
                    timepicker: true,
                    dateFormat: 'yyyy-mm-dd',
                    timeFormat: time_format.toLowerCase().replace("mm", "ii"),
                    startDate: now_date,
                    autoClose: true,
                    todayButton: true,
                    keyboardNav: false,
                    onSelect: (date) => {
                        $input.trigger('input');
                    },
                    onShow: () => {
                        $input.data('datepicker').$datepicker.find('.datepicker--button:visible').text($rootScope.__lang('Today'));
                        $input.data('datepicker').$datepicker.find('[data-action="today"]').click(() => {
                            $input.data('datepicker').selectDate($rootScope.app.datetime.now_date(true));
                        });
                    }
                });
            }
        }
    });

    // run timepicker
    $(document).on('focus', '[data-toggle="timepicker"]', function () {
        if ($('[data-toggle="timepicker"]').length && $.isFunction($.fn.datepicker) && !$(this).prop('readonly')) {
            let $input = $(this);
            let value = $input.val();
            let full_date_time = $input.data('full-date-time');
            let lang = 'en'
            if (!$.fn.datepicker.language[lang]) {
                lang = 'en';
            }
            let time_format = $rootScope.app.defaults && $rootScope.app.defaults.time_format ? $rootScope.app.defaults.time_format : 'HH:mm:ss';
            let datepicker = $input.data('datepicker');
            if (!datepicker) {
                $input.datepicker({
                    language: lang,
                    timepicker: true,
                    onlyTimepicker: true,
                    timeFormat: time_format.toLowerCase().replace("mm", "ii"),
                    startDate: (full_date_time && full_date_time.length) ? new Date(full_date_time) : $rootScope.app.datetime.now_time(true),
                    autoClose: true,
                    todayButton: true,
                    keyboardNav: false,
                    onSelect: (date) => {
                        $input.trigger('input');
                    },
                    onShow: () => {
                        $input.data('datepicker').$datepicker.find('.datepicker--button:visible').text($rootScope.__lang('Now'));
                        $input.data('datepicker').$datepicker.find('[data-action="today"]').click(() => {
                            $input.data('datepicker').selectDate($rootScope.app.datetime.now_time(true));
                        });
                    }
                });
            }
        }
    });

    angular.element(document).ready(function () {

    });

}).filter('docTypeTitle', function () {
    return function (input) {
        return (input && input.length) ? capitalizeText(input.replace(/-/g, ' ')) : '';
    }
}).filter('sprintf', function () {
    function parse(str) {
        let args = [].slice.call(arguments, 1), i = 0;
        return str.replace(/%s/g, function () {
            return args[i++];
        });
    }

    return function (str) {
        return parse(str, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    };
}).filter('startFrom', function () {
    return function (input, start) {
        start = +start;
        if (input && input.length)
            return input.slice(start);
    }
}).filter('range', function () {
    return function (n) {
        let res = [];
        for (let i = 1; i <= n; i++) {
            res.push(i);
        }
        return res;
    };
}).filter('dashToSpace', function () {
    return function (text) {
        if (text && text.length) return text.replace(/-/g, ' ');
    };
}).filter('jsonFormat', function () {
    return function (text) {
        if (text && text.length) return JSON.stringify(text, undefined, 2)
    };
}).filter('trustHtml', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}).filter('limitText', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
                //Also remove . and , so its gives a cleaner result.
                if (value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ',') {
                    lastspace = lastspace - 1;
                }
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
}).directive('convertToNumber', function () {
    return {
        require: 'ngModel', link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function (val) {
                return String(val);
            });
        }
    };
}).directive('numbersOnly', function () {
    return {
        require: 'ngModel', link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return ''
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
}).directive('ngOnChange', function () {
    return {
        restrict: 'A', link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.customOnChange);
            element.on('change', onChangeHandler);
            element.on('$destroy', function () {
                element.off();
            });

        }
    };
}).directive('floatFormInput', function ($filter) {
    const MONEY_REGEXP = /^\-?\d+((\.|\,)\d{1,2})?$/;
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                if (MONEY_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('float', true);
                    if (typeof viewValue === "money")
                        return viewValue;
                    else
                        return parseFloat(viewValue.replace(',', '.'));
                } else {
                    ctrl.$setValidity('money', false);
                    return undefined;
                }
            });
        }
    };
}).directive('validNumber', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.on('keydown', function (event) {
                let keyCode = [];
                if (attrs.allowNegative == "true") {
                    keyCode = [8, 9, 36, 35, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 109, 110, 173, 190, 189];
                } else {
                    keyCode = [8, 9, 36, 35, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 173, 190];
                }
                if (attrs.allowDecimal == "false") {
                    const index = keyCode.indexOf(190);
                    if (index > -1) {
                        keyCode.splice(index, 1);
                    }
                }
                if ($.inArray(event.which, keyCode) == -1) event.preventDefault();
                else {
                    var oVal = ngModelCtrl.$modelValue || '';
                    if ($.inArray(event.which, [109, 173]) > -1 && oVal.indexOf('-') > -1) event.preventDefault();
                    else if ($.inArray(event.which, [110, 190]) > -1 && oVal.indexOf('.') > -1) event.preventDefault();
                }
            }).on('blur', function () {
                let fixedValue;
                if (element.val() == '' || parseFloat(element.val()) == 0.0 || element.val() == '-') {
                    ngModelCtrl.$setViewValue('0.00');
                } else if (attrs.allowDecimal == "false") {
                    ngModelCtrl.$setViewValue(element.val());
                } else {
                    if (attrs.decimalUpto) {
                        fixedValue = parseFloat(element.val()).toFixed(attrs.decimalUpto);
                    } else {
                        fixedValue = parseFloat(element.val()).toFixed(2);
                    }
                    ngModelCtrl.$setViewValue(fixedValue);
                }
                ngModelCtrl.$render();
                scope.$apply();
            });
            ngModelCtrl.$parsers.push(function (text) {
                var oVal = ngModelCtrl.$modelValue;
                var nVal = ngModelCtrl.$viewValue;
                if (parseFloat(nVal) != nVal) {
                    if (nVal === null || nVal === undefined || nVal == '' || nVal == '-') oVal = nVal;
                    ngModelCtrl.$setViewValue(oVal);
                    ngModelCtrl.$render();
                    return oVal;
                } else {
                    var decimalCheck = nVal.split('.');
                    if (!angular.isUndefined(decimalCheck[1])) {
                        if (attrs.decimalUpto)
                            decimalCheck[1] = decimalCheck[1].slice(0, attrs.decimalUpto);
                        else
                            decimalCheck[1] = decimalCheck[1].slice(0, 2);
                        nVal = decimalCheck[0] + '.' + decimalCheck[1];
                    }
                    ngModelCtrl.$setViewValue(nVal);
                    ngModelCtrl.$render();
                    return nVal;
                }
            });
            ngModelCtrl.$formatters.push(function (text) {
                if (text == '0' || text == null && attrs.allowDecimal == "false")
                    return '0';
                else if (text == '0' || text == null && attrs.allowDecimal != "false" && attrs.decimalUpto == undefined)
                    return '0.00';
                else if (text == '0' || text == null && attrs.allowDecimal != "false" && attrs.decimalUpto != undefined)
                    return parseFloat(0).toFixed(attrs.decimalUpto);
                else if (attrs.allowDecimal != "false" && attrs.decimalUpto != undefined)
                    return parseFloat(text).toFixed(attrs.decimalUpto);
                else
                    return parseFloat(text).toFixed(2);
            });
        }
    };
});

function load_app_assets(plugin) {
    return '/assets/batic/app-assets/' + plugin + '?ver=' + build_version;
}

function load_plugins(plugin, version = false) {
    return '/assets/batic/plugins/' + plugin + '?ver=' + build_version;
}

function load_doctypes(doctype) {
    return '/assets/batic/doctypes/' + doctype + '.js?ver=' + build_version;
}

function load_views(view) {
    return '/assets/batic/js/views/' + view + '.js?ver=' + build_version;
}

function load_template(template) {
    let file_path = (template && template.length) ? template.replace(/\./g, '/') : '';
    return '/assets/batic/templates/' + file_path + '.html?ver=' + build_version;
}

function load_doctype_template(module, doctype, type = '') {
    return '/assets/batic/templates/' + module + '/' + doctype + '-' + type + '.html?ver=' + build_version;
}

function load_controller(controller) {
    let file_path = (controller && controller.length) ? controller.replace(/\./g, '/') : '';
    return '/assets/batic/angular/controllers/' + file_path + '.js?ver=' + build_version;
}

function load_doctype_controller(module, doctype, type = '') {
    return '/assets/batic/angular/controllers/' + module + '/' + doctype + '-' + type + '.js?ver=' + build_version;
}

function load_service(service) {
    let file_path = (service && service.length) ? service.replace(/\./g, '/') : '';
    return '/assets/batic/angular/services/' + file_path + '.js?ver=' + build_version;
}

function load_assets(asset, version = false) {
    let file_path = (asset && asset.length) ? asset : '';
    if (version)
        return '/assets/batic/' + file_path + '?ver=' + build_version;
    else
        return '/assets/batic/' + file_path;
}

function capitalizeText(str, spliter = ' ') {
    let splitStr = str.replace(/-/g, ' ').replace(/_/g, ' ').toLowerCase().split(spliter);
    if (str == 'Gehr' || str == 'gehr') {
        return 'GEHR';
    }
    for (let i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        if (splitStr[i] != 'and' && splitStr[i] != 'of') {
            if (splitStr[i] == 'pos')
                splitStr[i] = splitStr[i].toUpperCase();
            else
                splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname, default_val = '') {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return default_val;
}

function sideMenuInit() {
    $('.main-menu.menu-light .navigation > li').each(function () {
        if (!$('>ul', this).length) {
            $(this).removeClass('has-sub');
        }
    });
}

Array.prototype.removeItem = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
