import frappe

@frappe.whitelist()
def get_top_employees():
    data = {}
    # select * from `tabEmployee` where name in (select `tabTeamEmps`.employee from `tabTeamEmps` INNER JOIN `tabEmployee Teams` on `tabTeamEmps`.parent = `tabEmployee Teams`.name)
    data['employees'] = frappe.db.sql("""select `tabEmployee`.*, COUNT(`tabEmpTasks`.employee) as employee_tasks from `tabEmployee` inner join `tabEmpTasks` on `tabEmpTasks`.employee = `tabEmployee`.name GROUP BY `tabEmployee`.name ORDER BY employee_tasks DESC LIMIT 5;""", as_dict=True)
    return data