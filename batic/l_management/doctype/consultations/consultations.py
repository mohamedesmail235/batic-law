# Copyright (c) 2023, law firm and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Consultations(Document):
    def before_save(self):
        alreadyExists = []
        i = 0
        while i < len(self.agents):
            item = self.agents[i]
            if item.agent in alreadyExists:
                self.agents.pop(i)
            else:
                alreadyExists.append(item.agent)
                i += 1
