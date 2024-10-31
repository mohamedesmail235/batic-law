import frappe
from datetime import date

@frappe.whitelist()
def get_vacation(employee):
    data = {}
    data['current_vacation'] = frappe.db.sql("""select `tabVacation`.status, `tabVacation`.start_date, `tabVacation`.end_date from `tabVacation` where `tabVacation`.employee = '{}'; """.format(employee), as_dict=True)
    return data

@frappe.whitelist()
def apply_vacation():
    pass