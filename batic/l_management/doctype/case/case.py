# Copyright (c) 2023, law firm and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from hijri_converter import convert


@frappe.whitelist()
def get_doc(doctype, name):
    return frappe.get_doc(doctype, name)


def get_Gregorian_date(year, month, day):
    gregorian_date = convert.Hijri(
        int(year), int(month), int(day)).to_gregorian()
    return gregorian_date  # year-month-day


class Case(Document):

    def on_update(self):
        contract = frappe.get_doc("Contract", self.contract)
        if contract.is_signed != 1:
            frappe.throw(
                "Make sure Contract is Signed, Without Contract Sign, Customer cannot be filled!")
        if self.start_date and self.close_date:
            if self.close_date < self.start_date:
                frappe.throw("Close date cannot be before the Start date.")

    def before_submit(self):
        try:
            doc = frappe.get_doc("Case", self.name)
        except Exception as e:
            return
        if doc.case_status_workflow == "Ended":
            if self.legal_case_result == None or self.legal_case_result == "":
                frappe.throw(
                    "Legal Case Result Should be Fill up!")
            if self.judgment == None or self.judgment == "":
                frappe.throw(
                    "Judgement Should be Fill up!")

    def before_save(self):
        if self.start_date_in_hijri:
            date = self.start_date_in_hijri.split("/")
            if len(date) == 3:
                if len(date[2]) == 4:
                    year = int(date[2])
                    month = int(date[1])
                    day = int(date[0])
                    gregorian_date = get_Gregorian_date(year, month, day)
                    self.start_date = gregorian_date
        if self.close_date_in_hijri:
            date = self.close_date_in_hijri.split("/")
            if len(date) == 3:
                if len(date[2]) == 4:
                    year = int(date[2])
                    month = int(date[1])
                    day = int(date[0])
                    gregorian_date = get_Gregorian_date(year, month, day)
                    self.close_date = gregorian_date

        # agent table data marge
        alreadyExists = []
        i = 0
        while i < len(self.agent):
            item = self.agent[i]
            if item.employee in alreadyExists:
                self.agent.pop(i)
            else:
                alreadyExists.append(item.employee)
                i += 1
        # condentar data marge
        i = 0
        while i < len(self.contender):
            item = self.contender[i]
            if item.id_number in alreadyExists:
                self.contender.pop(i)
            else:
                alreadyExists.append(item.id_number)
                i += 1
        # evidance table data marge
        i = 0
        while i < len(self.evidence):
            item = self.evidence[i]
            if item.evidence in alreadyExists:
                self.evidence.pop(i)
            else:
                alreadyExists.append(item.evidence)
                i += 1

        try:
            doc = frappe.get_doc("Case", self.name)
        except Exception as e:
            return
        if doc:
            if self.case_status_workflow != doc.case_status_workflow:
                # IN APPEAL
                if doc.case_status_workflow == "In Appeal" and (self.legal_case_result == "" or self.legal_case_result == None):
                    frappe.throw(
                        "Legal Case Result Should be Fill up!")
                if doc.case_status_workflow == "In Appeal" and (self.appellate_judgment == "" or self.appellate_judgment == None):
                    frappe.throw(
                        "Appellate Judgement Should be Fill up!")

                # MOTION REVIEW
                if doc.case_status_workflow == "Motion for Review" and (self.legal_case_result == "" or self.legal_case_result == None):
                    frappe.throw(
                        "Legal Case Result Should be Fill up!")

                # ENDED
                if doc.case_status_workflow == "Ended":
                    if self.legal_case_result == None or self.legal_case_result == "":
                        frappe.throw(
                            "Legal Case Result Should be Fill up!")
                    if self.judgment == None or self.judgment == "":
                        frappe.throw(
                            "Judgement Should be Fill up!")
