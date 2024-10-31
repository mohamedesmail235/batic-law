from frappe.model.workflow import get_transitions
from frappe.model.workflow import apply_workflow

import frappe
from frappe.utils import pretty_date
from datetime import date
from datetime import timedelta
from datetime import datetime, timezone
import pytz
import holidays
import json
from bs4 import BeautifulSoup
import ast


@frappe.whitelist()
def get_dashboard_status():
    try:
        total_customer = frappe.db.sql(
            """SELECT count(*) as total_customer  FROM `tabCustomer`""", as_dict=True)
        total_satisfied = frappe.db.sql(
            """SELECT count(*) as satisfied_customer  FROM `tabCase` where legal_case_result="Win";""", as_dict=True)
        total_success_cases = frappe.db.sql(
            """SELECT count(*) as success_case  FROM `tabCase` where legal_case_result="Win";""", as_dict=True)
        total_quotation_request = frappe.db.sql(
            """SELECT count(*) as quotation_request  FROM `tabQuotation` where status="Open";""", as_dict=True)
        total_new_customer = frappe.db.sql(
            """SELECT customer FROM `tabOrder`""", as_dict=True)

        old_customer = []
        for customer in total_new_customer:
            old_customer.append(customer.customer)

        result = {
            "total_customer": total_customer[0].total_customer,
            "total_satisfied": total_satisfied[0].satisfied_customer,
            "total_success_cases": total_success_cases[0].success_case,
            "total_quotation_request": total_quotation_request[0].quotation_request,
            "total_new_customer": total_customer[0].total_customer-len(set(old_customer))
        }

        return result,
    except Exception as e:
        return e


@frappe.whitelist()
def get_case_status():
    try:
        active_case = frappe.db.sql(
            """SELECT count(*) as active_case FROM `tabCase` where case_status_workflow!="Closed" and case_status_workflow!="Cancelled" """, as_dict=True)
        finished_case = frappe.db.sql(
            """SELECT count(*) as finished_case FROM `tabCase` where case_status_workflow="Closed" """, as_dict=True)
        case_won = frappe.db.sql(
            """SELECT count(*) as case_won FROM `tabCase` where legal_case_result="Win" """, as_dict=True)
        accepted_case = frappe.db.sql(
            """SELECT count(*) as accepted_case FROM `tabCase` where case_status_workflow!="Draft" and case_status_workflow!="Cancelled" """, as_dict=True)

        return {
            "active_case": active_case[0].active_case,
            "finished_case": finished_case[0].finished_case,
            "case_won": case_won[0].case_won,
            "accepted_case": accepted_case[0].accepted_case
        }
    except Exception as e:
        return e


@frappe.whitelist()
def get_chart_data():
    try:
        current_date = datetime.now().date()
        dates_array = []
        dates_arrayV2 = []
        value_array = []
        dates_object = {}

        for i in range(15):
            date = current_date - timedelta(days=i)
            dates_array.append(date.strftime("%Y-%m-%d"))

        for date in dates_array:
            dates_object[date] = 0
        all_creation_dateTime = frappe.db.sql(
            """SELECT creation FROM tabCase;""", as_dict=True)

        for item in all_creation_dateTime:
            date = str(item['creation']).split(" ")[0]
            if date in dates_array:
                dates_object[date] = dates_object[date]+1
        for item in dates_array:
            value_array.append(dates_object[item])

        for date_str in dates_array:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d")
            dates_arrayV2.append(str(date_obj.strftime("%B %d")))

        return {"data": dates_object, "x-axis": dates_array, "x-axis-v2": dates_arrayV2, "y-axis": value_array}
    except Exception as e:
        return e


@frappe.whitelist()
def get_todo_status():
    try:
        todos = frappe.db.sql("""SELECT description, date FROM `tabToDo` where owner='{}' ORDER BY date DESC Limit 10""".format(
            frappe.session.user), as_dict=True)

        for item in todos:
            soup = BeautifulSoup(item.description, 'html.parser')
            item.description = soup.get_text()
        return todos
    except Exception as e:
        return e


@frappe.whitelist()
def get_recent_customers():
    try:
        recent = frappe.db.sql(
            """SELECT customer_name, customer_type, image FROM `tabCustomer` ORDER BY modified DESC LIMIT 5""", as_dict=True)
        all_order = []
        for item in recent:
            quotation = frappe.db.sql(
                """SELECT count(*) as number_of_quotation FROM `tabQuotation` where customer_name='{}';""".format(item.customer_name), as_dict=True)
            order = frappe.db.sql(
                """SELECT count(*) as number_of_order FROM `tabOrder` where customer='{}';""".format(item.customer_name), as_dict=True)
            invoice = frappe.db.sql(
                """SELECT count(*) as number_of_invoice FROM `tabSales Invoice` where customer_name='{}';""".format(item.customer_name), as_dict=True)
            payment = frappe.db.sql(
                """SELECT count(*) as number_of_payment FROM `tabPayment Entry` where party_name='{}';""".format(item.customer_name), as_dict=True)

            item.number_of_order = order[0].number_of_order
            item.number_of_quotation = quotation[0].number_of_quotation
            item.number_of_invoice = invoice[0].number_of_invoice
            item.number_of_payment = payment[0].number_of_payment

            all_order.append(item)
        return all_order
    except Exception as e:
        return e


@frappe.whitelist()
def get_customers():
    try:
        recent = frappe.db.sql(
            """SELECT customer_name, customer_type, name FROM `tabCustomer`""", as_dict=True)
        all_order = []
        for item in recent:
            quotation = frappe.db.sql(
                """SELECT count(*) as number_of_quotation FROM `tabQuotation` where customer_name='{}';""".format(item.customer_name), as_dict=True)
            order = frappe.db.sql(
                """SELECT count(*) as number_of_order FROM `tabOrder` where customer='{}';""".format(item.customer_name), as_dict=True)
            invoice = frappe.db.sql(
                """SELECT count(*) as number_of_invoice FROM `tabSales Invoice` where customer_name='{}';""".format(item.customer_name), as_dict=True)
            payment = frappe.db.sql(
                """SELECT count(*) as number_of_payment FROM `tabPayment Entry` where party_name='{}';""".format(item.customer_name), as_dict=True)

            item.number_of_order = order[0].number_of_order
            item.number_of_quotation = quotation[0].number_of_quotation
            item.number_of_invoice = invoice[0].number_of_invoice
            item.number_of_payment = payment[0].number_of_payment

            all_order.append(item)
        return all_order
    except Exception as e:
        return e


@frappe.whitelist()
def get_case_list(page, limit, filters=None):
    # //client / ID /case Number / begin /
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        case_list = []
        if filters == None:
            docs = frappe.get_all("Case", fields=["*"])
        else:
            filters = eval(filters)
            docs = frappe.get_all("Case", fields=["*"], filters=filters)
        if len(docs) > skip+limit:
            nextpage = True
        for case in docs[skip:skip+limit]:
            case.case_no = case.case_no
            case.start_date = str(case.start_date) + " or " + \
                str(case.start_date_in_hijri)
            soup = BeautifulSoup(case.description, 'html.parser')
            case.description = soup.get_text()
            case_list.append(case)
        return {"data": case_list, "nextpage": nextpage, "total_docs": len(docs)}
    except Exception as e:
        return e


@frappe.whitelist()
def get_order_list(page, limit, filters=None):
    # //client / ID /case Number / begin /
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []
        if filters == None:
            docs = frappe.get_all("Order", fields=["*"])
        else:
            filters = eval(filters)
            docs = frappe.get_all("Order", fields=["*"], filters=filters)
        if len(docs) > skip+limit:
            nextpage = True
        for doc in docs[skip:skip+limit]:
            soup = BeautifulSoup(doc.order_details, 'html.parser')
            doc.order_details = crop_string(soup.get_text(), 100)
            doc_list.append(doc)

        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(docs)}
    except Exception as e:
        return e


@frappe.whitelist()
def get_quotation_list(page, limit, filters=None):
    # //client / ID /case Number / begin /
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []
        if filters == None:
            docs = frappe.get_all("Quotation", fields=[
                                  "name", "customer_name", "calculation_type", "order_type_custom", "status", "sales_order", "rounded_total"])
        else:
            filters = eval(filters)
            docs = frappe.get_all("Quotation", fields=["name",
                                  "customer_name", "calculation_type", "order_type_custom", "status", "sales_order", "rounded_total"], filters=filters)
        if len(docs) > skip+limit:
            nextpage = True
        for doc in docs[skip:skip+limit]:
            doc_list.append(doc)

        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(docs)}
    except Exception as e:
        return e


@frappe.whitelist()
def get_contract_list(page, limit, filters=None):
    # //client / ID /case Number / begin /
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []
        if filters == None:
            docs = frappe.get_all("Contract", fields=[
                                  "name", "party_name", "is_signed", "contract_type", "calculation_type", "contract_details", "status", "contract_terms", "flat_fee_type", "quotation"])
        else:
            filters = eval(filters)
            docs = frappe.get_all("Contract", fields=[
                                  "name", "party_name", "is_signed", "contract_type", "calculation_type", "contract_details", "status", "contract_terms", "flat_fee_type", "quotation"], filters=filters)
        if len(docs) > skip+limit:
            nextpage = True
        for doc in docs[skip:skip+limit]:
            soup = BeautifulSoup(doc.contract_details, 'html.parser')
            doc.contract_details_text = soup.get_text()
            soup = BeautifulSoup(doc.contract_terms, 'html.parser')
            doc.contract_terms_text = soup.get_text()
            doc_list.append(doc)

        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(docs)}
    except Exception as e:
        return e


@frappe.whitelist()
def get_consultation_list(page, limit, filters=None):
    # //client / ID /case Number / begin /
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []
        if filters == None:
            docs = frappe.get_all("Consultations", fields=["*"])
        else:
            filters = eval(filters)
            docs = frappe.get_all("Consultations", fields=[
                                  "*"], filters=filters)
        if len(docs) > skip+limit:
            nextpage = True
        for doc in docs[skip:skip+limit]:
            soup = BeautifulSoup(doc.consultation_description, 'html.parser')
            doc.consultation_description_text = soup.get_text()
            doc_list.append(doc)

        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(docs)}
    except Exception as e:
        return e


@frappe.whitelist()
def get_employee_list(page, limit, filters=None):
    # //client / ID /case Number / begin /
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []

        if filters == None:
            docs = frappe.get_all("Employee", fields=["*"])
        else:
            filters = eval(filters)
            docs = frappe.get_all("Employee", fields=[
                                  "*"], filters=filters)
        if len(docs) > skip+limit:
            nextpage = True
        for doc in docs[skip:skip+limit]:
            doc_list.append(doc)

        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(docs)}
    except Exception as e:
        return e


@frappe.whitelist()
def get_evidence_list(page, limit, filters=None):
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []
        if filters == None:
            docs = frappe.get_all("Evidence", fields=["*"])
        else:
            filters = eval(filters)
            docs = frappe.get_all("Evidence", fields=[
                                  "*"], filters=filters)
        if len(docs) > skip+limit:
            nextpage = True
        for doc in docs[skip:skip+limit]:
            doc_list.append(doc)

        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(docs)}

    except Exception as e:
        return e


@frappe.whitelist()
def get_poa_list(page, limit, filters=None):
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []
        if filters == None:
            docs = frappe.get_all("Power of Attorney", fields=["*"])
        else:
            filters = eval(filters)
            docs = frappe.get_all("Power of Attorney", fields=[
                                  "*"], filters=filters)
        if len(docs) > skip+limit:
            nextpage = True
        for doc in docs[skip:skip+limit]:
            doc_list.append(doc)

        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(docs)}

    except Exception as e:
        return e


@frappe.whitelist()
def get_case_category_list(page, limit, filters=None):
    # //client / ID /case Number / begin /
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []
        if filters == None:
            docs = frappe.get_all("Case Category", fields=["*"])
        else:
            filters = eval(filters)
            docs = frappe.get_all("Case Category", fields=[
                                  "*"], filters=filters)
        if len(docs) > skip+limit:
            nextpage = True
        for doc in docs[skip:skip+limit]:
            doc_list.append(doc)

        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(docs)}
    except Exception as e:
        return e


@frappe.whitelist()
def get_court_session_list(page, limit, filters=None):
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []
        if filters == None:
            docs = frappe.get_all("Court Session", fields=["*"])
        else:
            filters = eval(filters)
            docs = frappe.get_all("Court Session", fields=[
                                  "*"], filters=filters)

        if len(docs) > skip+limit:
            nextpage = True
        for doc in docs[skip:skip+limit]:
            doc_list.append(doc)

        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(docs)}
    except Exception as e:
        return e


@frappe.whitelist()
def get_consultation_category_list(page, limit, filters=None):
    # //client / ID /case Number / begin /
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []
        if filters == None:
            docs = frappe.get_all("Consultation Category", fields=["*"])
        else:
            filters = eval(filters)
            docs = frappe.get_all("Consultation Category", fields=[
                                  "*"], filters=filters)
        if len(docs) > skip+limit:
            nextpage = True
        for doc in docs[skip:skip+limit]:
            doc_list.append(doc)

        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(docs)}
    except Exception as e:
        return e


@frappe.whitelist()
def get_task_list(page, limit, filters=None):
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []
        if filters == None:
            docs = frappe.get_all("Task", fields=["*"])
        else:
            filters = eval(filters)
            docs = frappe.get_all("Task", fields=["*"], filters=filters)
        if len(docs) > skip+limit:
            nextpage = True
        for doc in docs[skip:skip+limit]:
            doc_list.append(doc)

        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(docs)}
    except Exception as e:
        return e


@frappe.whitelist()
def get_court_list(page, limit):
    # //client / ID /case Number / begin /
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []
        docs = frappe.db.sql(
            """SELECT * FROM `tabCourt`  ORDER BY modified DESC""", as_dict=True)
        if len(docs) > skip+limit:
            nextpage = True
        for doc in docs[skip:skip+limit]:
            doc_list.append(doc)

        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(docs)}
    except Exception as e:
        return e


@frappe.whitelist()
def get_judge_list(page, limit):
    # //client / ID /case Number / begin /
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []
        docs = frappe.db.sql(
            """SELECT * FROM `tabJudge`  ORDER BY modified DESC""", as_dict=True)
        if len(docs) > skip+limit:
            nextpage = True
        for doc in docs[skip:skip+limit]:
            doc_list.append(doc)

        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(docs)}
    except Exception as e:
        return e


@frappe.whitelist()
def get_section_list(page, limit):
    # //client / ID /case Number / begin /
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []
        docs = frappe.db.sql(
            """SELECT * FROM `tabSection`  ORDER BY modified DESC""", as_dict=True)
        if len(docs) > skip+limit:
            nextpage = True
        for doc in docs[skip:skip+limit]:
            doc_list.append(doc)

        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(docs)}
    except Exception as e:
        return e


@frappe.whitelist()
def get_customer_list(page, limit):
    # //client / ID /case Number / begin /
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []

        docs = frappe.db.sql(
            """SELECT customer_name, customer_type, name FROM `tabCustomer`""", as_dict=True)
        all_order = []
        for item in docs:
            quotation = frappe.db.sql(
                """SELECT count(*) as number_of_quotation FROM `tabQuotation` where customer_name='{}';""".format(item.customer_name), as_dict=True)
            order = frappe.db.sql(
                """SELECT count(*) as number_of_order FROM `tabOrder` where customer='{}';""".format(item.customer_name), as_dict=True)
            invoice = frappe.db.sql(
                """SELECT count(*) as number_of_invoice FROM `tabSales Invoice` where customer_name='{}';""".format(item.customer_name), as_dict=True)
            payment = frappe.db.sql(
                """SELECT count(*) as number_of_payment FROM `tabPayment Entry` where party_name='{}';""".format(item.customer_name), as_dict=True)

            item.number_of_order = order[0].number_of_order
            item.number_of_quotation = quotation[0].number_of_quotation
            item.number_of_invoice = invoice[0].number_of_invoice
            item.number_of_payment = payment[0].number_of_payment

            all_order.append(item)
        if len(docs) > skip+limit:
            nextpage = True
        for doc in docs[skip:skip+limit]:
            doc_list.append(doc)

        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(docs)}
    except Exception as e:
        return e


@frappe.whitelist()
def docs_filter_paginate(doctype, page, limit, filters=None):
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []
        # docs = frappe.db.sql(
        #     """SELECT * FROM `tab{}`  ORDER BY modified DESC""".format(doctype), as_dict=True)
        # if field != None:
        #     docs = [item for item in docs if item[field] == value]

        if filters == None:
            docs = frappe.get_all(doctype, fields=["*"])
        else:
            filters = eval(filters)
            docs = frappe.get_all(
                doctype, fields=["*"], filters=filters)
        if len(docs) > skip+limit:
            nextpage = True
        for doc in docs[skip:skip+limit]:
            doc_list.append(doc)

        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(docs)}
    except Exception as e:
        return e


@frappe.whitelist()
def case_overview(case_no):
    try:
        case = frappe.db.sql("""SELECT customer,name, owner,  case_title , description, start_date, start_date_in_hijri, close_date, close_date_in_hijri, case_category,legal_case_result, case_status_workflow FROM `tabCase` where case_no='{}';""".format(case_no), as_dict=True)
        if len(case) > 0:
            case = case[0]
            agents = frappe.db.sql(
                """SELECT employee FROM `tabCase Agents` where parent='{}';""".format(case.name), as_dict=True)
            employees = []
            for agent in agents:
                employee = frappe.get_doc("Employee", agent.employee)
                employees.append({"name": employee.employee_name,
                                  "employee_id": employee.employee})
        else:
            agents = []

        case.start_date = str(case.start_date) + " or " + \
            str(case.start_date_in_hijri)
        case.close_date = str(case.close_date) + " or " + \
            str(case.close_date_in_hijri)
        case.create_case = case.owner
        soup = BeautifulSoup(case.description, 'html.parser')
        case.description = crop_string(soup.get_text(), 100)
        case.agents = employees

        tasks = []
        child_task = []

        case.ParentTask = frappe.db.sql(
            """SELECT name, subject, task_supervisor_ , depends_on_tasks from `tabTask` where is_group=1 and linked_document='{}';""".format(case.name), as_dict=True)
        all_tasks = frappe.db.sql(
            """SELECT name, subject, task_supervisor_ , depends_on_tasks from `tabTask` where linked_document='{}';""".format(case.name), as_dict=True)
        case.final_task = []
        task_view = []
        for task in case.ParentTask:
            task_view.append(task)
            task_child_list = task.depends_on_tasks
            task_child_list = task_child_list.split(",")
            task_child_list.pop()
            for task_child in task_child_list:
                task_c = frappe.db.sql("""SELECT name, subject , task_supervisor_ depends_on_tasks from `tabTask` where name='{}' ORDER BY modified DESC;""".format(
                    task_child), as_dict=True)
                task_view.append(task_c[0])
                child_task.append(task_c[0])
            task.child_task = child_task
            tasks.append(task)
            case.final_task.append(tasks[0])
            child_task = []
            tasks = []

        all_task_name = []
        all_task_view_name = []
        for task in all_tasks:
            all_task_name.append(task.name)
        for task in task_view:
            all_task_view_name.append(task.name)

        set1 = set(all_task_name)
        set2 = set(all_task_view_name)

        # Find uncommon elements
        uncommon_elements = list(set1.symmetric_difference(set2))

        for task in uncommon_elements:
            task_c = frappe.db.sql(
                """SELECT name, subject , task_supervisor_ depends_on_tasks from `tabTask` where name='{}';""".format(task), as_dict=True)
            case.final_task.append(task_c[0])

        case.evidence = frappe.db.sql(
            """select description, attach_document from tabEvidence where  `case`= '{}';""".format(case.name), as_dict=True)

        invoice_list = frappe.db.sql(
            """select name, due_date, grand_total,rounded_total,status, outstanding_amount, customer,docstatus from `tabSales Invoice` where  linked_document= '{}' ORDER BY modified DESC;""".format(case.name), as_dict=True)

        payment_entry_list = []

        total_bill = 0
        payment = 0
        outstanding_amount = 0
        for invoice in invoice_list:
            if invoice.docstatus == 1:
                total_bill += invoice.rounded_total
                outstanding_amount += invoice.outstanding_amount
            filters = {"reference_name": ["in", invoice.name]}
            payment_entry_ref = frappe.get_all(
                "Payment Entry Reference", filters=filters, fields=["*"], order_by="modified desc")
            if payment_entry_ref:
                for item in payment_entry_ref:
                    temp_data = frappe.get_doc(
                        "Payment Entry", item.parent)
                    temp_data.invoice_name = invoice.name
                    temp_data.invoice_status = invoice.status
                    payment_entry_list.append({
                        "name": temp_data.name,
                        "paid_amount": temp_data.paid_amount,
                        "paid_amount_after_tax": temp_data.paid_amount_after_tax,
                        "invoice_name": temp_data.invoice_name,
                        "invoice_status": temp_data.invoice_status,
                        "total_allocated_amount": temp_data.total_allocated_amount,
                        "unallocated_amount": temp_data.unallocated_amount,
                        "docstatus": temp_data.docstatus
                    })

        payment = total_bill - outstanding_amount
        need_to_be = total_bill - payment
        case.invoice = {
            "invoice": invoice_list,
            "total_bill": total_bill,
            "payment": payment,
            "need_to_be_pay": need_to_be
        }

        case.payment = {
            "payments": payment_entry_list,
            "total_bill": total_bill,
            "payment": payment,
            "need_to_be_pay": need_to_be
        }

        worktHistory = get_total_work_hour_record('Case', case.name)
        total_work_hour = worktHistory['total_order_Work']
        total_work_attempt = 0
        employees = []
        worktimes = []
        for task in worktHistory["taskDetails"]:
            total_work_attempt += len(task['workTime'])
            for work in task['workTime']:
                employees.append(work.user)
                worktimes.append({
                    "user": work.user,
                    "user_name": work.user_name,
                    "task": work.task,
                    "spend_time": work.spend_session_time,
                    "description": work.description,
                    "date": str(work.creation).split(" ")[0]
                })

        employees = set(employees)

        employee_participate = len(employees)

        case.workhistory = {
            "total_work_hour": total_work_hour,
            "total_work_attempt": total_work_attempt,
            "employee_participate": employee_participate,
            "workRecords": worktimes
        }

        # court session
        used_poa = []
        filters = {"case_session": "Case-"+case_no}
        court_session = frappe.get_all(
            "Court Session", filters=filters, fields=["*"])

        for session in court_session:
            if session.poa != "":
                used_poa.append(session.poa)

        used_poa = set(used_poa)
        used_poa = list(used_poa)

        poa_data = []
        for item in used_poa:
            poa_data.append(frappe.get_doc("Power of Attorney", item))

        case.court_session = court_session

        case.poa = poa_data

        return case
    except Exception as e:
        return e


@frappe.whitelist()
def consultations_overview_details(consultation_name):
    try:
        # consultation = frappe.get_doc("Consultations", consultation_name)
        consultation = frappe.db.sql(
            """SELECT * FROM `tabConsultations` where name='{}';""".format(consultation_name), as_dict=True)

        if len(consultation) > 0:
            consultation = consultation[0]

            agents = frappe.db.sql(
                """SELECT agent FROM `tabContract-Agents` where parent='{}';""".format(consultation_name), as_dict=True)

            employees = []
            for agent in agents:
                employee = frappe.get_doc("Employee", agent.agent)
                employees.append({"name": employee.employee_name,
                                  "employee_id": employee.employee})
        else:
            agents = []

        consultation.agents = employees

        tasks = []
        child_task = []

        consultation.ParentTask = frappe.db.sql(
            """SELECT name, subject, task_supervisor_ , depends_on_tasks from `tabTask` where is_group=1 and linked_document='{}';""".format(consultation.name), as_dict=True)
        all_tasks = frappe.db.sql(
            """SELECT name, subject, task_supervisor_ , depends_on_tasks from `tabTask` where linked_document='{}';""".format(consultation.name), as_dict=True)
        consultation.final_task = []
        task_view = []
        for task in consultation.ParentTask:
            task_view.append(task)
            task_child_list = task.depends_on_tasks
            task_child_list = task_child_list.split(",")
            task_child_list.pop()
            for task_child in task_child_list:
                task_c = frappe.db.sql("""SELECT name, subject , task_supervisor_ depends_on_tasks from `tabTask` where name='{}' ORDER BY modified DESC;""".format(
                    task_child), as_dict=True)
                task_view.append(task_c[0])
                child_task.append(task_c[0])
            task.child_task = child_task
            tasks.append(task)
            consultation.final_task.append(tasks[0])
            child_task = []
            tasks = []

        all_task_name = []
        all_task_view_name = []
        for task in all_tasks:
            all_task_name.append(task.name)
        for task in task_view:
            all_task_view_name.append(task.name)

        set1 = set(all_task_name)
        set2 = set(all_task_view_name)

        # Find uncommon elements
        uncommon_elements = list(set1.symmetric_difference(set2))

        for task in uncommon_elements:
            task_c = frappe.db.sql(
                """SELECT name, subject , task_supervisor_ depends_on_tasks from `tabTask` where name='{}';""".format(task), as_dict=True)
            consultation.final_task.append(task_c[0])

        invoice_list = frappe.db.sql(
            """select name, due_date, grand_total,rounded_total,status, outstanding_amount, customer,docstatus from `tabSales Invoice` where  linked_document= '{}' ORDER BY modified DESC;""".format(consultation.name), as_dict=True)

        payment_entry_list = []

        total_bill = 0
        payment = 0
        outstanding_amount = 0
        for invoice in invoice_list:
            if invoice.docstatus == 1:
                total_bill += invoice.rounded_total
                outstanding_amount += invoice.outstanding_amount

            filters = {"reference_name": ["in", invoice.name]}
            payment_entry_ref = frappe.get_all(
                "Payment Entry Reference", filters=filters, fields=["*"], order_by="modified desc")
            if payment_entry_ref:
                for item in payment_entry_ref:
                    temp_data = frappe.get_doc(
                        "Payment Entry", item.parent)
                    temp_data.invoice_name = invoice.name
                    temp_data.invoice_status = invoice.status
                    payment_entry_list.append({
                        "name": temp_data.name,
                        "paid_amount": temp_data.paid_amount,
                        "paid_amount_after_tax": temp_data.paid_amount_after_tax,
                        "invoice_name": temp_data.invoice_name,
                        "invoice_status": temp_data.invoice_status,
                        "total_allocated_amount": temp_data.total_allocated_amount,
                        "unallocated_amount": temp_data.unallocated_amount,
                        "docstatus": temp_data.docstatus
                    })

        payment = total_bill - outstanding_amount
        need_to_be = total_bill - payment
        consultation.invoice = {
            "invoice": invoice_list,
            "total_bill": total_bill,
            "payment": payment,
            "need_to_be_pay": need_to_be
        }

        consultation.payment = {
            "payments": payment_entry_list,
            "total_bill": total_bill,
            "payment": payment,
            "need_to_be_pay": need_to_be
        }

        worktHistory = get_total_work_hour_record(
            'Consultations', consultation.name)
        total_work_hour = worktHistory['total_order_Work']
        total_work_attempt = 0
        employees = []
        worktimes = []
        for task in worktHistory["taskDetails"]:
            total_work_attempt += len(task['workTime'])
            for work in task['workTime']:
                employees.append(work.user)
                worktimes.append({
                    "user": work.user,
                    "user_name": work.user_name,
                    "task": work.task,
                    "spend_time": work.spend_session_time,
                    "description": work.description,
                    "date": str(work.creation).split(" ")[0]
                })

        employees = set(employees)

        employee_participate = len(employees)

        consultation.workhistory = {
            "total_work_hour": total_work_hour,
            "total_work_attempt": total_work_attempt,
            "employee_participate": employee_participate,
            "workRecords": worktimes
        }

        return consultation
    except Exception as e:
        return e


@frappe.whitelist()
def employee_overview(employee_id):
    try:
        tasks = frappe.db.sql(
            """SELECT name, name1, parent, user, work_status FROM `tabUserChildTable` where user='{}';""".format(employee_id), as_dict=True)
        case_list = []

        # task
        for task in tasks:
            task_case = frappe.db.sql(
                """SELECT  linked_document FROM `tabTask` where name='{}';""".format(task.parent), as_dict=True)
            if task_case[0]:
                case_list.append(task_case[0].linked_document)
        case_list = set(case_list)

        employee_data = frappe.db.sql(
            """SELECT employee_name, type_of_job, technical_position, image, status, prefered_email FROM `tabEmployee` where name='{}';""".format(employee_id), as_dict=True)
        tasks = frappe.db.sql(
            """SELECT parent FROM `tabUserChildTable` where user='{}' order by modified Desc;""".format(employee_id), as_dict=True)
        all_tasks = []
        all_linked_doc = []
        for item in tasks:
            data = frappe.get_doc("Task", item.parent)
            soup = BeautifulSoup(str(data.description), 'html.parser')
            data.description = soup.get_text()
            if len(data.assign_to) > 0:
                for item in data.assign_to:
                    if item.user == employee_id:
                        data.work_status = item.work_status
            all_linked_doc.append(
                {"linked_document": data.linked_document, "linked_document_type": data.linked_document_type_})
            if data.task_supervisor_:
                data.supervisor_name = frappe.get_value(
                    "Employee", data.task_supervisor_, "employee_name")
            else:
                data.supervisor_name = "-"
            all_tasks.append({"task": data, "work_status": data.work_status,
                             "supervisor_name": data.supervisor_name})
            # all_tasks.append(data)
        # team
        total_possible_task = []
        total_possible_task_obj = []
        for item in all_linked_doc:
            possible_task = frappe.db.sql(
                """SELECT name, linked_document, linked_document_type_ FROM `tabTask` where linked_document_type_='{}' and linked_document='{}' order by modified Desc;""".format(item["linked_document_type"], item["linked_document"]), as_dict=True)
            for itemchild in possible_task:
                total_possible_task.append(itemchild.name)
                total_possible_task_obj.append({
                    "task": itemchild.name,
                    "linked_doc": itemchild.linked_document,
                    "linked_doc_type": itemchild.linked_document_type_
                })

        total_possible_task = set(total_possible_task)
        employee_team = []
        employee_team_obj = []
        for item in total_possible_task:
            taskData = frappe.db.sql(
                """SELECT * FROM `tabUserChildTable` where parent='{}';""".format(item), as_dict=True)
            for itemchild in taskData:
                employee_team.append(itemchild.user)

        employee_team = set(employee_team)
        final_employee_team = []

        for item in employee_team:
            emp_list = frappe.db.sql(
                '''Select employee , employee_name,technical_position,type_of_job,image,status from tabEmployee where name='{}';'''.format(item), as_dict=True)

            emp_list_final = []
            for emp in emp_list:
                task = frappe.db.sql(
                    '''Select count(*) as taskNumber from tabUserChildTable where user='{}';'''.format(emp.employee), as_dict=True)[0]
                emp.taskNumber = task.taskNumber
                emp_list_final.append(emp)
            final_employee_team.append(emp_list_final[0])
        cases = []
        resuming_cases = []
        decided_cases = []

        # cases
        for case in case_list:
            if case.startswith("Case"):
                caseData = frappe.db.sql(
                    """SELECT * FROM `tabCase` where name='{}';""".format(case), as_dict=True)
                # soup = BeautifulSoup(caseData[0].description, 'html.parser')
                # caseData[0].description = soup.get_text()
                cases.append(caseData[0])
                if caseData[0].case_status_workflow == "processing" or caseData[0].case_status_workflow == "In Appeal" or caseData[0].case_status_workflow == "Motion for Review":
                    resuming_cases.append(caseData[0])
                if caseData[0].case_status_workflow == "Closed" or caseData[0].case_status_workflow == "Ended":
                    decided_cases.append(caseData[0])

        # today

        worktime = frappe.db.sql(
            """SELECT task FROM `tabWorkTime` where user='{}' and DATE(modified) = DATE(CURDATE()) AND task != '';""".format(employee_id), as_dict=True)
        today_works = []
        for item in worktime:
            today_works.append(item.task)
        today_works = set(today_works)

        today_works_tasks = []
        for item in today_works:
            today_works_tasks.append(frappe.get_doc("Task", item))

        # total hour

        worktime_alltime = frappe.db.sql(
            """SELECT task,spend_session_time FROM `tabWorkTime` where user='{}' AND task != '' and spend_session_time !='';""".format(employee_id), as_dict=True)
        alltime_work_name = []
        total_hours = "00:00:00"
        for item in worktime_alltime:
            alltime_work_name.append(item.task)
            total_hours = time_addition(total_hours, item.spend_session_time)
        alltime_work_name = set(alltime_work_name)

        total_points = 0
        for item in alltime_work_name:
            data = frappe.db.sql(
                """SELECT task_weight FROM `tabTask` where name='{}' and is_approved=1 ;""".format(item), as_dict=True)
            if data:
                total_points += data[0].task_weight
        today = date.today()
        top_emp = top_employee("2023-01-01", str(today))

        rank = 0
        for item in top_emp:
            if item['employee'] == employee_id:
                rank = item['rank']

        employee_data = {
            "employee": employee_data[0],
            "cases": cases,
            "resuming_cases": resuming_cases,
            "decided_cases": decided_cases,
            "tasks": all_tasks,
            "employee_team": final_employee_team,
            "today_work": today_works_tasks,
            "total_work_hour": total_hours,
            "total_points": total_points,
            "rank": rank
        }

        return employee_data
    except Exception as e:
        return e


@frappe.whitelist()
def order_overview():
    try:
        data = frappe.get_all("Order", fields=[
            "name", "customer", "order_typec", "order_status_workflow", "due_date", "order_details"])
        total_orders = len(data)
        pending_order = 0
        active_order = 0
        closed_order = 0
        for item in data:
            soup = BeautifulSoup(item.order_details, 'html.parser')
            item.order_details = crop_string(soup.get_text(), 100)

            if item.order_status_workflow != "Closed" and item.order_status_workflow != "Rejected":
                active_order += 1
            if item.order_status_workflow == "Submitted":
                pending_order += 1
            if item.order_status_workflow == "Closed" or item.order_status_workflow == "Rejected":
                closed_order += 1

        return {
            "total_orders": total_orders,
            "pending_order": pending_order,
            "active_order": active_order,
            "closed_order": closed_order,
            "recent_orders": data
        }
    except Exception as e:
        return e


@frappe.whitelist()
def top_employee(start, end):
    # end_date = datetime.strptime(end, "%Y-%m-%d")
    # end_date += timedelta(days=1)
    # end = end_date.strftime("%Y-%m-%d")
    try:
        today = date.today()
        if str(today) != end:
            end_date = datetime.strptime(end, "%Y-%m-%d")
            end_date += timedelta(days=1)
            end = end_date.strftime("%Y-%m-%d")
        employees = frappe.get_all(
            "Employee", fields=["name", "technical_position", "type_of_job", "employee_name", "prefered_email"])

        records = []
        for item in employees:
            # time
            time_frame_worktime = frappe.get_all("WorkTime", fields=["creation", "user", "spend_session_time"], filters=[
                ["creation", "=>", start] and ["creation", "<=", end], ["user", "=", item.name], ["spend_session_time", "!=", ""]])
            total_hour = "00:00:00"

            for itemchild in time_frame_worktime:
                total_hour = time_addition(
                    total_hour, itemchild.spend_session_time)
            # tasks
            # time_frame_task = frappe.get_all("UserChildTable", fields=["creation", "user"], filters=[
            #     ["creation", "=>", start] and ["creation", "<=", end], ["user", "=", "HR-EMP-00007"]])
            assign_records_for_task = 0
            approve_records_for_task = 0
            approved_point = 0
            time_frame_task = frappe.db.sql(
                """select creation, user, parent from tabUserChildTable where user='{}' and creation BETWEEN '{}' AND '{}';""".format(item.name, start, end), as_dict=True)

            for itemchild in time_frame_task:
                assign_records_for_task = len(time_frame_task)
                task = frappe.get_doc("Task", itemchild.parent)
                if task.is_approved == 1:
                    approve_records_for_task += 1
                    approved_point += task.task_weight
            records.append({
                "employee": item.name,
                "technical_position": item.technical_position,
                "type_of_job": item.type_of_job,
                "employee_name": item.employee_name,
                "total_hour": total_hour,
                "total_tasks": assign_records_for_task,
                "approved_tasks": approve_records_for_task,
                "approved_point": approved_point,
                "rank": 0
            })

        bubble_sort(records)
        i = 0
        for item in records:
            item['rank'] = i+1
            i += 1
        return records
    except Exception as e:
        return e


@frappe.whitelist()
def vacation_request():
    try:
        today = datetime.today()
        # vacation request
        vacation_request = frappe.get_all(
            "Vacation", fields=["name", "employee", "start_date", "end_date", "days", "reason", "status", "description"], filters=[["status", "=", "Waiting"]])
        for item in vacation_request:
            date_obj = datetime.strptime(str(item.start_date), "%Y-%m-%d")
            item.start_date = date_obj.strftime("%d %B")
            date_obj = datetime.strptime(str(item.end_date), "%Y-%m-%d")
            item.end_date = date_obj.strftime("%d %B")

        # already vacations
        on_approve = frappe.get_all(
            "Vacation", fields=["name", "employee", "start_date", "end_date", "days", "reason", "status", "description"], filters=[["status", "=", "Approved"]])
        on_vacation = []
        for item in on_approve:
            date_start_obj = datetime.strptime(
                str(item.start_date), '%Y-%m-%d')
            date_end_obj = datetime.strptime(str(item.end_date), '%Y-%m-%d')

            if date_start_obj <= today and date_end_obj >= today:
                date_obj = datetime.strptime(str(item.start_date), "%Y-%m-%d")
                item.start_date = date_obj.strftime("%d %B")
                date_obj = datetime.strptime(str(item.end_date), "%Y-%m-%d")
                item.end_date = date_obj.strftime("%d %B")
                item.days_left = str(date_end_obj - today)
                on_vacation.append(item)

        # holidays calcution
        holidays_date = json.dumps(
            {str(date): name for date, name in holidays.SaudiArabia(years=today.year).items()}, indent=4)
        holidays_date = json.loads(holidays_date)
        dates = holidays_date.keys()
        upcoming_dates = []
        upcoming_vacations = []

        for item in dates:
            date_obj = datetime.strptime(str(item), '%Y-%m-%d')
            if date_obj >= today:
                upcoming_dates.append(item)

        for item in upcoming_dates:
            upcoming_vacations.append({
                "date": item,
                "vacation_name": holidays_date[item]
            })

        result = {
            "vacation_request_number": len(vacation_request),
            "request_list": vacation_request,
            "upcoming_vacations": upcoming_vacations,
            "on_vaccation": on_vacation
        }

        return result
    except Exception as e:
        return e


@frappe.whitelist()
def vacation_request_change_status(docname, status):
    try:
        doc = frappe.get_doc("Vacation", docname)
        if status != doc.status:
            if status == "Waiting" or status == "Approved" or status == "Rejected":
                doc.status = status
                doc.save()
                return {"status": doc.status, "request": "Success"}
            return {"status": doc.status, "request": "Failed"}
        return {"status": doc.status, "request": "Noting to be change!"}
    except Exception as e:
        return e


@frappe.whitelist()
def annual_calandar(start, end):
    try:
        # employees = frappe.get_all(
        #     "Employee", fields=["name", "technical_position", "type_of_job", "employee_name", "prefered_email"])

        record_vacation = frappe.get_all(
            "Vacation", fields=["name", "employee", "start_date", "end_date", "days", "reason", "status", "description"], filters=[["status", "=", "Approved"]])

        vacation_employee = []
        calandar_employee = []
        annual_calandar_time_frame = (start, end)
        for item in record_vacation:
            vacation_time_frame = (item.start_date, item.end_date)
            overlap = check_time_frame_overlap(
                annual_calandar_time_frame, vacation_time_frame)
            if overlap:
                vacation_employee.append(item)

        for item in vacation_employee:
            start1 = datetime.strptime(str(start), "%Y-%m-%d").date()
            end1 = datetime.strptime(str(end), "%Y-%m-%d").date()
            start2 = datetime.strptime(str(item.start_date), "%Y-%m-%d").date()
            end2 = datetime.strptime(str(item.end_date), "%Y-%m-%d").date()

            if start1 >= start2:
                start_point = start1
            else:
                start_point = start2

            if end1 >= end2:
                end_point = end2
            else:
                end_point = end1

            row = {
                "employee": item.employee,
                "start_point": start_point,
                "end_point": end_point,
                "vacation_days": abs(end_point - start_point).days,
                "reason": item.reason,
                "employee_name": frappe.db.get_value("Employee", item.employee, 'employee_name')
            }
            calandar_employee.append(row)

        return calandar_employee
    except Exception as e:
        return e


@frappe.whitelist()
def order_details(docname):
    try:
        order = frappe.get_doc("Order", docname)
        soup = BeautifulSoup(order.order_details, 'html.parser')
        order.order_details_text = crop_string(soup.get_text(), 100)

        employees = []
        for item in order.agents:
            employee = frappe.get_doc("Employee", item.employee)
            employees.append(employee)

        return {"details": order, "lawyers": employees}
    except Exception as e:
        return e


@frappe.whitelist()
def consultation_overview():
    try:
        data = frappe.get_all("Consultations", fields=["*"])
        active_consultation = 0
        onProcess_consultation = 0
        finished_consultation = 0
        draft_consultaion = 0
        total_consultation = len(data)
        for item in data:
            soup = BeautifulSoup(item.consultation_description, 'html.parser')
            item.consultation_description = crop_string(soup.get_text(), 100)

            if item.consultation_status_workflow == "Processing":
                onProcess_consultation += 1
            if item.consultation_status_workflow != "Closed":
                active_consultation += 1
            if item.consultation_status_workflow == "Draft":
                draft_consultaion += 1
            if item.consultation_status_workflow == "Closed" or item.consultation_status_workflow == "Completed":
                finished_consultation += 1

        return {
            "total_consultation": total_consultation,
            "active_consultation": active_consultation,
            "onProcess_consultation": onProcess_consultation,
            "finished_consultation": finished_consultation,
            "draft_consultaion": draft_consultaion,
            "recent_consultaions": data
        }
    except Exception as e:
        return e


@frappe.whitelist()
def employee_technical_rate():
    try:
        return frappe.get_doc("GEHR")
    except Exception as e:
        return e


@frappe.whitelist()
def contract_overview():
    try:
        data = frappe.get_all("Contract", fields=["*"])
        total_contract = len(data)
        active_contract = 0
        inactive_contract = 0
        unsigned_contract = 0
        for item in data:
            if item.status == "Active":
                active_contract += 1
            if item.status == "Inactive":
                inactive_contract += 1
            if item.status == "Unsigned":
                unsigned_contract += 1

        return {
            "total_contract": total_contract,
            "active_contract": active_contract,
            "inactive_contract": inactive_contract,
            "unsigned_contract": unsigned_contract,
            "recent_contract": data
        }
    except Exception as e:
        return e


@frappe.whitelist()
def master_data():
    try:
        court = frappe.get_all("Court", fields=["*"])
        judge = frappe.get_all("Judge", fields=["*"])
        section = frappe.get_all("Section", fields=["*"])
        case_category = frappe.get_all("Case Category", fields=["*"])
        consutation_category = frappe.get_all(
            "Consultation Category", fields=["*"])
        return {
            "court": court,
            "judge": judge,
            "section": section,
            "case_category": case_category,
            "consutation_category": consutation_category
        }
    except Exception as e:
        return e


@frappe.whitelist()
def evidence_overview():
    try:
        data = frappe.get_all("Evidence", fields=["*"])
        return {
            "recent_evidence_records": data
        }
    except Exception as e:
        return e


@frappe.whitelist()
def quotation_overview():
    try:
        data = frappe.get_all("Quotation", fields=["*"])
        total_quotation = len(data)
        open_quotation = 0
        lost_quotation = 0
        expired_quotation = 0
        draft_quotation = 0
        for item in data:
            if item.status == "Open":
                open_quotation += 1
            if item.status == "Lost":
                lost_quotation += 1
            if item.status == "Expired":
                expired_quotation += 1
            if item.status == "Draft":
                draft_quotation += 1

        return {
            "total_quotation": total_quotation,
            "open_quotation": open_quotation,
            "lost_quotation": lost_quotation,
            "expired_quotation": expired_quotation,
            "draft_quotation": draft_quotation,
            "recent_quotation": data
        }
    except Exception as e:
        return e


# Workflow Update & get Possible action list

@frappe.whitelist()
def get_possible_workflow_actions(doctype, name):
    try:
        make_list = []
        doc = {
            "doctype": doctype,
            "name": name
        }
        data = get_transitions(doc)
        state = ""
        for item in data:
            make_list.append(item.action)
            state = item.state

        result = {
            "possible_state": make_list,
            "present_state": state,
            "details": data,
        }
        return result
    except Exception as e:
        return e


@frappe.whitelist()
def make_workflow_change(doctype, docname, action):
    try:
        data = frappe.get_doc(doctype, docname)
        try:
            return apply_workflow(data, action)
        except:
            return "Not Successful!"
    except Exception as e:
        return e


@frappe.whitelist()
def task_custom_list(employee_id):
    try:
        filters = {"user": employee_id}
        data = frappe.get_all("UserChildTable", fields=["*"], filters=filters)
        final_task = []
        for item in data:
            if item.work_status != "Done":
                is_approve = frappe.get_value(
                    "Task", item.parent, "is_approved")
                if is_approve == 0:
                    temp = {
                        "value": item.parent,
                        "description": item.parent
                    }
                    final_task.append(temp)
        return final_task
    except Exception as e:
        return e


@frappe.whitelist()
def head_lawyer_dashboard_report(employee_id, report_start_date, report_end_date):
    try:
        employee = frappe.get_doc("Employee", employee_id)
        if employee.type_of_job != "Team Head Lawyer":
            return "It's not valid employee!"
        temp_report_end_date = datetime.strptime(report_end_date, "%Y-%m-%d")
        temp_report_end_date += timedelta(days=1)
        report_end_date = temp_report_end_date.strftime("%Y-%m-%d")
        # report_end_date not coming with equal date even using = sign. some added a extra day.
        filters = [
            ["creation", ">=", report_start_date],
            ["creation", "<=", report_end_date],
            ["task", "!=", ""]
        ]
        users = []
        time_frame_work = frappe.get_all(
            "WorkTime", fields=["creation", "task", "user"], filters=filters)
        for item in time_frame_work:
            task_data = frappe.get_doc("Task", item.task)
            users.append(str([item.user, task_data.linked_document]))
        users = list(set(users))
        users = [ast.literal_eval(item) for item in users]
        raw = []
        for item in users:
            data = frappe.get_all("Task", fields=[
                "name", "task_weight"], filters=[["linked_document", "=", item[1]]])
            total_weight = 0
            gain_weight = 0
            complete_task = 0
            for i in data:
                total_weight += i.task_weight
                t_data = []
                t_data = frappe.get_all("UserChildTable", fields=[
                    "*"], filters=[["parent", "=", i.name], ["user", "=", item[0]]])
                if len(t_data) > 0:
                    if len(t_data) > 1:
                        return t_data
                    if t_data[0].work_status == "Done":
                        gain_weight += i.task_weight
                        complete_task += 1

            temp = [item[0], item[1], complete_task,
                    len(data), gain_weight, total_weight]
            raw.append(temp)
        final_data = []
        for i in raw:
            employee_name = frappe.get_value("Employee", i[0], "employee_name")
            final_data.append({
                "employee_name": employee_name,
                "work_on": i[1],
                "complete_task": i[2],
                "total_task": i[3],
                "gain_point": i[4],
                "total_point": i[5]
            })
        return {"report": final_data}
    except Exception as e:
        return e


@frappe.whitelist()
def head_lawyer_dashboard_chart(start_date, end_date):
    try:
        date_format = '%Y-%m-%d'  # Format of the input date strings
        start_date_t = datetime.strptime(start_date, date_format)
        end_date_t = datetime.strptime(end_date, date_format)

        date_array = []
        current_date = start_date_t

        while current_date <= end_date_t:
            date_info = {
                'date': current_date.strftime(date_format),
                'month': current_date.strftime('%B'),      # Full month name
                # Day with leading zero
                'day': current_date.strftime('%d'),
                'weekname': current_date.strftime('%A'),   # Full weekday name
            }
            date_array.append(date_info)
            current_date += timedelta(days=1)

        temp_end_date = datetime.strptime(end_date, date_format)
        temp_end_date += timedelta(days=1)
        end_date = temp_end_date.strftime(date_format)
        # report_end_date not coming with equal date even using = sign. some added a extra day.
        filters = [
            ["creation", ">=", start_date],
            ["creation", "<=", end_date],
        ]

        case_data = frappe.get_all(
            "Case", fields=["creation"], filters=filters, pluck="creation")
        yAxis = []
        for item in date_array:
            item['case_count'] = 0
            for case_date in case_data:
                if item['date'] == str(case_date).split(" ")[0]:
                    item['case_count'] += 1
            yAxis.append(item['case_count'])

        return {
            "xAxis": date_array,
            "yAxis": yAxis
        }
    except Exception as e:
        return e


@frappe.whitelist()
def head_lawyer_dashboard_case_decided(page, limit):
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []
        case_decided = frappe.get_all("Case", fields=["case_title", "case_no", "legal_case_result", "case_category", "case_status_workflow"], filters=[
            ["legal_case_result", "!=", ""]], order_by="creation desc")

        if len(case_decided) > skip+limit:
            nextpage = True
        for doc in case_decided[skip:skip+limit]:
            doc_list.append(doc)
        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(case_decided)}
    except Exception as e:
        return e


@frappe.whitelist()
def head_lawyer_dashboard_session(date=None):
    try:
        up_coming_session = frappe.get_all(
            "Court Session", fields=["session_date", "name", "session_time", "subject", "case_session"], filters=[["session_date", ">=", str(datetime.now()).split(" ")[0]]])
        if date != None:
            up_coming_session = [
                item for item in up_coming_session if str(item.session_date) == date]
        up_coming_session = sorted(up_coming_session, key=lambda x: (
            x["session_date"], x["session_time"]))
        sessions_by_time = organize_sessions_by_time(up_coming_session)

        event_list = []
        for time, sessions in sessions_by_time.items():
            event_list.append({
                "time": time,
                "sessions": sessions
            })
        return event_list
    except Exception as e:
        return e


def organize_sessions_by_time(session_list):
    sessions_by_time = {}

    for session in session_list:
        session_time = session["session_time"]
        hour_minutes = str(session_time).split(":")[0:2]
        hour_minutes_str = ":".join(hour_minutes)

        if hour_minutes_str not in sessions_by_time:
            sessions_by_time[hour_minutes_str] = []

        sessions_by_time[hour_minutes_str].append(session)

    return sessions_by_time


@frappe.whitelist()
def create_employee_user(first_name, type_of_job, technical_position, gender, date_of_birth, date_of_joining, prefered_contact_email, personal_email, company_email):
    try:
        employee = frappe.new_doc("Employee")
        employee.first_name = first_name
        employee.type_of_job = type_of_job
        employee.technical_position = technical_position
        employee.date_of_birth = date_of_birth
        employee.date_of_joining = date_of_joining
        employee.prefered_contact_email = prefered_contact_email
        if prefered_contact_email == "Personal Email":
            employee.personal_email = personal_email
            employee.prefered_email = personal_email
        else:
            employee.company_email = company_email
            employee.prefered_email = company_email
        employee.gender = gender

        data = frappe.get_all(
            "Employee", fields="prefered_email", pluck='prefered_email')
        if employee.prefered_email in data:
            return "Already email exists!"
        employee.insert()

        roles = []
        if employee.type_of_job == "Lawyer":
            roles.append({"role": "Lawyer"})
            roles.append({"role": "Legal Secretary"})
        elif employee.type_of_job == "Team Head Lawyer":
            roles.append({"role": "Lawyer"})
            roles.append({"role": "Head Lawyer"})
            roles.append({"role": "Legal Secretary"})
        elif employee.type_of_job == "Legal Secretary":
            roles.append({"role": "Legal Secretary"})
        elif employee.type_of_job == "Admin" or employee.type_of_job == "Manager":
            roles_data = frappe.get_all("Role")
            for item in roles_data:
                roles.append({"role": item.name})

        user = frappe.get_doc({
            "doctype": "User",
            "email": employee.prefered_email,
            "first_name": employee.first_name,
            "new_password": "admin1122",
            "roles": roles
        })
        user.insert()
        return {"employee": employee, "user": user}
    except Exception as e:
        return e


@frappe.whitelist()
def create_user(prefered_email, first_name, type_of_job):
    try:
        roles = []
        if type_of_job == "Lawyer":
            roles.append({"role": "Lawyer"})
            roles.append({"role": "Legal Secretary"})
        elif type_of_job == "Team Head Lawyer":
            roles.append({"role": "Lawyer"})
            roles.append({"role": "Head Lawyer"})
            roles.append({"role": "Legal Secretary"})
        elif type_of_job == "Legal Secretary":
            roles.append({"role": "Legal Secretary"})
        elif type_of_job == "Admin" or employee.type_of_job == "Manager":
            roles_data = frappe.get_all("Role")
            for item in roles_data:
                roles.append({"role": item.name})

        user = frappe.get_doc({
            "doctype": "User",
            "email": prefered_email,
            "first_name": first_name,
            "new_password": "admin1122",
            "roles": roles
        })
        user.insert()

        return {
            'user': user
        }
    except Exception as e:
        return e


@frappe.whitelist()
def change_employee_type_of_job(employee_id, type_of_job):
    try:
        employee = frappe.get_doc("Employee", employee_id)
        employee.type_of_job = type_of_job
        employee.save()

        roles = []
        if employee.type_of_job == "Lawyer":
            roles.append({"role": "Lawyer"})
            roles.append({"role": "Legal Secretary"})
        elif employee.type_of_job == "Team Head Lawyer":
            roles.append({"role": "Lawyer"})
            roles.append({"role": "Head Lawyer"})
            roles.append({"role": "Legal Secretary"})
        elif employee.type_of_job == "Legal Secretary":
            roles.append({"role": "Legal Secretary"})
        elif employee.type_of_job == "Admin" or employee.type_of_job == "Manager":
            roles_data = frappe.get_all("Role")
            for item in roles_data:
                roles.append({"role": item.name})
        user = frappe.get_doc("User", employee.prefered_email)
        user.roles = roles
        user.update({"roles": roles})
        user.save()

        return {
            "employee": employee,
            "user": user,
        }
    except Exception as e:
        return e


@frappe.whitelist()
def change_task_status(employee_id, task_name, status):
    try:
        filters = {"user": employee_id}
        data = frappe.get_all("UserChildTable", fields=["*"], filters=filters)
        final_task = []
        task_names = []
        for item in data:
            final_task.append(item.parent)
            task_names.append(item.name)
        if task_name not in final_task:
            frappe.throw("Task is not available for this user.")
        else:
            for index, task in enumerate(final_task):
                if task == task_name:
                    task_data = frappe.get_doc(
                        "UserChildTable", task_names[index])

                    task_data.work_status = status
                    task_data.save()

                    status_list = []
                    main_task = frappe.get_doc("Task", task_name)
                    for assign_task in main_task.assign_to:
                        status_list.append(assign_task.work_status)
                    status_list = list(set(status_list))
                    if len(status_list) == 1 and status_list[0] == "Pending":
                        main_task.task_status = "Hold"
                        main_task.save()
                    if len(status_list) == 1 and status_list[0] == "Done":
                        main_task.task_status = "Completed"
                        main_task.save()
                    if len(status_list) == 1 and status_list[0] == "Processing":
                        main_task.task_status = "Processing"
                        main_task.save()
                    if len(status_list) > 1:
                        main_task.task_status = "Processing"
                        main_task.save()
        return task_data
    except Exception as e:
        return e


@frappe.whitelist()
def doc_request_admin():
    # order submitted list for approve Reject sign
    orders = frappe.get_all(
        "Order", fields=["name", "order_typec", "due_date", "customer", "order_status_workflow"], filters=[["order_status_workflow", "=", "Submitted"]])
    cases = frappe.get_all(
        "Case", fields=["name", "case_title", "case_category", "client_status", "judge", "court", "section", "customer", "case_status_workflow"], filters=[["case_status_workflow", "=", "Submitted"]])
    contract = frappe.get_all(
        "Contract", fields=["name", "party_name", "calculation_type", "contract_type", "quotation", "is_signed"], filters=[["status", "=", "Unsigned"], ["docstatus", "=", "1"]])
    consultations = frappe.get_all(
        "Consultations", fields=["name", "customer", "consultation_type", "consultation_category", "contract", "quotation", "due_date", "consultation_status_workflow"], filters=[["consultation_status_workflow", "=", "Submitted"]])
    tasks = frappe.get_all(
        "Task", fields=["name", "subject", "priority", "linked_document_type_", "linked_document", "task_status", "is_approved", "task_supervisor_"], filters=[["is_approved", "=", "0"], ["task_status", "=", "Completed"]])

    return {
        "orders": {
            "data": orders,
            "type": "approve"
        },
        "cases": {
            "data": cases,
            "type": "approve"
        },
        "contract": {
            "data": contract,
            "type": "sign"
        },
        "consultations": {
            "data": consultations,
            "type": "approve"
        },
        "tasks": {
            "data": tasks,
            "type": "approve"
        },
    }


@frappe.whitelist()
def doc_request_employee(employee_id):
    # ORDER FOR EMPLOYEE
    orders = frappe.get_all(
        "Order", fields=["name", "order_typec", "customer", "order_status_workflow"], filters=[["order_status_workflow", "=", "Submitted"]])
    order_agents = frappe.get_all("EmpOrders", fields=["parent"], pluck='parent', filters=[
        ["employee", "=", employee_id]])
    orders = [item for item in orders if item.name in order_agents]

    # CASE FOR EMPLOYEE
    cases = frappe.get_all(
        "Case", fields=["name", "case_title", "case_category", "client_status", "judge", "court", "section", "customer", "case_status_workflow"], filters=[["case_status_workflow", "=", "Submitted"]])
    case_agents = frappe.get_all("Case Agents", fields=["parent"], pluck='parent', filters=[
        ["employee", "=", employee_id]])
    cases = [item for item in cases if item.name in case_agents]

    # CONSULTATION FOR EMPLOYEE
    consultations = frappe.get_all(
        "Consultations", fields=["name", "customer", "consultation_type", "consultation_category", "contract", "quotation", "due_date", "consultation_status_workflow"], filters=[["consultation_status_workflow", "=", "Submitted"]])
    consultation_agents = frappe.get_all("Contract-Agents", fields=["parent"], pluck='parent', filters=[
        ["agent", "=", employee_id]])
    consultations = [
        item for item in consultations if item.name in consultation_agents]

    contract = frappe.get_all(
        "Contract", fields=["name", "party_name", "calculation_type", "contract_type", "quotation", "is_signed"], filters=[["status", "=", "Unsigned"], ["docstatus", "=", "1"]])

    tasks = frappe.get_all(
        "Task", fields=["name", "subject", "priority", "linked_document_type_", "linked_document", "task_status", "is_approved", "task_supervisor_"], filters=[["is_approved", "=", "0"], ["task_status", "=", "Completed"], ["task_supervisor_", "=", employee_id]])

    return {
        "orders": {
            "data": orders,
            "type": "approve"
        },
        "cases": {
            "data": cases,
            "type": "approve"
        },
        "contract": {
            "data": contract,
            "type": "sign"
        },
        "consultations": {
            "data": consultations,
            "type": "approve"
        },
        "tasks": {
            "data": tasks,
            "type": "approve"
        },
    }


@frappe.whitelist()
def activity_log(page, limit):
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []
        activity = frappe.get_all("Notification Log", fields=[
                                  "subject", "creation"])
        for item in activity:
            item.creation = pretty_date(item.creation)
        if len(activity) > skip+limit:
            nextpage = True
        for doc in activity[skip:skip+limit]:
            doc_list.append(doc)

        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(activity)}
    except Exception as e:
        return e


@frappe.whitelist()
def get_admin_workhistory(page, limit, filters=None):
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []
        if filters:
            docs = frappe.get_all("WorkTime", fields=["*"], filters=filters)
        else:
            docs = frappe.get_all("WorkTime", fields=["*"])
        if len(docs) > skip+limit:
            nextpage = True
        for doc in docs[skip:skip+limit]:
            doc.modified = pretty_date(doc.modified)
            doc.user_name = frappe.get_value(
                "Employee", doc.user, "employee_name")
            doc.linked_doc = frappe.get_value(
                "Task", doc.task, "linked_document")
            doc_list.append(doc)
        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(docs)}
    except Exception as e:
        return e


@frappe.whitelist()
def get_lawyer_workhistory(employee, page, limit, filters=None):
    try:
        page = int(page)
        limit = int(limit)
        skip = ((page) - 1) * (limit)
        nextpage = False
        doc_list = []
        if filters:
            docs = frappe.get_all("WorkTime", fields=["*"], filters=filters)
        else:
            docs = frappe.get_all("WorkTime", fields=["*"])
        docs = [item for item in docs if item.user == employee]
        if len(docs) > skip+limit:
            nextpage = True
        for doc in docs[skip:skip+limit]:
            doc.modified = pretty_date(doc.modified)
            doc.user_name = frappe.get_value(
                "Employee", doc.user, "employee_name")
            doc.linked_doc = frappe.get_value(
                "Task", doc.task, "linked_document")
            doc_list.append(doc)
        return {"data": doc_list, "nextpage": nextpage, "total_docs": len(docs)}
    except Exception as e:
        return e
# LIBRARY


def crop_string(string, max_length):
    cropped_string = string[:max_length]
    return cropped_string


def check_time_frame_overlap(time_frame1, time_frame2):
    start1, end1 = time_frame1
    start2, end2 = time_frame2

    start1 = datetime.strptime(str(start1), "%Y-%m-%d").date()
    end1 = datetime.strptime(str(end1), "%Y-%m-%d").date()
    start2 = datetime.strptime(str(start2), "%Y-%m-%d").date()
    end2 = datetime.strptime(str(end2), "%Y-%m-%d").date()

    if start1 <= end2 and end1 >= start2:  # Check for overlap
        overlap_start = max(start1, start2)
        overlap_end = min(end1, end2)

        if overlap_start <= overlap_end:  # Check for same dates
            return True

    return False


def convert_hours_to_number(time_str):
    # Split the time string and extract the hours part
    hours = time_str.split(":")[0]
    # Convert the hours string to an integer and return
    return int(hours)


def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            # Comparison function for sorting
            def compare_items(item1, item2):
                if item1["approved_point"] != item2["approved_point"]:
                    return item1["approved_point"] - item2["approved_point"]
                elif item1["approved_tasks"] != item2["approved_tasks"]:
                    return item1["approved_tasks"] - item2["approved_tasks"]
                else:
                    total_hours_1 = convert_hours_to_number(
                        item1["total_hour"])
                    total_hours_2 = convert_hours_to_number(
                        item2["total_hour"])
                    return total_hours_1 - total_hours_2

            if compare_items(arr[j], arr[j + 1]) < 0:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]


def get_total_work_hour_record(orderType, orderName):

    # get all task where orderType & orderName linked
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
    orderWorkDetails = {
        "taskDetails": all_workTime_for_all_task,
        "numberOftask": len(all_workTime_for_all_task),
        "total_order_Work": total_order_work,
        "overall_technical_position_time": position_time
    }
    return orderWorkDetails


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
        timeData.user_name = employee.employee_name
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


# Time management & Time Button functionalities

@frappe.whitelist()
def time_record():
    return frappe.db.sql("""select start_session_time from tabWorkTime""")


@frappe.whitelist()
def addWorkTimeWithoutDialog(user, docName, dialog_data, timeZone):
    doc = frappe.new_doc("WorkTime")
    local_tz = pytz.timezone(timeZone)
    current_local_time = datetime.now(local_tz)
    employee = frappe.db.sql(
        """select * from tabEmployee where prefered_email="{}";""".format(user), as_dict=True)
    doc.user = employee[0].name
    doc.start_session_time = current_local_time.strftime(
        "%Y-%m-%d %H:%M:%S %z")
    doc.end_session_time = ""
    doc.pause_session_time = ""
    doc.resume_session_time = ""
    doc.spend_session_time = ""

    doc.insert()
    return doc


@frappe.whitelist()
def addWorkTime(user, docName, dialog_data, timeZone):
    doc = frappe.new_doc("WorkTime")
    dialog_data = eval(dialog_data)
    # addition for new part
    employee = frappe.db.sql(
        """select * from tabEmployee where prefered_email="{}";""".format(user), as_dict=True)
    doc.user = employee[0].name
    local_tz = pytz.timezone(timeZone)
    current_local_time = datetime.now(local_tz)
    doc.start_session_time = current_local_time.strftime(
        "%Y-%m-%d %H:%M:%S %z")
    if dialog_data:
        if ("case_task" in dialog_data):
            doc.task = dialog_data['case_task']
        if ("description" in dialog_data):
            doc.description = dialog_data['description']

    doc.end_session_time = ""
    doc.pause_session_time = ""
    doc.resume_session_time = ""
    doc.spend_session_time = ""

    doc.insert()
    return doc


@frappe.whitelist()
def endWorkTime(user, docName, dialog_data, timeZone):
    employee = frappe.db.sql(
        """select * from tabEmployee where prefered_email="{}";""".format(user), as_dict=True)
    editDoc = frappe.get_doc("WorkTime", docName)
    if (editDoc.user == employee[0].name):
        local_tz = pytz.timezone(timeZone)
        current_local_time = datetime.now(local_tz)
        startTime = ""
        endTime = ""
        if editDoc.pause_session_time != "":
            editDoc.end_session_time = editDoc.pause_session_time
        else:
            editDoc.end_session_time = current_local_time.strftime(
                "%Y-%m-%d %H:%M:%S %z")

        if editDoc.resume_session_time == "":
            startTime = editDoc.start_session_time.split(" ")[0:2]
            endTime = editDoc.end_session_time.split(" ")[0:2]
            startTime = " ".join([startTime[0], startTime[1]])
            endTime = " ".join([endTime[0], endTime[1]])
            startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
            endTime = datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S')
            diff_in_seconds = (endTime - startTime).total_seconds()

            editDoc.spend_session_time = timedelta(seconds=diff_in_seconds)
            if len(str(editDoc.spend_session_time)) > 8:
                days, timeData = str(editDoc.spend_session_time).split(", ")
                days = int(days.split()[0])
                days_hour = days * 24
                splitData = timeData.split(":")
                saveTime = int(timeData.split(":")[0])
                saveTime = days_hour+saveTime
                finalTime = str(saveTime)+":"+splitData[1]+":"+splitData[2]
                editDoc.spend_session_time = finalTime
                editDoc.save()
                return editDoc
            editDoc.save()
            return editDoc
        elif editDoc.pause_session_time != "":
            editDoc.save()
            return editDoc

        else:
            startTime = editDoc.resume_session_time.split(" ")[0:2]
            endTime = editDoc.end_session_time.split(" ")[0:2]
            startTime = " ".join([startTime[0], startTime[1]])
            endTime = " ".join([endTime[0], endTime[1]])
            startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
            endTime = datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S')
            diff_in_seconds = (endTime - startTime).total_seconds()

            spendTimeSecond = 0
            if editDoc.spend_session_time != "":
                hours, minutes, seconds = map(
                    int, editDoc.spend_session_time.split(':'))
                spendTimeSecond = timedelta(
                    hours=hours, minutes=minutes, seconds=seconds).total_seconds()

            editDoc.spend_session_time = timedelta(
                seconds=(diff_in_seconds+spendTimeSecond))
            if len(str(editDoc.spend_session_time)) > 8:
                days, timeData = str(editDoc.spend_session_time).split(", ")
                days = int(days.split()[0])
                days_hour = days * 24
                splitData = timeData.split(":")
                saveTime = int(timeData.split(":")[0])
                saveTime = days_hour+saveTime
                finalTime = str(saveTime)+":"+splitData[1]+":"+splitData[2]
                editDoc.spend_session_time = finalTime
                editDoc.save()
                return editDoc
            editDoc.save()
            return editDoc

    return "No Data"


@frappe.whitelist()
def pauseWorkTime(user, docName, dialog_data, timeZone):
    employee = frappe.db.sql(
        """select * from tabEmployee where prefered_email="{}";""".format(user), as_dict=True)
    editDoc = frappe.get_doc("WorkTime", docName)
    if (editDoc.user == employee[0].name):
        local_tz = pytz.timezone(timeZone)
        current_local_time = datetime.now(local_tz)
        editDoc.pause_session_time = current_local_time.strftime(
            "%Y-%m-%d %H:%M:%S %z")
        startTime = ""
        if editDoc.resume_session_time == "":
            startTime = editDoc.start_session_time.split(" ")[0:2]
        else:
            startTime = editDoc.resume_session_time.split(" ")[0:2]

        startTime = " ".join([startTime[0], startTime[1]])
        startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')

        pauseTime = editDoc.pause_session_time.split(" ")[0:2]
        pauseTime = " ".join([pauseTime[0], pauseTime[1]])
        pauseTime = datetime.strptime(pauseTime, '%Y-%m-%d %H:%M:%S')

        diff_in_seconds = (pauseTime - startTime).total_seconds()

        spendTimeSecond = 0
        if editDoc.spend_session_time != "":
            hours, minutes, seconds = map(
                int, editDoc.spend_session_time.split(':'))
            spendTimeSecond = timedelta(
                hours=hours, minutes=minutes, seconds=seconds).total_seconds()

        editDoc.spend_session_time = timedelta(
            seconds=(diff_in_seconds+spendTimeSecond))
        if len(str(editDoc.spend_session_time)) > 8:
            days, timeData = str(editDoc.spend_session_time).split(", ")
            days = int(days.split()[0])
            days_hour = days * 24
            splitData = timeData.split(":")
            saveTime = int(timeData.split(":")[0])
            saveTime = days_hour+saveTime
            finalTime = str(saveTime)+":"+splitData[1]+":"+splitData[2]
            editDoc.spend_session_time = finalTime
            editDoc.save()
            return editDoc

        editDoc.save()
        return editDoc
    return "No Data"


@frappe.whitelist()
def resumeWorkTime(user, docName, dialog_data, timeZone):
    employee = frappe.db.sql(
        """select * from tabEmployee where prefered_email="{}";""".format(user), as_dict=True)
    editDoc = frappe.get_doc("WorkTime", docName)
    if (editDoc.user == employee[0].name):
        local_tz = pytz.timezone(timeZone)
        current_local_time = datetime.now(local_tz)
        editDoc.pause_session_time = ""
        editDoc.resume_session_time = current_local_time.strftime(
            "%Y-%m-%d %H:%M:%S %z")
        editDoc.save()
        return editDoc
    return "No Data"


@frappe.whitelist()
def CheckLastWorkTimeStillContinue(user):
    employee = frappe.db.sql(
        """select * from tabEmployee where prefered_email="{}";""".format(user), as_dict=True)
    if not employee:
        return
    data = frappe.db.sql(
        """select * from `tabWorkTime` where user='{}' and end_session_time="" ;""".format(employee[0].name), as_dict=True)
    return data


@frappe.whitelist()
def getThePendingWorkTimeDoc(user):
    data = CheckLastWorkTimeStillContinue(user)
    return data[0]


# Time Counter FOR VUE ONLY

@frappe.whitelist()
def vue_CheckLastWorkTimeStillContinue(user, timeZone):
    local_tz = pytz.timezone(timeZone)
    employee = frappe.db.sql(
        """select * from tabEmployee where prefered_email="{}";""".format(user), as_dict=True)
    if not employee:
        return
    data = frappe.db.sql(
        """select * from `tabWorkTime` where user='{}' and end_session_time="" ;""".format(employee[0].name), as_dict=True)

    if len(data) > 0:
        on_state = data[0].pause_session_time
        if on_state != "":
            status = "Pause"
            spend = data[0].spend_session_time
        else:
            status = "Active"
            if data[0].resume_session_time != "":
                time = data[0].resume_session_time.split(" ")[0:2]
                time = " ".join([time[0], time[1]])
                time = datetime.strptime(time, '%Y-%m-%d %H:%M:%S')

                current_time = datetime.now(
                    local_tz).strftime("%Y-%m-%d %H:%M:%S")
                current_time = datetime.strptime(
                    str(current_time), '%Y-%m-%d %H:%M:%S')

                diff_in_seconds = (current_time - time).total_seconds()

                hours, minutes, seconds = map(
                    int, data[0].spend_session_time.split(':'))
                spendTimeSecond = timedelta(
                    hours=hours, minutes=minutes, seconds=seconds).total_seconds()
                spend = timedelta(seconds=(diff_in_seconds+spendTimeSecond))
                if len(str(spend)) > 8:
                    days, timeData = str(spend).split(", ")
                    days = int(days.split()[0])
                    days_hour = days * 24
                    splitData = timeData.split(":")
                    saveTime = int(timeData.split(":")[0])
                    saveTime = days_hour+saveTime
                    finalTime = str(saveTime)+":"+splitData[1]+":"+splitData[2]
                    spend = finalTime
            else:
                time = data[0].start_session_time.split(" ")[0:2]
                time = " ".join([time[0], time[1]])
                time = datetime.strptime(time, '%Y-%m-%d %H:%M:%S')

                current_time = datetime.now(
                    local_tz).strftime("%Y-%m-%d %H:%M:%S")
                current_time = datetime.strptime(
                    str(current_time), '%Y-%m-%d %H:%M:%S')

                diff_in_seconds = (current_time - time).total_seconds()

                spend = timedelta(seconds=(diff_in_seconds))
                if len(str(spend)) > 8:
                    days, timeData = str(spend).split(", ")
                    days = int(days.split()[0])
                    days_hour = days * 24
                    splitData = timeData.split(":")
                    saveTime = int(timeData.split(":")[0])
                    saveTime = days_hour+saveTime
                    finalTime = str(saveTime)+":"+splitData[1]+":"+splitData[2]
                    spend = finalTime
        return {
            "on_work": True,
            "worktime": data[0],
            "status": status,
            "spend_time": spend
        }
    else:
        return {
            "on_work": False
        }


@frappe.whitelist()
def vue_create_worktime_manual(user, start, end, task, description, timeZone):
    res = vue_CheckLastWorkTimeStillContinue(user, timeZone)
    if res['on_work'] == False:
        doc = frappe.new_doc("WorkTime")
        employee = frappe.db.sql(
            """select name from tabEmployee where prefered_email="{}";""".format(user), as_dict=True)
        doc.user = employee[0].name
        doc.task = task
        doc.description = description
        doc.pause_session_time = ""
        doc.resume_session_time = ""
        local_tz = pytz.timezone(timeZone)
        start_datetime = datetime.strptime(start, "%Y-%m-%dT%H:%M")
        end_datetime = datetime.strptime(end, "%Y-%m-%dT%H:%M")
        localized_start_datetime = pytz.timezone(
            timeZone).localize(start_datetime)
        localized_end_datetime = pytz.timezone(timeZone).localize(end_datetime)
        doc.start_session_time = localized_start_datetime.strftime(
            "%Y-%m-%d %H:%M:%S %z")
        doc.end_session_time = localized_end_datetime.strftime(
            "%Y-%m-%d %H:%M:%S %z")

        startTime = doc.start_session_time.split(" ")[0:2]
        endTime = doc.end_session_time.split(" ")[0:2]
        startTime = " ".join([startTime[0], startTime[1]])
        endTime = " ".join([endTime[0], endTime[1]])
        startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
        endTime = datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S')
        diff_in_seconds = (endTime - startTime).total_seconds()
        doc.spend_session_time = timedelta(seconds=diff_in_seconds)

        if len(str(doc.spend_session_time)) > 8:
            days, timeData = str(
                doc.spend_session_time).split(", ")
            days = int(days.split()[0])
            days_hour = days * 24
            splitData = timeData.split(":")
            saveTime = int(timeData.split(":")[0])
            saveTime = days_hour+saveTime
            finalTime = str(saveTime)+":"+splitData[1]+":"+splitData[2]
            doc.spend_session_time = finalTime
            doc.insert()
            return doc

        doc.insert()
        return doc

    else:
        return res


@frappe.whitelist()
def vue_addWorkTime(user, dialog_data, timeZone):
    res = vue_CheckLastWorkTimeStillContinue(user, timeZone)
    if res['on_work'] == False:
        doc = frappe.new_doc("WorkTime")
        # dialog_data = eval(dialog_data)
        # addition for new part
        employee = frappe.db.sql(
            """select * from tabEmployee where prefered_email="{}";""".format(user), as_dict=True)
        doc.user = employee[0].name
        local_tz = pytz.timezone(timeZone)
        current_local_time = datetime.now(local_tz)
        doc.start_session_time = current_local_time.strftime(
            "%Y-%m-%d %H:%M:%S %z")
        if dialog_data:
            if ("case_task" in dialog_data):
                doc.task = dialog_data['case_task']
            if ("description" in dialog_data):
                doc.description = dialog_data['description']

        doc.end_session_time = ""
        doc.pause_session_time = ""
        doc.resume_session_time = ""
        doc.spend_session_time = ""
        doc.insert()
        return {
            "worktime": doc
        }
    else:
        return res


@frappe.whitelist()
def vue_editCurrentWorkTimeData(user, dialog_data, timeZone):
    res = vue_CheckLastWorkTimeStillContinue(user, timeZone)
    if res['on_work'] == False:
        return {
            'on_work': False,
            'message': "Start Work First!"
        }
    doc = res['worktime'].name
    doc = frappe.get_doc("WorkTime", doc)
    # dialog_data = eval(dialog_data)
    if dialog_data:
        if ("case_task" in dialog_data):
            doc.task = dialog_data['case_task']
        if ("description" in dialog_data):
            doc.description = dialog_data['description']
    doc.save()

    return {
        'worktime': doc
    }


@frappe.whitelist()
def vue_pauseWorkTime(user, timeZone):
    res = vue_CheckLastWorkTimeStillContinue(user, timeZone)
    if res['on_work'] == True and res['status'] == "Active":
        docName = res['worktime'].name
        employee = frappe.db.sql(
            """select * from tabEmployee where prefered_email="{}";""".format(user), as_dict=True)
        editDoc = frappe.get_doc("WorkTime", docName)
        if (editDoc.user == employee[0].name):
            local_tz = pytz.timezone(timeZone)
            current_local_time = datetime.now(local_tz)
            editDoc.pause_session_time = current_local_time.strftime(
                "%Y-%m-%d %H:%M:%S %z")
            startTime = ""
            if editDoc.resume_session_time == "":
                startTime = editDoc.start_session_time.split(" ")[0:2]
            else:
                startTime = editDoc.resume_session_time.split(" ")[0:2]

            startTime = " ".join([startTime[0], startTime[1]])
            startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')

            pauseTime = editDoc.pause_session_time.split(" ")[0:2]
            pauseTime = " ".join([pauseTime[0], pauseTime[1]])
            pauseTime = datetime.strptime(pauseTime, '%Y-%m-%d %H:%M:%S')

            diff_in_seconds = (pauseTime - startTime).total_seconds()

            spendTimeSecond = 0
            if editDoc.spend_session_time != "":
                hours, minutes, seconds = map(
                    int, editDoc.spend_session_time.split(':'))
                spendTimeSecond = timedelta(
                    hours=hours, minutes=minutes, seconds=seconds).total_seconds()

            editDoc.spend_session_time = timedelta(
                seconds=(diff_in_seconds+spendTimeSecond))
            if len(str(editDoc.spend_session_time)) > 8:
                days, timeData = str(editDoc.spend_session_time).split(", ")
                days = int(days.split()[0])
                days_hour = days * 24
                splitData = timeData.split(":")
                saveTime = int(timeData.split(":")[0])
                saveTime = days_hour+saveTime
                finalTime = str(saveTime)+":"+splitData[1]+":"+splitData[2]
                editDoc.spend_session_time = finalTime
                editDoc.save()
                return editDoc

            editDoc.save()
            return {
                'worktime': editDoc
            }
    else:
        return {
            'on_work': False,
            'message': "Pause Option is not availale for now!"
        }


@frappe.whitelist()
def vue_resumeWorkTime(user, timeZone):
    res = vue_CheckLastWorkTimeStillContinue(user, timeZone)
    if res['on_work'] == True and res['status'] == "Pause":
        docName = res['worktime'].name
        employee = frappe.db.sql(
            """select * from tabEmployee where prefered_email="{}";""".format(user), as_dict=True)
        editDoc = frappe.get_doc("WorkTime", docName)
        if (editDoc.user == employee[0].name):
            local_tz = pytz.timezone(timeZone)
            current_local_time = datetime.now(local_tz)
            editDoc.pause_session_time = ""
            editDoc.resume_session_time = current_local_time.strftime(
                "%Y-%m-%d %H:%M:%S %z")
            editDoc.save()
            return {
                'worktime': editDoc
            }
        return {
            'on_work': False,
            'message': " Resume Option is not availale for now!"
        }
    else:
        return {
            'on_work': False,
            'message': "Resume Option is not availale for now!"
        }


@frappe.whitelist()
def vue_endWorkTime(user, timeZone):
    res = vue_CheckLastWorkTimeStillContinue(user, timeZone)
    if res['worktime'].task == None or res['worktime'].description == None:
        return {
            'message': "Task and Description is needed to close work instance!"
        }
    if res['on_work'] == True:
        docName = res['worktime'].name
        employee = frappe.db.sql(
            """select * from tabEmployee where prefered_email="{}";""".format(user), as_dict=True)
        editDoc = frappe.get_doc("WorkTime", docName)
        if (editDoc.user == employee[0].name):
            local_tz = pytz.timezone(timeZone)
            current_local_time = datetime.now(local_tz)
            startTime = ""
            endTime = ""
            if editDoc.pause_session_time != "":
                editDoc.end_session_time = editDoc.pause_session_time
            else:
                editDoc.end_session_time = current_local_time.strftime(
                    "%Y-%m-%d %H:%M:%S %z")

            if editDoc.resume_session_time == "":
                startTime = editDoc.start_session_time.split(" ")[0:2]
                endTime = editDoc.end_session_time.split(" ")[0:2]
                startTime = " ".join([startTime[0], startTime[1]])
                endTime = " ".join([endTime[0], endTime[1]])
                startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
                endTime = datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S')
                diff_in_seconds = (endTime - startTime).total_seconds()

                editDoc.spend_session_time = timedelta(seconds=diff_in_seconds)
                if len(str(editDoc.spend_session_time)) > 8:
                    days, timeData = str(
                        editDoc.spend_session_time).split(", ")
                    days = int(days.split()[0])
                    days_hour = days * 24
                    splitData = timeData.split(":")
                    saveTime = int(timeData.split(":")[0])
                    saveTime = days_hour+saveTime
                    finalTime = str(saveTime)+":"+splitData[1]+":"+splitData[2]
                    editDoc.spend_session_time = finalTime
                    editDoc.save()
                    return {
                        'worktime': editDoc
                    }
                editDoc.save()
                return {
                    'worktime': editDoc
                }
            elif editDoc.pause_session_time != "":
                editDoc.save()
                return {
                    'worktime': editDoc
                }

            else:
                startTime = editDoc.resume_session_time.split(" ")[0:2]
                endTime = editDoc.end_session_time.split(" ")[0:2]
                startTime = " ".join([startTime[0], startTime[1]])
                endTime = " ".join([endTime[0], endTime[1]])
                startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
                endTime = datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S')
                diff_in_seconds = (endTime - startTime).total_seconds()

                spendTimeSecond = 0
                if editDoc.spend_session_time != "":
                    hours, minutes, seconds = map(
                        int, editDoc.spend_session_time.split(':'))
                    spendTimeSecond = timedelta(
                        hours=hours, minutes=minutes, seconds=seconds).total_seconds()

                editDoc.spend_session_time = timedelta(
                    seconds=(diff_in_seconds+spendTimeSecond))
                if len(str(editDoc.spend_session_time)) > 8:
                    days, timeData = str(
                        editDoc.spend_session_time).split(", ")
                    days = int(days.split()[0])
                    days_hour = days * 24
                    splitData = timeData.split(":")
                    saveTime = int(timeData.split(":")[0])
                    saveTime = days_hour+saveTime
                    finalTime = str(saveTime)+":"+splitData[1]+":"+splitData[2]
                    editDoc.spend_session_time = finalTime
                    editDoc.save()
                    return editDoc
                editDoc.save()
                return {
                    'worktime': editDoc
                }
    else:
        return {
            'on_work': False,
            'message': "Start Work First!"
        }


@frappe.whitelist()
def vue_reactiveWorkTime(user, timeZone, worktimeDoc):
    res = vue_CheckLastWorkTimeStillContinue(user, timeZone)
    if res['on_work'] == False:
        doc = frappe.get_doc("WorkTime", worktimeDoc)

        local_tz = pytz.timezone(timeZone)
        current_local_time = datetime.now(local_tz)
        doc.resume_session_time = current_local_time.strftime(
            "%Y-%m-%d %H:%M:%S %z")

        doc.end_session_time = ""
        doc.pause_session_time = ""

        doc.save()
        return {
            "worktime": doc
        }
    else:
        return res


@frappe.whitelist()
def vue_reactiveWorkTimeList(user, task=None):
    # it's return non approve task worksheet histroy
    employee = frappe.db.sql(
        """select name from tabEmployee where prefered_email="{}";""".format(user), as_dict=True)
    employee = employee[0].name
    if task:
        doc = frappe.get_all("WorkTime", fields=["name", "user", "task", "spend_session_time", "description"], filters=[
                             ["user", "=", employee], ["task", "=", task], ["spend_session_time", "!=", ""]])
    else:
        doc = frappe.get_all("WorkTime", fields=["name", "user", "task", "spend_session_time", "description"], filters=[
                             ["user", "=", employee], ["spend_session_time", "!=", ""], ["task", "!=", ""]])

    workSheet = []
    for item in doc:
        taskdata = frappe.get_doc("Task", item.task)
        if taskdata.is_approved == 0 and taskdata.docstatus != 2:
            workSheet.append(item)

    return workSheet


# def vue_current
# old apis , not much effective in new version of apis
CASE_DOCTYPE = 'Case'
CLIENT_DOCTYPE = 'Customer'


@frappe.whitelist()
def get_total_requests():
    return frappe.db.sql("""SELECT count(name) as total FROM `tab{}` where case_status_workflow='Draft' """.format(CASE_DOCTYPE), as_dict=True)[0].total


@frappe.whitelist()
def total_clients():
    return frappe.db.sql("""SELECT count(*) as total FROM `tab{}`""".format(CLIENT_DOCTYPE), as_dict=True)[0].total


@frappe.whitelist()
def successfull_cases():
    return frappe.db.sql("""SELECT count(name) as total FROM `tab{}` WHERE case_status_workflow='Won'""".format(CASE_DOCTYPE), as_dict=True)[0].total


@frappe.whitelist()
def satisfied_clients():
    return [0]
    return frappe.db.sql("""SELECT DISTINCT first_name, middle_name, last_name FROM `tab{0}` INNER JOIN `tab{1}` ON `tab{1}`.client = `tab{0}`.name AND case_status_workflow ='Won';""".format(CLIENT_DOCTYPE, CASE_DOCTYPE), as_dict=True)


@frappe.whitelist()
def new_clients():
    return [0]
    return frappe.db.sql("""SELECT DISTINCT first_name, middle_name, last_name FROM `tab{0}` INNER JOIN `tab{1}` ON `tab{1}`.client = `tab{0}`.name AND case_status_workflow ='Draft';""".format(CLIENT_DOCTYPE, CASE_DOCTYPE), as_dict=True)


@frappe.whitelist()
def status_chart():
    return frappe.db.sql("""SELECT COUNT(*), case_status_workflow FROM `tab{}` GROUP BY case_status_workflow;""".format(CASE_DOCTYPE))


@frappe.whitelist()
def status_chart_2():
    output = frappe.db.sql(
        """SELECT creation FROM `tab{}`""".format(CASE_DOCTYPE))
    today = date.today()
    output = list(output)
    lastDates = []
    for i in range(7):
        d = today - timedelta(days=i)
        lastDates.append(d)
    return [output, lastDates]


@frappe.whitelist()
def query_database(query):
    data = {'reply': 0}
    content = frappe.db.sql(f"""{query}""")
    data["reply"] = content
    return data
