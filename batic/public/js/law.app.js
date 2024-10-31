/*
* LAW ERP App
* Custom Scripts
* Abdo Hamoud (abdo.host@gmail.com)
* https://www.abdo-host.com
*/

if (!baticApp.app) baticApp.app = {}
if (!baticApp.list_view) baticApp.list_view = {}

baticApp.clear_local_storage = function () {
    $.each(["_last_load", "_version_number", "metadata_version", "page_info",
        "last_visited"], function (i, key) {
        localStorage.removeItem(key);
    });
    // clear assets
    for (var key in localStorage) {
        if (key.indexOf("desk_assets:") === 0 || key.indexOf("_page:") === 0
            || key.indexOf("_doctype:") === 0 || key.indexOf("preferred_breadcrumbs:") === 0) {
            localStorage.removeItem(key);
        }
    }
    console.log("localStorage cleared");
}

baticApp.clear_cache = function () {
    baticApp.clear_local_storage();
    frappe.xcall('frappe.sessions.clear').then(message => {
        frappe.show_alert({
            message: message
        });
        location.reload(true);
    });
}

frappe.query_report = {
    get_filter_value: function (fieldname) {
        const filter_area = $('.report-filter-area');
        const field = $('[data-fieldname="' + fieldname + '"]', filter_area);
        return field ? field.val() : null;
    }
}

function get_base_url(path = '') {
    // var url= (frappe.base_url || window.location.href).split('#')[0].split('?')[0].split('desk')[0];
    var url = (frappe.base_url || window.location.origin);
    if (url.substr(url.length - 1, 1) == '/') url = url.substr(0, url.length - 1);
    return url + path;
}

function api_url(method) {
    return get_base_url('/api/method/batic.api.' + method);
}

function frappe_api_url(method) {
    return get_base_url('/api/method/' + method);
}

function reservation_api_url(method) {
    // return ($('body').data('api-url') + '/api/method/' + method);
    return get_base_url('/api/method/' + method);
}

function frappe_api_resource(doctype) {
    return get_base_url('/api/resource/' + doctype);
}

function stringVal(val) {
    return ($.trim(val) && $.trim(val).length) ? val : "";
}

function floatVal(val) {
    return ($.trim(val)) ? parseFloat(val) : 0.00;
}

function intVal(val) {
    return ($.trim(val)) ? parseInt(val) : 0;
}

function _lang_format(str, args) {
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

(function ($) {

    "use strict";

    $.fn.extend({
        triggerAll: function (events, params) {
            var el = this, i, evts = events.split(' ');
            for (i = 0; i < evts.length; i += 1) {
                el.trigger(evts[i], params);
            }
            return el;
        }
    });

    $.extend(baticApp.app, {
        __lang: (text, replace) => {
            let messages = (frappe.boot && frappe.boot.__messages) ? frappe.boot.__messages : {};
            let string = (messages[text] && $.trim(messages[text])) ? messages[text] : text;
            if (replace && typeof replace === "object") {
                string = _lang_format(string, replace);
            }
            return string;
        }
    });

    $(document).on('click', '.btn-toggle-menu', function () {
        if ($('.wrapper').hasClass('side-menu-collapsed')) {
            $('.wrapper').removeClass('side-menu-collapsed');
        } else {
            $('.wrapper').addClass('side-menu-collapsed');
        }
    });

    $(document).on('click', '.btn-toggle-mobile-menu', function () {
        // .page-sidebar-overlay
        if ($('.wrapper').hasClass('mobile-menu-open')) {
            $('.wrapper').removeClass('mobile-menu-open');
            $('.page-sidebar-overlay').fadeOut();
            if ($('body').hasClass('body-rtl-style')) {
                $('.page-sidebar').css('right', '-260px');
            } else {
                $('.page-sidebar').css('left', '-260px');
            }
        } else {
            $('.wrapper').addClass('mobile-menu-open');
            if ($('body').hasClass('body-rtl-style')) {
                $('.page-sidebar').show().css('right', '0px');
            } else {
                $('.page-sidebar').show().css('left', '0px');
            }
            $('.page-sidebar-overlay').fadeIn();
        }
    });

    $(document).on('click', '.page-sidebar-overlay', function () {
        $('.wrapper').removeClass('mobile-menu-open');
        $('.page-sidebar-overlay').fadeOut();
        if ($('body').hasClass('body-rtl-style')) {
            $('.page-sidebar').css('right', '-260px');
        } else {
            $('.page-sidebar').css('left', '-260px');
        }
    });

    $(document).on('click', '[data-dismiss="modal"]', function () {
        let modal = $(this).parents('.modal');
        modal.modal('hide');
    });


})(jQuery);
