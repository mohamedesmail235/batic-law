// Copyright (c) 2023, law firm and contributors
// For license information, please see license.txt

frappe.ui.form.on('Case', {
	onload: function (frm) {
		frm.set_df_property('fields_html', 'columns', [
			{ "case_tasks": "task", "width": "100%" },
		]);
		if (frm.doc.case_no) {
			let data = frappe.get_doc("Case", `Case-${frm.doc.case_no}`)
			console.log(data);
			const legal_case_state_check = ['Ended', 'In Appeal', 'Motion for Review'];
			if (legal_case_state_check.includes(data.case_status_workflow)) {
				frm.set_df_property('legal_case_result', 'reqd', 1);
				frm.meta.fields[17].reqd = 1;
			} else {
				frm.set_df_property('legal_case_result', 'reqd', 0);
				frm.meta.fields[17].reqd = 0;
			}

			if (data.case_status_workflow == "In Appeal") {
				frm.set_df_property('appellate_judgment', 'reqd', 1);
				frm.meta.fields[28].reqd = 1;

			} else if (data.case_status_workflow == "Processing") {
				frm.set_df_property('appellate_judgment', 'reqd', 0);
				frm.meta.fields[28].reqd = 0;
			}

			if (data.case_status_workflow == "Ended") {
				frm.set_df_property('judgment', 'reqd', 1);
			} else {
				frm.set_df_property('judgment', 'reqd', 0);
			}

			//Hide & Show
			if (data.case_status_workflow == "Motion for Review" || data.case_status_workflow == "In Appeal" || data.case_status_workflow == "Ended") {
				frm.toggle_display('status_of_the_appellate_judgment', true);
			}
			if (data.case_status_workflow == "Motion for Review" || data.case_status_workflow == "Ended") {
				frm.toggle_display('verdict_of_the_supreme_court', true);
			}


		}

		frm.set_query('employee', 'agent', function (doc, cdt, cdn) {
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
		frm.set_query('evidence', 'evidence', function (doc, cdt, cdn) {
			return {
				filters: {
					"case": frm.doc.name
				}
			}

		});



	},
	refresh: function (frm) {
		frm.add_custom_button(__("Court Session"), function () {
			location.href = `/app/court-session/new-court-session-1`
		}, __("Create"));
		frm.add_custom_button(__("Request for POA"), function () {
			location.href = `/app/power-of-attorney/new-power-of-attorney-1`
		}, __("Create"));
		frm.add_custom_button(__("Evidence"), function () {
			location.href = `/app/evidence/new-evidence-1`
		}, __("Create"));
	},
	before_workflow_action: function (frm, action) {

		if (action) {
			let data = frappe.get_doc("Case", frm.doc.name)
			const legal_case_state_check = ['Ended', 'In Appeal', 'Motion for Review'];
			if (legal_case_state_check.includes(data.case_status_workflow) && !frm.doc.legal_case_result) {
				frappe.msgprint('Legal Case Result field Require to make action! Please reload the page.');
				frappe.throw("Required Field Empty. Please reload the page!")
			}

			if (data.case_status_workflow == "In Appeal" && !frm.doc.appellate_judgment) {
				frappe.msgprint('Appellate Judgment field Require to make action! Please reload the page.');
				frappe.throw("Required Field Empty. Please reload the page!")
			}
		}

	},
	after_workflow_action: function (frm, action) {
		location.reload()
	},
	start_date_in_hijri: function (frm) {
		let date = frm.doc.start_date_in_hijri.split("/")
		if (date.length == 3) {
			if (date[2].length == 4) {
				frappe.call({
					method: "batic.l_management.doctype.power_of_attorney.power_of_attorney.get_Gregorian_date",
					args: { year: parseInt(date[2]), month: parseInt(date[1]), day: parseInt(date[0]) },
					callback: function (r) {
						console.log(r.message);
						frm.set_value("start_date", r.message)
					},
					async: false
				});
			}
		}
	},
	close_date_in_hijri: function (frm) {
		let date = frm.doc.close_date_in_hijri.split("/")
		if (date.length == 3) {
			if (date[2].length == 4) {
				frappe.call({
					method: "batic.l_management.doctype.power_of_attorney.power_of_attorney.get_Gregorian_date",
					args: { year: parseInt(date[2]), month: parseInt(date[1]), day: parseInt(date[0]) },
					callback: function (r) {
						console.log(r.message);
						frm.set_value("close_date", r.message)
					},
					async: false
				});
			}
		}
	},
	contract: function (frm) {
		if (frm.doc.contract) {
			let contractData;
			frappe.call({
				method: 'batic.l_management.doctype.case.case.get_doc',
				args: { doctype: "Contract", name: frm.doc.contract },
				callback: function (r) {
					contractData = r.message
				},
				async: false
			})
			if (contractData.is_signed != 1) {
				frappe.msgprint('Make sure Contract is Signed, Without Contract Sign, Customer cannot be filled!');
				frappe.throw("Contract is not Signed & Customer Data missing for it!");
			}
			if (contractData.party_type == "Customer") {
				frm.set_value('customer', contractData.party_name)
			}
		} else {
			frm.set_value('customer', "")
		}
	},
	after_save: function (frm) {
		location.reload()
	},
	validate: function (frm) {
		console.log("Validate");
		let contractData;
		frappe.call({
			method: 'batic.l_management.doctype.case.case.get_doc',
			args: { doctype: "Contract", name: frm.doc.contract },
			callback: function (r) {
				contractData = r.message
			},
			async: false
		})
		if (contractData.is_signed != 1) {
			frappe.msgprint('Make sure Contract is Signed, Without Contract Sign, Customer cannot be filled!');
			frappe.throw("Contract is not Signed & Customer Data missing for it!");
		}
		if (contractData.party_type == "Customer") {
			frm.set_value('customer', contractData.party_name)
		}
	}
});


function getRequiredFieldNames(frm) {
	console.log(frm);
	var requiredFields = [];
	var meta = frm.meta;

	for (var fieldname in meta.fields) {
		var field = meta.fields[fieldname];
		if (field.reqd) {
			requiredFields.push(fieldname);
		}
	}

	return requiredFields;
}


function checkRequiredFieldValues(frm, requiredFields) {
	var missingFields = [];

	for (var i = 0; i < requiredFields.length; i++) {
		var fieldname = requiredFields[i];
		var value = frm.doc[fieldname];

		if (!value) {
			missingFields.push(fieldname);
		}
	}

	return missingFields;
}
