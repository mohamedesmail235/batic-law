import frappe

@frappe.whitelist()
def files_data():
    files = frappe.db.sql("""SELECT * FROM `tabFile`""", as_dict=True)
    return files
