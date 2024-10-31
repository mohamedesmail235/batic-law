import frappe
from frappe import _
from frappe.cache_manager import clear_user_cache


@frappe.whitelist()
def change_language(language):
    frappe.db.set_value("User", frappe.session.user, "language", language)
    return True


@frappe.whitelist()
def get_current_language():
    return frappe.db.get_value("User", frappe.session.user, "language")


@frappe.whitelist()
def get_logged_user():
    return frappe.session.user


@frappe.whitelist(allow_guest=True)
def get_user_info(user):
    if (user != 'Guest'):
        user_info_map = frappe.db.get_all('User', fields=["*"], filters=dict(enabled=1, name=user))
        if user_info_map:
            user_info_map = user_info_map[0]
            employee = frappe.db.get_all('Employee', fields=["*"], filters=dict(status='active', prefered_email=user_info_map.email))
            if (employee):
                user_info_map['employee_data'] = employee[0]
            else:
                user_info_map['employee_data'] = {};
        return user_info_map
    else:
        return {
            "name": user
        }


@frappe.whitelist()
def update_user_password(name, password):
    return frappe.utils.password.update_password(user=name, pwd=password)


@frappe.whitelist()
def get_standard_filters(doctype):
    return frappe.db.get_list('DocField', filters={'parent': doctype, 'in_standard_filter': 1}, fields=['name as id', 'fieldname as name', 'fieldtype as type', 'label as title', 'options'], order_by='idx asc')


@frappe.whitelist()
def get_list(doctype, filters={}, fields=['*'], order_by='modified desc'):
    return frappe.db.get_list(doctype, filters=filters, fields=fields, order_by=order_by)


@frappe.whitelist()
def get_naming_series(doctype):
    return frappe.get_meta(doctype).get_options("naming_series")


@frappe.whitelist()
def get_report(report_name):
    return frappe.db.get_list('Report', fields=['name', 'report_name', 'ref_doctype', 'reference_report', 'is_standard', 'module', 'report_type', 'add_total_row'], filters={'name': report_name})


@frappe.whitelist(allow_guest=True)
def change_language(currentLanguage):
    frappe.db.set_value("User", frappe.session.user, "language", currentLanguage)
    clear()
    return True


@frappe.whitelist()
def get_doctype_print_format(doctype):
    return frappe.db.get_value('Trust ERP Workspace Links', {'link_to': doctype}, ['print_format'])


@frappe.whitelist()
def update_doc(doctype, docname, new_values):
    doc = frappe.get_doc(doctype, docname)
    for field, value in new_values.items():
        doc.set(field, value)
    doc.set("docstatus", 0)
    doc.save(ignore_permissions=True)


@frappe.whitelist(allow_guest=True)
def web_logout(redirect=False):
    frappe.local.login_manager.logout()
    frappe.db.commit()
    if (redirect):
        frappe.response.location = "/login"
        frappe.response.type = "redirect"
    return True


@frappe.whitelist(allow_guest=True)
def set_dark_mode(dark_mode):
    return frappe.cache().set_value('dark_mode', dark_mode)


def clear():
    frappe.local.session_obj.update(force=True)
    frappe.local.db.commit()
    clear_user_cache(frappe.session.user)
    frappe.response['message'] = _("Cache Cleared")
