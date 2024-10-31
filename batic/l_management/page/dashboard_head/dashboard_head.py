import frappe

@frappe.whitelist()
def get_dashboard_data(user, employee):
    data = {}
    
    if user == "Head Team Lawyer":
        data['employee_cases'] = frappe.db.sql("""SELECT `tabCase`.*, `tabTeamCases`.parent, `tabEmployee Teams`.team_name from `tabCase` inner join `tabTeamCases` on `tabTeamCases`.case = `tabCase`.name inner join `tabEmployee Teams`
on `tabEmployee Teams`.head_lawyer="{}" and `tabEmployee Teams`.name = `tabTeamCases`.parent;""".format(employee), as_dict=True)
        data['employee_tasks'] = frappe.db.sql("""SELECT `tabCase Task`.* from `tabCase Task` inner join `tabEmployee Teams` on `tabEmployee Teams`.name = `tabCase Task`.team and `tabEmployee Teams`.head_lawyer = "{}";""".format(employee), as_dict=True)
        data['all_data'] = frappe.db.sql("""select `tabCase Task`.name, `tabEmpTasks`.employee from `tabCase Task` inner join `tabEmpTasks` on `tabEmpTasks`.parent = `tabCase Task`.name and `tabCase Task`.team in (select `tabEmployee Teams`.name from `tabEmployee Teams` where `tabEmployee Teams`.head_lawyer='{}');""".format(employee), as_dict=True)
    else:
        data['employee_cases'] = frappe.db.sql("""SELECT `tabCase`.*, `tabTeamCases`.parent, `tabEmployee Teams`.team_name from `tabCase` inner join `tabTeamCases` on `tabTeamCases`.case = `tabCase`.name inner join `tabEmployee Teams`
on `tabEmployee Teams`.name = `tabTeamCases`.parent inner join `tabTeamEmps` on `tabTeamEmps`.parent = `tabEmployee Teams`.name  and `tabTeamEmps`.employee = '{}';""".format(employee), as_dict=True)
        data['employee_tasks'] = frappe.db.sql("""SELECT `tabCase Task`.* from `tabCase Task` inner join `tabEmpTasks` on `tabEmpTasks`.parent = `tabCase Task`.name and `tabEmpTasks`.employee = '{}';""".format(employee), as_dict=True)

    return data
