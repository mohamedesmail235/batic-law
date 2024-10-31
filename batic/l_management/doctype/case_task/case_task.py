# Copyright (c) 2023, law firm and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class CaseTask(Document):
	def before_save(self):
		employees = frappe.db.sql("""SELECT employee from `tabTeamEmps` where parent='{}'""".format(self.team), as_dict=True)
		employeesArr = []
		for employee in employees:
			employeesArr.append(employee['employee'])
		print("$"*200, employeesArr)
		for value in self.add_employees:
			if value.employee not in employeesArr:
				frappe.throw("Employee {} is not part of the team".format(value.employee))