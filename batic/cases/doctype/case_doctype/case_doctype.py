# Copyright (c) 2023, law firm and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class CaseDoctype(Document):
	def validate(self):
		if self.end_date and self.start_date:
			if self.start_date > self.end_date:
				frappe.throw("The ending date should be later the start date")
