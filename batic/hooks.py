app_name = "batic"
app_title = "Batic Law Firm"
app_publisher = "Abdo Hamoud"
app_description = "ERPNext App"
app_email = "abdo.host@gmail.com"
app_license = "mit"
# required_apps = []

import frappe

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/batic/css/batic.css"
# app_include_js = "/assets/batic/js/batic.js"

front_include_css = [
    '/assets/batic/plugins/fontawesome/all.min.css',
    '/assets/batic/plugins/animate.css/animate.min.css',
    '/assets/batic/plugins/air-datepicker/css/datepicker.min.css',
    '/assets/batic/plugins/chosen/component-chosen.css',
    '/assets/batic/plugins/angular-confirm/angular-confirm.min.css',
    '/assets/batic/plugins/nprogress/nprogress.css',
    'report.bundle.css',
    'law_app.bundle.css'
]

app_include_vendors_js = [
    '/assets/batic/app-assets/vendors/js/vendors.min.js',
    '/assets/batic/app-assets/js/core/app-menu.js',
    '/assets/batic/app-assets/js/core/app.js'
]

front_include_js = [
    'law_app_libs.bundle.js',
    'frappe-web.bundle.js',
    'file_uploader.bundle.js',
    'law_app_frappe.bundle.js',
    'law_app.bundle.js',
    '/assets/batic/plugins/chosen/chosen.jquery.min.js',
    '/assets/batic/plugins/lodash/lodash.min.js',
    '/assets/batic/plugins/angular/angular.js',
    '/assets/batic/plugins/angular/angular-sanitize.min.js',
    '/assets/batic/plugins/angular/angular-ui-router.min.js',
    '/assets/batic/plugins/angular/ngStorage.min.js',
    '/assets/batic/plugins/angular-confirm/angular-confirm.min.js',
    '/assets/batic/plugins/lazyload/ocLazyLoad.min.js',
    '/assets/batic/plugins/nprogress/nprogress.js',
    '/assets/batic/plugins/moment/moment-hijri.js',
    '/assets/batic/js/law.app.js?ver' + frappe.utils.get_build_version(),
    '/assets/batic/angular/routes.js?ver' + frappe.utils.get_build_version(),
    '/assets/batic/angular/app.js?ver' + frappe.utils.get_build_version()
]

website_route_rules = [
    {"from_route": "/law-app/<path:app_path>", "to_route": "law-app"},
]

# include js, css files in header of web template
# web_include_css = "/assets/batic/css/batic.css"
# web_include_js = "/assets/batic/js/batic.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "batic/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "batic/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "batic.utils.jinja_methods",
# 	"filters": "batic.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "batic.install.before_install"
# after_install = "batic.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "batic.uninstall.before_uninstall"
# after_uninstall = "batic.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "batic.utils.before_app_install"
# after_app_install = "batic.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "batic.utils.before_app_uninstall"
# after_app_uninstall = "batic.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "batic.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"batic.tasks.all"
# 	],
# 	"daily": [
# 		"batic.tasks.daily"
# 	],
# 	"hourly": [
# 		"batic.tasks.hourly"
# 	],
# 	"weekly": [
# 		"batic.tasks.weekly"
# 	],
# 	"monthly": [
# 		"batic.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "batic.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "batic.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "batic.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["batic.utils.before_request"]
# after_request = ["batic.utils.after_request"]

# Job Events
# ----------
# before_job = ["batic.utils.before_job"]
# after_job = ["batic.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"batic.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }
