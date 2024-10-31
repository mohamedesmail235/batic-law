# Copyright (c) 2023, law firm and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from hijri_converter import convert
from frappe.utils import today


@frappe.whitelist()
def get_Gregorian_date(year, month, day):
    gregorian_date = convert.Hijri(
        int(year), int(month), int(day)).to_gregorian()
    return gregorian_date  # year-month-day


class PowerofAttorney(Document):
    def on_update(self):
        if self.issue_date and self.expire_date:
            if self.expire_date < self.issue_date:
                frappe.throw("Expire date cannot be before the issue date.")

    def after_insert(self):
        if self.agent:
            possible_user = []
            for item in self.agent:
                email = frappe.get_value(
                    "Employee", item.employee, "prefered_email")
                possible_user.append(email)
            if possible_user:
                frappe.sendmail(recipients=possible_user, subject=f"POA: A New {self.name} Linked With You!", args=dict(
                    poa_no=self.poa_no,
                    issue_date=self.issue_date,
                    issue_hijri=self.issue_date_in_hijri,
                    expire_date=self.expire_date,
                    expire_hijri=self.expire_date_in_hijri,
                    customer=self.customer,
                ), template="new_poa_assign", doctype=self.doctype, name=self.name, delayed=False)

    def before_save(self):
        alreadyExists = []
        i = 0
        while i < len(self.agent):
            item = self.agent[i]
            if item.employee in alreadyExists:
                self.agent.pop(i)
            else:
                alreadyExists.append(item.employee)
                i += 1
        try:
            if self.issue_date_in_hijri:
                date = self.issue_date_in_hijri.split("/")
                if len(date) == 3:
                    if len(date[2]) == 4:
                        year = int(date[2])
                        month = int(date[1])
                        day = int(date[0])
                        gregorian_date = get_Gregorian_date(year, month, day)
                        self.issue_date = gregorian_date
            if self.expire_date_in_hijri:
                date = self.expire_date_in_hijri.split("/")
                if len(date) == 3:
                    if len(date[2]) == 4:
                        year = int(date[2])
                        month = int(date[1])
                        day = int(date[0])
                        gregorian_date = get_Gregorian_date(year, month, day)
                        self.expire_date = gregorian_date

        except Exception as e:
            return e

        if self.agent and self.name:
            try:
                old = frappe.get_doc("Power of Attorney", self.name)
                new_user = []
                if len(self.agent) != len(old.agent):
                    newObj = []
                    oldObj = []
                    for item in self.agent:
                        newObj.append(item.employee)
                    for item in old.agent:
                        oldObj.append(item.employee)

                new_user = [item for item in newObj if item not in oldObj]
                possible_user = []
                for item in new_user:
                    email = frappe.get_value(
                        "Employee", item, "prefered_email")
                    possible_user.append(email)
                if possible_user:
                    frappe.sendmail(recipients=possible_user, subject=f"POA: A New {self.name} Linked With You!", args=dict(
                        poa_no=self.poa_no,
                        issue_date=self.issue_date,
                        issue_hijri=self.issue_date_in_hijri,
                        expire_date=self.expire_date,
                        expire_hijri=self.expire_date_in_hijri,
                        customer=self.customer,
                    ), template="new_poa_assign", doctype=self.doctype, name=self.name, delayed=False)
            except Exception:
                print("")
