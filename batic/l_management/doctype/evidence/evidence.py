# Copyright (c) 2023, law firm and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Evidence(Document):
    def on_update(self):
        doc = frappe.get_doc("Case", self.case)
        for item in doc.evidence:
            if item.evidence == self.name:
                return
        child_doc = frappe.new_doc("EvidenceChildTable")
        child_doc.evidence = self.name
        doc.append("evidence", child_doc)
        doc.save()
