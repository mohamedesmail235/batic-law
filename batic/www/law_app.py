import json
import re
import frappe
import frappe.sessions
from frappe.utils import cint, add_user_info
from frappe import _
from frappe.utils.jinja_globals import is_rtl

no_cache = 1

SCRIPT_TAG_PATTERN = re.compile(r"\<script[^<]*\</script\>")
CLOSING_SCRIPT_TAG_PATTERN = re.compile(r"</script\>")

redirect_to = frappe.local.request.args.get("redirect-to")

def get_context(context):
    hooks = frappe.get_hooks()
    try:
        boot = frappe.sessions.get()
    except Exception as e:
        boot = frappe._dict(status="failed", error=str(e))
        print(frappe.get_traceback())

    # this needs commit
    csrf_token = frappe.sessions.get_csrf_token()

    frappe.db.commit()

    boot_json = frappe.as_json(boot, indent=None, separators=(",", ":"))

    # remove script tags from boot
    boot_json = SCRIPT_TAG_PATTERN.sub("", boot_json)

    # TODO: Find better fix
    boot_json = CLOSING_SCRIPT_TAG_PATTERN.sub("", boot_json)
    boot_json = json.dumps(boot_json)

    # get user info
    user_info = frappe._dict()
    add_user_info(frappe.session.user, user_info)

    sounds_list = [
        {"name": "email", "src": "/assets/frappe/sounds/email.mp3", "volume": 0.1},
        {"name": "submit", "src": "/assets/frappe/sounds/submit.mp3", "volume": 0.1},
        {"name": "cancel", "src": "/assets/frappe/sounds/cancel.mp3", "volume": 0.1},
        {"name": "delete", "src": "/assets/frappe/sounds/delete.mp3", "volume": 0.05},
        {"name": "click", "src": "/assets/frappe/sounds/click.mp3", "volume": 0.05},
        {"name": "error", "src": "/assets/frappe/sounds/error.mp3", "volume": 0.1},
        {"name": "alert", "src": "/assets/frappe/sounds/alert.mp3", "volume": 0.2}
    ]

    context = frappe._dict()
    context.boot = boot if context.get("for_mobile") else boot_json
    context.csrf_token = csrf_token
    context.frappe_version = frappe.__version__
    context.frappe_session_user = frappe.session.user
    context.site_name = frappe.local.site
    context.layout_direction = 'rtl' if is_rtl() else 'ltr'
    context.is_rtl = 'true' if is_rtl() else 'false'
    context.assets_direction = 'css-rtl' if is_rtl() else 'css'
    context.include_js_vendors = hooks["app_include_vendors_js"]
    context.include_js = hooks["app_include_js"]
    context.include_css = hooks["app_include_css"]
    context.front_include_css = hooks["front_include_css"]
    context.front_include_js = hooks["front_include_js"]
    context.sounds_list = sounds_list,
    context.disable_signup = cint(frappe.get_website_settings("disable_signup"))
    context.disable_user_pass_login = cint(frappe.get_system_settings("disable_user_pass_login"))
    context.user_session = frappe.session.user
    context.user_info = user_info
    return context
