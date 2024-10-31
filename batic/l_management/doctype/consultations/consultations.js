// Copyright (c) 2023, law firm and contributors
// For license information, please see license.txt

frappe.ui.form.on('Consultations', {
	onload: async function (frm) {

		frm.set_query('agent', 'agents', function (doc, cdt, cdn) {
			return {
				filters: {
					"type_of_job": ['in', ['Team Head Lawyer']]
				}
			}

		});

		frm.set_query('contract', function () {
			return {
				filters: {
					"is_signed": 1
				}
			}

		});
		frm.set_query('quotation', function () {
			return {
				filters: {
					"status": "Open"
				}
			}

		});
	},
	quotation: async function (frm) {
		if (frm.doc.quotation) {
			let quotationData = await frappe.db.get_doc("Quotation", frm.doc.quotation)
			frm.set_value("customer", quotationData.customer_name)
		} else {
			frm.set_value("customer", "")
		}
	},
	contract: async function (frm) {
		if (frm.doc.contract) {
			let contractData = await frappe.db.get_doc("Contract", frm.doc.contract)
			frm.set_value("customer", contractData.party_name)
		} else {
			frm.set_value("customer", "")
		}
	},
	refresh: function (frm) {
		frm.add_custom_button(__("Task"), function () {
			location.href = `/app/task/new-task-1`
		}, __("Create"));
		frm.add_custom_button(__("Project"), function () {
			location.href = `/app/project/new-project-1`
		}, __("Create"));
		frm.add_custom_button(__("Sales Invoice"), function () {
			location.href = `/app/sales-invoice/new-sales-invoice-1`
		}, __("Create"));
	},
	validate: function (frm) {
		if (frm.fields_dict.contract.value) {
			let contractData;
			frappe.call({
				method: 'batic.l_management.doctype.case.case.get_doc',
				args: { doctype: "Contract", name: frm.fields_dict.contract.value },
				callback: function (r) {
					contractData = r.message
				},
				async: false
			})
			if (contractData.is_signed != 1) {
				frappe.msgprint('Make sure Contract is Signed');
				frappe.throw("Contract is not Signed!");
			}
		}

	}
});
