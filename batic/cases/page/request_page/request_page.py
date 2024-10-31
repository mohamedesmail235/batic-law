import frappe

@frappe.whitelist()
def employee_data():
    output = {}
    output["data"] = frappe.db.sql("""SELECT * FROM `tabCase` WHERE case_status_workflow='Draft'""", as_dict=True)

    if frappe.session.user == "Administrator":
        output["user"] = True
    else: 
        output["user"] = False
    return output
@frappe.whitelist()
def update_doc(updatedStatus, docName):
    doc = frappe.db.sql("""UPDATE `tabCase` SET case_status_workflow='{}' WHERE name='{}'""".format(updatedStatus, docName))
    return doc
