# Copyright (c) 2023, law firm and contributors
# For license information, please see license.txt
import frappe
from frappe.model.document import Document
from datetime import datetime
from hijri_converter import convert


class CourtSession(Document):
    def before_save(self):
        if self.date_in_hirji:
            date = self.date_in_hirji.split("/")
            if len(date) == 3:
                if len(date[2]) == 4:
                    year = int(date[2])
                    month = int(date[1])
                    day = int(date[0])
                    gregorian_date = get_Gregorian_date(year, month, day)
                    self.session_date = gregorian_date

        if self.next_session_hijri_date:
            date = self.next_session_hijri_date.split("/")
            if len(date) == 3:
                if len(date[2]) == 4:
                    year = int(date[2])
                    month = int(date[1])
                    day = int(date[0])
                    gregorian_date = get_Gregorian_date(year, month, day)
                    self.next_session_date = gregorian_date

        if self.session_date and self.next_session_date:
            if self.next_session_date < self.session_date:
                frappe.throw("Close date cannot be before the Start date.")

        try:
            if self.name:
                old = frappe.get_doc("Court Session", self.name)
                if self.agent != old.agent:
                    agent_address = frappe.get_value(
                        "Employee", self.agent, "prefered_email")
                    frappe.sendmail(recipients=agent_address, subject=f"Court Session: A Court {self.name} assigned on You!", args=dict(
                        session_name=self.name,
                        session_link=self.session_link_url,
                        session_date=self.session_date,
                        session_hijri=self.date_in_hirji,
                        session_time=self.session_time,
                        session_poa=self.poa,
                        session_case=self.case_session,
                        session_court=self.court,
                        case_status=self.case_status
                    ), template="assigned_agent_courtSession", delayed=False)
        except Exception:
            print("")

    def after_insert(self):
        if self.agent:
            agent_address = frappe.get_value(
                "Employee", self.agent, "prefered_email")
            frappe.sendmail(recipients=agent_address, subject=f"Court Session: A Court {self.name} assigned on You!", args=dict(
                session_name=self.name,
                session_link=self.session_link_url,
                session_date=self.session_date,
                session_hijri=self.date_in_hirji,
                session_time=self.session_time,
                session_poa=self.poa,
                session_case=self.case_session,
                session_court=self.court,
                case_status=self.case_status
            ), template="assigned_agent_courtSession", delayed=False)


@frappe.whitelist()
def get_case(case):
    return frappe.get_doc('Case', case)


@frappe.whitelist()
def get_poaData(case):
    return frappe.get_doc('Power of Attorney',)


@frappe.whitelist()
def get_poa(agent, client, session_date):
    # return frappe.get_doc('Power of Attorney', filters={"agent": agent,"customer": client})
    poa = frappe.db.sql(
        """SELECT * FROM `tabPower of Attorney` WHERE customer="%s" AND agent="%s" ORDER BY expire_date DESC;""" % (client, agent), as_dict=True)
    if len(poa) > 0:
        poa = poa[0]
        session = datetime.strptime(str(session_date), '%Y-%m-%d').date()
        poa_expire = datetime.strptime(str(poa.expire_date), '%Y-%m-%d').date()

        if session <= poa_expire:
            return "Valid", poa
        else:
            return "Invalid", poa


def get_Gregorian_date(year, month, day):
    gregorian_date = convert.Hijri(
        int(year), int(month), int(day)).to_gregorian()
    return gregorian_date  # year-month-day
