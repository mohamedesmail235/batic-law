// Copyright (c) 2023, law firm and contributors
// For license information, please see license.txt

frappe.ui.form.on("WorkTime", {
    refresh(frm) {
        // frappe.call({
        //     method: "batic.l_management.doctype.worktime.worktime.get_total_work_hour_record",
        //     args: { orderType: "Case", orderName: "Case-ABC" },
        //     callback: function (r) {
        //         console.log("DD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.l_management.doctype.worktime.worktime.payment_details",
        //     args: { orderType: "Consultations", orderName: "Consultations-2023-06-05-524" },
        //     callback: function (r) {
        //         console.log("DD", r.message);
        //     }
        // })


        // // for generate Invoice
        // let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // console.log(timeZone);
        // let linked_document_type = "Case"
        // let linked_document = "Case-FAKE"
        // let customer = "Abu Hassan"
        // frappe.call({
        //     method: "batic.l_management.doctype.worktime.worktime.create_invoice",
        //     args: { timeZone, linked_document_type, linked_document },
        //     callback: function (r) {
        //         console.log("DD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.l_management.doctype.worktime.worktime.employee",
        //     callback: function (r) {
        //         console.log("DD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.cases.page.overview.overview.get_task_list",
        //     // [get_order_list, get_case_list,get_quotation_list,get_contract_list,get_consultation_list,get_case_category_list
        //     //      get_consultation_category_list,get_employee_list, get_court_list,get_judge_list,get_section_list,
        //     //  get_evidence_list, get_poa_list ,get_court_session_list(case,agent,case_status),get_task_list(supervisor,task_status,is_approved)  ]
        //     args: { page: 1, limit: 12, customer: "John", agent: "HR-EMP-00007" },
        //     callback: function (r) {
        //         console.log("DD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.cases.page.overview.overview.case_overview",
        //     args: { case_no: 'ABC' },
        //     callback: function (r) {
        //         console.log("DD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.cases.page.overview.overview.employee_overview",
        //     args: { employee_id: 'HR-EMP-00002' },
        //     callback: function (r) {
        //         console.log("DD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.cases.page.overview.overview.order_overview",
        //     args: {},
        //     callback: function (r) {
        //         console.log("DD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.cases.page.overview.overview.top_employee",
        //     args: { start: "2023-05-29", end: "2023-07-31" },
        //     callback: function (r) {
        //         console.log("DD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.cases.page.overview.overview.get_possible_workflow_actions",
        //     args: { doctype: "Case", name: "Case-ABC" },
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })

        // frappe.call({
        // method: "batic.cases.page.overview.overview.make_workflow_change",
        // args: { doctype: "Case", docname: "Case-ABC", action: "Motion Review" },
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })


        // frappe.call({
        //     method:  ,
        //     args: {},
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.cases.page.overview.overview.vacation_request_change_status",
        //     args: { docname: "Vacation-HR-EMP-00005-00574", status: "Approved" },
        //     //Waiting Approved Rejected
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })

        // doc creation...
        // frappe.call({
        //     method: "api/method/frappe.desk.search.search_link",
        //     args: { txt: "", doctype: "Case" },
        //     //Waiting Approved Rejected
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.l_management.doctype.worktime.worktime.get_doc_record_details",
        //     args: { doctype: "Quotation", docname: "SAL-QTN-2023-00025" },
        //     //Waiting Approved Rejected
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })
        // frappe.call({
        //     method: "batic.l_management.doctype.worktime.worktime.get_doc_record_details",
        //     args: { doctype: "Contract", docname: "Abu Hassan" },
        //     //Waiting Approved Rejected
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })
        // frappe.call({
        //     method: "    ",
        //     args: { doctype: "Task", docname: "TASK-2023-00001" },
        //     //Waiting Approved Rejected
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })


        // const obj = {
        //     "doctype": "Court",
        //     "court_name": "Testssss COurt",
        //     "country": "UAE",
        //     "city": "Abu Dhabi"
        // }
        // frappe.call({
        //     method: "batic.l_management.doctype.worktime.worktime.create_doc",
        //     args: { obj: obj },
        //     //Waiting Approved Rejected
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.l_management.doctype.worktime.worktime.who_am_i",
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })
        // console.log(frappe.)

        // frappe.call({
        //     method: "batic.l_management.doctype.worktime.worktime.search",
        //     args: {
        //         doctype: "Employee",
        //         txt: "",
        //         reference_doctype: "",
        //         filters: { "type_of_job": ["in", ["Team Head Lawyer"]] },
        //         ignore_user_permissions: 0
        //     },
        //     callback: function (r) {
        //         console.log("DgD", r.results);
        //     }
        // })

        // frappe.call({
        //     method: "batic.cases.page.overview.overview.annual_calandar",
        //     args: { start: "2023-06-01", end: "2023-07-15" },
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.l_management.doctype.worktime.worktime.documents",
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.cases.page.overview.overview.order_details",
        //     args: { docname: "ORD-2023-00009" },
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })


        // frappe.call({
        //     method: "batic.cases.page.overview.overview.employee_technical_rate",
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.cases.page.overview.overview.consultation_overview",
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.cases.page.overview.overview.contract_overview",
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })


        // frappe.call({
        //     method: "batic.cases.page.overview.overview.master_data",
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.cases.page.overview.overview.evidence_overview",
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.cases.page.overview.overview.quotation_overview",
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.l_management.doctype.worktime.worktime.gehr_data",
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })


        // frappe.call({
        //     method: "batic.cases.page.overview.overview.task_custom_list",
        //     args: { employee_id: "HR-EMP-00007" },
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })

        // head team lawyer dashboard

        // frappe.call({
        //     method: "batic.cases.page.overview.overview.head_lawyer_dashboard_report",
        //     args: { employee_id: "HR-EMP-00001", report_start_date: "2023-05-01", report_end_date: "2023-07-31" },
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.cases.page.overview.overview.head_lawyer_dashboard_chart",
        //     args: { start_date: "2023-07-19", end_date: "2023-07-27" },
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.cases.page.overview.overview.head_lawyer_dashboard_other",
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })


        // frappe.call({
        //     method: "batic.cases.page.overview.overview.create_employee_user",
        //     args: { first_name: "Sam", type_of_job: "Team Head Lawyer", prefered_contact_email: "Personal Email", personal_email: "sam@mvp.ae", technical_position: "Lawyer", gender: "Male", date_of_birth: "1997-04-25", date_of_joining: "1997-04-25", company_email: "" },
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.cases.page.overview.overview.change_employee_type_of_job",
        //     args: { employee_id: "HR-EMP-00015", type_of_job: "Admin" },
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })


        // frappe.call({
        //     method: "batic.cases.page.overview.overview.change_task_status",
        //     args: { employee_id: "HR-EMP-00001", task_name: "TASK-asfsadf-00663", status: "Done" },
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })

        // frappe.call({
        //     method: "batic.cases.page.overview.overview.docs_filter_paginate",
        //     args: { doctype: "Case", page: 1, limit: 3, filters: [['customer', '=', 'Abu Hassan'], ['legal_case_result', '!=', 'Win']] },
        //     callback: function (r) {
        //         console.log("DgD", r.message);
        //     }
        // })




    },
});


