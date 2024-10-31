# Copyright (c) 2023, law firm and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from datetime import date


@frappe.whitelist()
def docs(doctype, docname):
    return frappe.get_doc(doctype, docname)


class Vacation(Document):
    def before_save(self):
        if self.start_date > self.end_date:
            frappe.throw("Please input the correct end date.")
        start_year, start_month, start_day = map(
            int, str(self.start_date).split("-"))
        end_year, end_month, end_day = map(int, str(self.end_date).split("-"))
        delta = date(end_year, end_month, end_day) - \
            date(start_year, start_month, start_day)
        self.days = delta.days

        if frappe.session.user != "Administrator":
            employee = docs("Employee", self.employee)
            if employee.prefered_email != frappe.session.user:
                frappe.throw("Not Valid User to edit!")
            if self.status != "Waiting":
                frappe.throw("Not Valid User to edit!")
