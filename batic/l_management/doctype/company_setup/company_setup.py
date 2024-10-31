# Copyright (c) 2023, law firm and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class CompanySetup(Document):
    def before_save(self):
        # agent table data merge
        alreadyExists = []
        i = 0
        while i < len(self.agents):
            item = self.agents[i]
            if item.employee in alreadyExists:
                self.agents.pop(i)
            else:
                alreadyExists.append(item.employee)
                i += 1

        # parnter table data merge
        alreadyExists = []
        i = 0
        while i < len(self.partner_data):
            item = self.partner_data[i]
            if item.partner in alreadyExists:
                self.partner_data.pop(i)
            else:
                alreadyExists.append(item.partner)
                i += 1
