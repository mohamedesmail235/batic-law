# Copyright (c) 2023, law firm and contributors
# For license information, please see license.txt

import pytz
import json
import copy
# from datetime import datetime
import frappe
import datetime
from frappe.model.document import Document
from frappe.desk.search import search_link
from batic.cases.page.overview.overview import change_task_status

# @frappe.whitelist()
# def get_all_task_for_orderName(orderName):


@frappe.whitelist()
def create_invoice(timeZone, linked_document_type, linked_document, company, taxes_charges, income_account):
    # return get_total_work_hour_record(
    #     linked_document_type, linked_document)
    local_tz = (pytz.timezone(timeZone))
    date_format = '%Y-%m-%d'
    client = ""
    calculation_type = ""
    per_hour_type = ""
    quotation = ""
    target_hours = 0
    target_hour_price = 0
    technical_fees = {}
    row = []
    error = ""

    role_dict_invoice = {
        'seniorLawyer': "Senior Lawyer Hour",
        'lawyer': "Lawyer Hour",
        'partner': "Partner Hour",
        'consultant': "Consultant Hour",
        'attorneyAsistant': "Attorney Assistant Hour",
        'legalSecretary': "Legal Secretary Hour"
    }
    role_dict_quotation = {
        'seniorLawyer': "senior_lawyer",
        'lawyer': "lawyer",
        'partner': "partner",
        'consultant': "consultant",
        'attorneyAsistant': "attorney_assistant",
        'legalSecretary': "legal_secretary"
    }

    if linked_document_type == "Case":
        caseData = frappe.get_doc("Case", linked_document)
        getCaseContract = frappe.get_doc("Contract", caseData.contract)
        client = getCaseContract.party_name,
        quotation = getCaseContract.quotation
        getQuotation = frappe.get_doc("Quotation", quotation)
        calculation_type = getCaseContract.calculation_type
        per_hour_type = getCaseContract.per_hour_type
        target_hours = getCaseContract.target_hours
        target_hour_price = getCaseContract.target_hour_price
        technical_fees_string = getQuotation.technical_fees
        technical_fees = json.loads(getQuotation.technical_fees)

    else:
        otherData = frappe.get_doc(linked_document_type, linked_document)
        if not otherData.quotation:
            error = "Quotation Data is Must for invoice cretation!"
        getQuotation = frappe.get_doc("Quotation", otherData.quotation)
        client = getQuotation.customer_name,
        calculation_type = getQuotation.calculation_type
        per_hour_type = getQuotation.per_hour_type
        target_hours = getQuotation.target_hours
        target_hour_price = getQuotation.target_hour_price
        technical_fees_string = getQuotation.technical_fees
        technical_fees = json.loads(getQuotation.technical_fees)

    if calculation_type == "Percentage" or calculation_type == "Percentage + Flat Fee":
        error = "You need to create invoice manually!"

    if calculation_type == "Flat Fee":
        row = [{
            "item_name": "Service Flat Fee",
            "description": "Service flat fee",
            "qty": 1,
            "rate": getQuotation.fee,
            "amount": getQuotation.fee,
            "income_account": income_account
        }]

    if calculation_type == "Per Hour":
        if per_hour_type == "Standard hours":
            workHour = get_total_work_hour_record(
                linked_document_type, linked_document, technical_fees_string)
            technical_hour = workHour['overall_technical_position_time']
            avaiable_hour = []
            for item in technical_hour:
                if technical_hour[item] != "00:00:00":
                    h = 0
                    m = 0
                    temp = technical_hour[item].split(":")
                    h = int(temp[0])
                    if int(temp[2]) > 29:
                        m = int(temp[1])+1
                    else:
                        m = int(temp[1])
                    fraction_hour = m / 60
                    fraction_hour = "{:.3f}".format(fraction_hour)
                    total_hour = h + float(fraction_hour)
                    if (total_hour != 0):
                        data = [item, total_hour,
                                technical_fees[role_dict_quotation[item]]]
                        avaiable_hour.append(data)

            if len(avaiable_hour) == 0:
                error = "No Work History are there. You need to create manually!"

            for item in avaiable_hour:
                row.append({
                    "item_name": role_dict_invoice[item[0]],
                    "description": role_dict_invoice[item[0]],
                    "qty": item[1],
                    "rate": item[2],
                    "amount": item[1]*item[2],
                    "income_account": income_account,
                    "uom": "Hour"
                })

        if per_hour_type == "Average hours":
            workHour = get_total_work_hour_record(
                linked_document_type, linked_document, technical_fees)
            technical_hour = workHour['overall_technical_position_time']
            avaiable_hour = []
            total_work_hour = 0
            for item in technical_hour:
                if technical_hour[item] != "00:00:00":
                    h = 0
                    m = 0
                    temp = technical_hour[item].split(":")
                    h = int(temp[0])
                    if int(temp[2]) > 29:
                        m = int(temp[1])+1
                    else:
                        m = int(temp[1])
                    fraction_hour = m / 60
                    fraction_hour = "{:.3f}".format(fraction_hour)
                    total_hour = h + float(fraction_hour)
                    if (total_hour != 0):
                        data = [item, total_hour,
                                technical_fees[role_dict_quotation[item]]]
                        avaiable_hour.append(data)
                        total_work_hour += total_hour
            if target_hours < total_work_hour:
                row.append({
                    "item_name": "Services Hour",
                    "description": "Services Hour",
                    "qty": target_hours,
                    "rate": target_hour_price,
                    "amount": target_hours*target_hour_price,
                    "income_account": income_account
                })

                qtyExtra = total_work_hour-target_hours
                hourRateBasedOnContribution = 0
                for item in avaiable_hour:
                    work_percentage = item[1]/total_work_hour
                    payment = work_percentage*item[2]
                    hourRateBasedOnContribution += payment
                    data = [work_percentage, payment]
                    temp.append(data)

                row.append({
                    "item_name": "Extra Hour",
                    "description": "Extra Hour",
                    "qty": qtyExtra,
                    "rate": hourRateBasedOnContribution,
                    "amount": qtyExtra*hourRateBasedOnContribution,
                    "income_account": income_account
                })
            else:
                if total_work_hour == 0:
                    error = "No Work record found to create invoice!"
                row.append({
                    "item_name": "Services Hour",
                    "description": "Services Hour",
                    "qty": total_work_hour,
                    "rate": target_hour_price,
                    "amount": target_hours*target_hour_price,
                    "income_account": income_account
                })
    # work sheet part
    workHour = get_total_work_hour_record(
        linked_document_type, linked_document, technical_fees_string)
    workSheetRow = []
    for item in workHour['employee_data']:
        workSheetRow.append({
            "employee_id": item['employee_id'],
            "name1": item['name'],
            "spend_time": item['spend_time'],
            "technical_position": item['tech_position'],
            "quantityhour": item['quantity'],
            "per_hour_position_fee": item['tech_position_rate_per_hour']
        })
    # tax part
    tamplate = frappe.get_doc(
        "Sales Taxes and Charges Template", taxes_charges)
    doc = frappe.get_doc({
        "doctype": "Sales Invoice",
        "customer": client,
        "company": company,
        "due_date": datetime.datetime.strptime(str(datetime.datetime.now(local_tz)).split(" ")[0], date_format).date(),
        "items": row,
        "linked_document_type": linked_document_type,
        "linked_document": linked_document,
        "taxes_and_charges": taxes_charges,
        "taxes": tamplate.taxes,
        "tax_category": tamplate.tax_category,
        "work_sheets": workSheetRow
    })
    if error != "":
        return {
            "success": False,
            "error": error
        }

    doc.insert()
    return {
        "success": True,
        "invoice": doc
    }


@frappe.whitelist()
# orderType means Case/Consultation/Legal Service/Setup Company
def get_total_work_hour_record(orderType, orderName, technical_fees):
    # get all task where orderType & orderName linked
    technical_fees = json.loads(technical_fees)
    all_tasks = frappe.db.sql(
        """Select * From tabTask where linked_document_type_='{}' and linked_document='{}';""".format(orderType, orderName), as_dict=True)
    # get all workTime spend time where those task id exits
    all_workTime_for_all_task = []
    total_order_work = "00:00:00"
    partner_time = "00:00:00"
    consultant_time = "00:00:00"
    senior_lawyer_time = "00:00:00"
    lawyer_time = "00:00:00"
    attroyney_assistant_time = "00:00:00"
    legal_secretary_time = "00:00:00"
    for task in all_tasks:
        data = task_total_time(task.name)
        all_workTime_for_all_task.append(data)
        total_order_work = time_addition(
            total_order_work, data["total_task_time"])

        partner_time = time_addition(
            partner_time, data["employee_position_time"]["partner"])
        consultant_time = time_addition(
            consultant_time, data["employee_position_time"]["consultant"])
        senior_lawyer_time = time_addition(
            senior_lawyer_time, data["employee_position_time"]["seniorLawyer"])
        lawyer_time = time_addition(
            lawyer_time, data["employee_position_time"]["lawyer"])
        attroyney_assistant_time = time_addition(
            attroyney_assistant_time, data["employee_position_time"]["attorneyAsistant"])
        legal_secretary_time = time_addition(
            legal_secretary_time, data["employee_position_time"]["legalSecretary"])

    position_time = {
        "partner": partner_time,
        "consultant": consultant_time,
        "seniorLawyer": senior_lawyer_time,
        "lawyer": lawyer_time,
        "attorneyAsistant": attroyney_assistant_time,
        "legalSecretary": legal_secretary_time
    }
    position_rate = {
        "Senior Lawyer": technical_fees['senior_lawyer'],
        "Lawyer":  technical_fees["lawyer"],
        "Partner": technical_fees["partner"],
        "Consultant":  technical_fees["consultant"],
        "Attorney Assistant":  technical_fees["attorney_assistant"],
        "Legal Secretary": technical_fees["legal_secretary"]
    }

    employee_data_history = []
    for task in all_workTime_for_all_task:
        if len(task['workTime']) > 0:
            for work in task['workTime']:
                if len(employee_data_history) > 0:
                    flag = 0
                    for item in employee_data_history:
                        if item['employee_id'] == work.user:
                            item['spend_time'] = time_addition(
                                item['spend_time'], work.spend_session_time)
                            total_hour = convert_in_quantity(
                                item['spend_time'])
                            item['quantity'] = total_hour
                            flag = 1
                    if flag == 0:
                        total_hour = convert_in_quantity(
                            work.spend_session_time)
                        employee_data_history.append({
                            "employee_id": work.user,
                            "spend_time": work.spend_session_time,
                            "tech_position": work.employee_tech_position,
                            "name": frappe.get_value("Employee", work.user, "employee_name"),
                            "quantity": total_hour,
                            "tech_position_rate_per_hour": position_rate[work.employee_tech_position]

                        })
                else:
                    total_hour = convert_in_quantity(work.spend_session_time)
                    employee_data_history.append({
                        "employee_id": work.user,
                        "spend_time": work.spend_session_time,
                        "tech_position": work.employee_tech_position,
                        "name": frappe.get_value("Employee", work.user, "employee_name"),
                        "quantity": total_hour,
                        "tech_position_rate_per_hour": position_rate[work.employee_tech_position]

                    })

    orderWorkDetails = {
        "taskDetails": all_workTime_for_all_task,
        "numberOftask": len(all_workTime_for_all_task),
        "total_order_Work": total_order_work,
        "overall_technical_position_time": position_time,
        "employee_data": employee_data_history,
    }
    return orderWorkDetails


@frappe.whitelist()
def task_total_time(taskName):
    final_workTime = []
    # time for technical & total time calculatition
    partner_time = "00:00:00"
    consultant_time = "00:00:00"
    senior_lawyer_time = "00:00:00"
    lawyer_time = "00:00:00"
    attroyney_assistant_time = "00:00:00"
    legal_secretary_time = "00:00:00"
    total_task_time = "00:00:00"
    all_workTime = frappe.db.sql(
        """Select * From tabWorkTime where task='{}' and spend_session_time!="";""".format(taskName), as_dict=True)
    for timeData in all_workTime:
        total_task_time = time_addition(
            total_task_time, timeData.spend_session_time)
        employee = frappe.db.sql(
            """Select * From tabEmployee where name='{}';""".format(timeData.user), as_dict=True)[0]
        timeData.employee_tech_position = employee.technical_position
        final_workTime.append(timeData)

        if employee.technical_position == "Partner":
            partner_time = time_addition(
                partner_time, timeData.spend_session_time)
        elif employee.technical_position == "Consultant":
            consultant_time = time_addition(
                consultant_time, timeData.spend_session_time)
        elif employee.technical_position == "Senior Lawyer":
            senior_lawyer_time = time_addition(
                senior_lawyer_time, timeData.spend_session_time)
        elif employee.technical_position == "Lawyer":
            lawyer_time = time_addition(
                lawyer_time, timeData.spend_session_time)
        elif employee.technical_position == "Attorney Assistant":
            attroyney_assistant_time = time_addition(
                attroyney_assistant_time, timeData.spend_session_time)
        elif employee.technical_position == "Legal Secretary":
            legal_secretary_time = time_addition(
                legal_secretary_time, timeData.spend_session_time)

    position_time = {
        "partner": partner_time,
        "consultant": consultant_time,
        "seniorLawyer": senior_lawyer_time,
        "lawyer": lawyer_time,
        "attorneyAsistant": attroyney_assistant_time,
        "legalSecretary": legal_secretary_time
    }
    return {"task_name": taskName, "workTime": final_workTime, "total_task_time": total_task_time, "employee_position_time": position_time}


def time_addition(total_time, given_time):
    h, m, s = given_time.split(":")
    th, tm, ts = total_time.split(":")
    ts = int(ts) + int(s)
    tm = int(tm) + int(m)
    th = int(th) + int(h)
    tm += ts // 60
    ts = ts % 60
    th += tm // 60
    tm = tm % 60
    return "{:02d}:{:02d}:{:02d}".format(th, tm, ts)


def convert_in_quantity(given_time):
    if given_time != "00:00:00":
        h = 0
        m = 0
        temp = given_time.split(":")
        h = int(temp[0])
        if int(temp[2]) > 29:
            m = int(temp[1])+1
        else:
            m = int(temp[1])
        fraction_hour = m / 60
        fraction_hour = "{:.3f}".format(fraction_hour)
        return h + float(fraction_hour)


@frappe.whitelist()
def payment_details():
    return "FUNC"


@frappe.whitelist()
def employee():
    emp_list = frappe.db.sql(
        '''Select employee , employee_name,technical_position,type_of_job,image,status from tabEmployee;''', as_dict=True)

    emp_list_final = []
    for emp in emp_list:
        task = frappe.db.sql(
            '''Select count(*) as taskNumber from tabUserChildTable where user='{}';'''.format(emp.employee), as_dict=True)[0]
        emp.taskNumber = task.taskNumber
        emp_list_final.append(emp)
    type_of_job = ["Admin", "Manager", "Team Head Lawyer",
                   "Lawyer", "Legal Secretary", "Accountant", "HR"]

    return {"employees": emp_list_final, "type_of_job": type_of_job, }


@frappe.whitelist()
def get_doc_record(doctype, filters=None):
    if doctype == "Judge":
        data = frappe.get_all(doctype, fields=["*"])
        for item in data:
            if item.court:
                item.court_name = frappe.get_value(
                    "Court", item.court, "court_name")
        return data
    elif doctype == "Section":
        data = frappe.get_all(doctype, fields=["*"])
        for item in data:
            if item.court:
                item.court_name = frappe.get_value(
                    "Court", item.court, "court_name")
        return data
    elif doctype == "Comment":
        data = frappe.get_all(doctype, fields=["*"], filters=filters)
        return data
    else:
        return frappe.get_all(doctype, fields=["*"])


@frappe.whitelist()
def get_doc_record_details(doctype, docname):
    return frappe.get_doc(doctype, docname)


def add_key_value_to_object(obj, key, value):
    obj_dict = obj.__dict__.copy()
    obj_dict[key] = value
    new_object = type(obj)(**obj_dict)
    return new_object


@frappe.whitelist()
def comment_data(filters=None):
    data = frappe.get_all("Comment", fields=["*"], filters=filters)
    for item in data:
        if item.comment_email != "Administrator":
            temp = frappe.db.sql(
                """Select name, image From tabEmployee where prefered_email='{}';""".format(item.comment_email), as_dict=True)
            item.user = temp[0]
        else:
            item.user = {
                "name": "Administrator",
                "image": None
            }
    return data


#############################################
############ Scheduled Time #################
def reminder_poa_expire():
    poas = frappe.get_list("Power of Attorney", fields=["*"])
    notifi_poa = []
    for item in poas:
        present = present_time()
        # present = "2023-10-3 10:00:35.0"
        present = datetime.datetime.strptime(
            str(present), "%Y-%m-%d %H:%M:%S.%f")
        present = present.strftime("%Y-%m-%d %H:%M:%S")
        present = datetime.datetime.strptime(present, "%Y-%m-%d %H:%M:%S")
        target = item.expire_date
        target = datetime.datetime.strptime(
            str(target) + " 11:00:00", "%Y-%m-%d %H:%M:%S")
        differ_sec = (target-present).total_seconds()
        if differ_sec <= 604800 and differ_sec > 518400:
            notifi_poa.append(item)
    for item in notifi_poa:
        possible_employee = []
        doc = frappe.get_doc("Power of Attorney", item.name)
        possible_employee = [i.employee for i in doc.agent if i.employee]
        noti_emp_email = []
        for item in possible_employee:
            emp = frappe.get_value("Employee", item, "prefered_email")
            noti_emp_email.append(emp)
        if noti_emp_email:
            frappe.sendmail(recipients=noti_emp_email, subject=f"Reminder: {doc.name} will expire in less than 7 days!", args=dict(
                poa=doc.name,
                poa_no=doc.poa_no,
                issue_date=doc.issue_date,
                issue_hijri=doc.issue_date_in_hijri,
                expire_date=doc.expire_date,
                expire_hijri=doc.expire_date_in_hijri,
                customer=doc.customer,
            ), template="reminder_7d_expire_poa", delayed=False)


def reminder_court_session():
    sessions = frappe.get_list("Court Session", fields=[
                               "name", "session_date", "session_time", "agent"])
    for item in sessions:
        present = present_time()
        present = datetime.datetime.strptime(
            str(present), "%Y-%m-%d %H:%M:%S.%f")
        present = present.strftime("%Y-%m-%d %H:%M:%S")
        present = datetime.datetime.strptime(present, "%Y-%m-%d %H:%M:%S")
        target_date = item.session_date
        if item.session_time:
            target_time = item.session_time
            target_time = str(target_time).split(".")[0]
        else:
            # if there is no fixed time. 10 am will be deafult
            target_time = "10:00:00"
        target = str(target_date)+" "+target_time
        target = datetime.datetime.strptime(target, "%Y-%m-%d %H:%M:%S")
        differ_sec = (target-present).total_seconds()
        if differ_sec <= 86400 and differ_sec > 82800:
            doc = frappe.get_doc("Court Session", item.name)
            agent_address = frappe.get_value(
                "Employee", doc.agent, "prefered_email")
            frappe.sendmail(recipients=agent_address, subject=f"Reminder: Court {doc.name} will start in less than 24 hours!", args=dict(
                session_name=doc.name,
                session_link=doc.session_link_url,
                session_date=doc.session_date,
                session_hijri=doc.date_in_hirji,
                session_time=doc.session_time,
                session_poa=doc.poa,
                session_case=doc.case_session,
                session_court=doc.court,
                case_status=doc.case_status
            ), template="reminder_24h_courtSessionTime", delayed=False)


def reminder_after_task_dueDate():
    tasks = frappe.get_list("Task", filters=[["is_approved", "=", "0"]], fields=[
                            "name", "is_approved", "due_date"])
    tasks = [item for item in tasks if item.due_date]
    notifi_due_date = []
    for item in tasks:
        present = present_time()
        # present = "2023-10-02 11:18:00.0"
        present = datetime.datetime.strptime(
            str(present), "%Y-%m-%d %H:%M:%S.%f")
        present = present.strftime("%Y-%m-%d %H:%M:%S")
        present = datetime.datetime.strptime(present, "%Y-%m-%d %H:%M:%S")
        target = item.due_date
        # 10am set default
        target = datetime.datetime.strptime(
            str(target) + " 09:59:59", "%Y-%m-%d %H:%M:%S")
        differ_sec = (target-present).total_seconds()
        if differ_sec < 0 and differ_sec >= -3600:
            notifi_due_date.append(item)

    for item in notifi_due_date:
        possible_employee = []
        doc = frappe.get_doc("Task", item.name)
        possible_employee = [
            i.user for i in doc.assign_to if i.work_status != "Done"]
        due_emp_email = []
        for item in possible_employee:
            emp = frappe.get_value("Employee", item, "prefered_email")
            due_emp_email.append(emp)
        if due_emp_email:
            if doc.task_supervisor_:
                supervior = frappe.get_value(
                    "Employee", doc.task_supervisor_, "prefered_email")
                due_emp_email.append(supervior)
            frappe.sendmail(recipients=due_emp_email, subject=f"Task Due Date Fail: {doc.name} !", args=dict(
                task_name=doc.name,
                due_date=doc.due_date,
                task_status=doc.task_status
            ), template="reminder_after_task_dueDate", delayed=False)


def reminder_task_dueDate():
    tasks = frappe.get_list("Task", filters=[["is_approved", "=", "0"]], fields=[
                            "name", "is_approved", "due_date"])
    tasks = [item for item in tasks if item.due_date]
    notifi_due_date = []
    for item in tasks:
        present = present_time()
        # present = "2023-10-02 10:00:00.0"
        present = datetime.datetime.strptime(
            str(present), "%Y-%m-%d %H:%M:%S.%f")
        present = present.strftime("%Y-%m-%d %H:%M:%S")
        present = datetime.datetime.strptime(present, "%Y-%m-%d %H:%M:%S")
        target = item.due_date
        # set 10 AM as Default
        target = datetime.datetime.strptime(
            str(target) + " 10:00:00", "%Y-%m-%d %H:%M:%S")
        differ_sec = (target-present).total_seconds()
        if differ_sec <= 86400 and differ_sec >= 82800:
            notifi_due_date.append(item)

    for item in notifi_due_date:
        possible_employee = []
        doc = frappe.get_doc("Task", item.name)
        possible_employee = [
            i.user for i in doc.assign_to if i.work_status != "Done"]
        due_emp_email = []
        for item in possible_employee:
            emp = frappe.get_value("Employee", item, "prefered_email")
            due_emp_email.append(emp)
        if due_emp_email:
            if doc.task_supervisor_:
                supervior = frappe.get_value(
                    "Employee", doc.task_supervisor_, "prefered_email")
                due_emp_email.append(supervior)
            frappe.sendmail(recipients=due_emp_email, subject=f"Reminder: {doc.name} is Due in less than 24 hours!", args=dict(
                task_name=doc.name,
                due_date=doc.due_date
            ), template="reminder_24h_task_dueDate", delayed=False)


def present_time():
    local_tz = pytz.timezone("Asia/Riyadh")
    return datetime.datetime.now(local_tz).strftime("%Y-%m-%d %H:%M:%S.%f")

###########################################
################# END#######################


@frappe.whitelist()
def value(doctype, docname, field):
    return frappe.get_value(doctype, docname, field)


@frappe.whitelist()
def attach_file(doctype, docname):
    return frappe.get_all("File", fields=["*"], filters=[["attached_to_doctype", "=", doctype], ["attached_to_name", "=", docname], ["attached_to_field", "=", ""]])


@frappe.whitelist()
def get_doc_record_detail_sql(doctype, docname):
    return frappe.db.sql('''Select * from `tab{}` Where name='{}';'''.format(doctype, docname), as_dict=True)


@frappe.whitelist()
def create_doc(obj):
    # obj2 = {
    #     "doctype": "Court",
    #     "court_name": "Test COurt",
    #     "country": "UAE",
    #     "city": "Abu Dhabi"
    # }
    obj = eval(obj)
    doc = frappe.get_doc(obj)
    doc.insert()
    return doc


@frappe.whitelist()
def who_am_i():
    user = frappe.get_doc("User", frappe.session.data.user)
    modifyData = frappe.session.data
    modifyData.full_name = user.full_name
    modifyData.employee_id = frappe.db.sql(
        """Select name From tabEmployee where prefered_email='{}';""".format(modifyData.user))
    allowed_doctypes = []
    all_doctypes = frappe.db.get_all("DocType")
    for doc in all_doctypes:
        if frappe.has_permission(doc.name):
            allowed_doctypes.append(doc.name)

    return {
        "userSession": modifyData,
        "roles": frappe.get_roles(),
        "allowed_doctypes": allowed_doctypes
    }

# def checkAccess():
#     allowed_doctypes = []
#     all_doctypes = frappe.db.get_all("DocType")
#     for doc in all_doctypes:
#         if frappe.has_permission(doc.name):
#             allowed_doctypes.append(doc.name)


@frappe.whitelist()
def documents():
    return frappe.get_all("File", filters={
        'owner': frappe.session.user
    }, fields=["*"])


@frappe.whitelist()
def gehr_data():
    return frappe.get_single("GEHR")


# @frappe.whitelist()
# def employee():
#     admin = []
#     manager = []
#     team_head_lawyer=[]
#     lawyer=[]
#     legal_secretary=[]
#     accountant=[]
#     hr =[]
#     page = int(page)
#     limit = 3
#     skip = (page-1) * limit
#     nextPage = False
#     emp_list = frappe.db.sql('''Select employee , employee_name,technical_position,type_of_job from tabEmployee;''',as_dict=True)
#     emp_list_final = []
#     for emp in emp_list:
#         task = frappe.db.sql('''Select count(*) as taskNumber from tabUserChildTable where user='{}';'''.format(emp.employee),as_dict=True)[0]
#         emp.taskNumber = task.taskNumber
#         if emp.type_of_job == "Admin":
#             admin.append(emp)
#         elif emp.type_of_job == "Manager":
#             manager.append(emp)
#         elif emp.type_of_job == "Team Head Lawyer":
#             team_head_lawyer.append(emp)
#         elif emp.type_of_job == "Lawyer":
#             lawyer.append(emp)
#         elif emp.type_of_job == "Legal Secretary":
#             legal_secretary.append(emp)
#         elif emp.type_of_job == "Accountant":
#             accountant.append(emp)
#         elif emp.type_of_job == "HR":
#             hr.append(emp)
#         emp_list_final.append(emp)


#     type_of_job = ["Admin","Manager","Team Head Lawyer","Lawyer","Legal Secretary","Accountant","HR"]
#     type_of_job_ar = [{"Admin":admin},{"Manager":manager},{"Team Head Lawyer":team_head_lawyer},{"Lawyer":lawyer},{"Legal Secretary":legal_secretary},{"Accountant":accountant},{"HR":hr}]

#     if len(type_of_job)-skip > limit:
#         nextPage = True
#     return {"employees": type_of_job_ar[skip:skip+limit], "type_of_job": type_of_job, "nextPage": nextPage}


@frappe.whitelist()
def search(doctype, txt, reference_doctype, filters, ignore_user_permissions):
    # print(doctype, txt, query, filters, page_length, searchfield,
    #       reference_doctype, ignore_user_permissions)

    # return doctype, txt, doctype:"Employee"query, filters, page_length, searchfield, reference_doctype, ignore_user_permissions
    result = search_link(doctype, txt, reference_doctype,
                         filters, ignore_user_permissions)
    return result


@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def get_custom_task(doctype, txt, searchfield, start, page_len, filters):
    if frappe.session.user == "Administrator":
        return frappe.db.sql("""select name from `tabTask` where name like %(txt)s""", {"txt": "%%%s%%" % txt})
    else:
        employee_id = frappe.db.sql("""select name from `tabEmployee` where prefered_email like %(txt)s""", {
                                    "txt": "%%%s%%" % frappe.session.user})
        data = frappe.db.sql(
            """select parent from `tabUserChildTable` where user=%s and work_status !=%s""", (employee_id[0], "Done"))
        data = [item for item in data if frappe.get_value(
            "Task", item, "is_approved") == 0]
        return data


class WorkTime(Document):
    def on_update(self):
        try:
            doc = frappe.get_doc("WorkTime", self.name)
            print(
                "|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||")
            if doc.task and doc.user:
                main_task = frappe.get_doc("Task", doc.task)
                for assign_task in main_task.assign_to:
                    if assign_task.user == doc.user:
                        if assign_task.work_status == "Pending":
                            change_task_status(
                                doc.user, doc.task, "Processing")
        except Exception as e:
            return e
