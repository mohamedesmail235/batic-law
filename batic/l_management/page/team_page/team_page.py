import frappe

@frappe.whitelist()
def get_team_data(team, employee=None):
    data = {}
    # select * from `tabEmployee` where name in (select `tabTeamEmps`.employee from `tabTeamEmps` INNER JOIN `tabEmployee Teams` on `tabTeamEmps`.parent = `tabEmployee Teams`.name)
    head_lawyer = frappe.get_value("Employee Teams", team, "head_lawyer")
    data['employees'] = frappe.db.sql("""select * from `tabEmployee` inner join `tabTeamEmps` on `tabTeamEmps`.employee = `tabEmployee`.name inner join `tabEmployee Teams` on `tabEmployee Teams`.name = `tabTeamEmps`.parent and `tabEmployee Teams`.name = '{}';""".format(team), as_dict=True)
    data['cases'] = frappe.db.sql("""select * from `tabCase` inner join `tabTeamCases` on `tabTeamCases`.case = `tabCase`.name inner join `tabEmployee Teams` on `tabEmployee Teams`.name = `tabTeamCases`.parent and `tabEmployee Teams`.name = '{}';""".format(team), as_dict=True)
    data['head_lawyer'] = frappe.db.sql("""select * from `tabEmployee` where name='{}'""".format(head_lawyer), as_dict=True)
    if employee:
        data['tasks'] = frappe.db.sql("SELECT `tabCase Task`.*, `tabEmpTasks`.employee FROM `tabCase Task` INNER JOIN `tabEmpTasks` ON `tabEmpTasks`.parent = `tabCase Task`.name and `tabEmpTasks`.employee='{}' where `tabCase Task`.status != 'Completed'".format(employee), as_dict=True)
    else:
        data['tasks'] = frappe.db.sql("SELECT `tabCase Task`.* FROM `tabCase Task` where team='{}' and status!='Completed'".format(team), as_dict=True)
    return data


@frappe.whitelist()
def update_task_status(status, docName):
    doc = frappe.db.sql("""UPDATE `tabCase Task` SET status='{}' WHERE name='{}'""".format(status, docName))
    return doc