import frappe

@frappe.whitelist()
def employee_data(employee_data):
    data = {}
    data['employee'] = frappe.db.sql("""SELECT * FROM `tabEmployee` where name='{}'""".format(employee_data), as_dict=True) 
    data['tasks'] = frappe.db.sql("SELECT `tabCase Task`.*, `tabEmpTasks`.* FROM `tabCase Task` INNER JOIN `tabEmpTasks` ON `tabEmpTasks`.parent = `tabCase Task`.name", as_dict=True)
    return data
@frappe.whitelist()
def update_task(updatedStatus, docName):
    doc = None
    # doc = frappe.db.sql("""UPDATE `tabCase Task` SET status='{}' WHERE name='{}'""".format(updatedStatus, docName))
    return doc