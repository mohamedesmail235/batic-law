// Copyright (c) 2023, law firm and contributors
// For license information, please see license.txt

frappe.ui.form.on('Court Session', {
	onload: function (frm) {
		let case_no = localStorage.getItem("Case");
		if (case_no != undefined && case_no != 'Case-undefined') {
			frm.set_value("case_session", case_no);
		}

		//poa fetch
		let poaData
		if (!frm.doc.poa) {
			if (frm.doc.agent && frm.doc.client && frm.doc.session_date) {
				frappe.call({
					method: "batic.l_management.doctype.court_session.court_session.get_poa",
					args: { agent: frm.doc.agent, client: frm.doc.client, session_date: frm.doc.session_date },
					callback: function (r) {
						poaData = r.message;
						if (poaData[0] == "Valid") {
							frm.set_value('poa', poaData[1].name)
						} else {
							frm.set_value('poa', poaData[1].name)
							frappe.msgprint('POA Date is Invalid, Please Update the POA or Create a new!', 'Error')
						}

					},
					async: false
				});
			} else {
				// frappe.msgprint('To fetch the POA Valid Case,Session & Agent are be present.!')
			}
		}
		frm.set_query('case_session', function () {
			return {
				filters: {
					"case_status_workflow": ['in', ['Processing', 'In Appeal', 'Motion for Review']]
				}
			}
		});

	},
	on_submit: function (frm) {
		location.reload()
	},
	agent: function (frm) {
		// frm.set_value('poa', "")
		// let poaData
		// if (!frm.doc.poa) {
		// 	if (frm.doc.agent && frm.doc.client && frm.doc.session_date) {
		// 		frappe.call({
		// 			method: "batic.l_management.doctype.court_session.court_session.get_poa",
		// 			args: { agent: frm.doc.agent, client: frm.doc.client, session_date: frm.doc.session_date },
		// 			callback: function (r) {
		// 				poaData = r.message;
		// 				if (poaData[0] == "Valid") {
		// 					frm.set_value('poa', poaData[1].name)
		// 				} else {
		// 					frm.set_value('poa', poaData[1].name)
		// 					frappe.msgprint('POA Date is Invalid, Please Update the POA or Create a new!', 'Error')
		// 				}

		// 			},
		// 			async: false
		// 		});
		// 	} else {
		// 		// frappe.msgprint('To fetch the POA Valid Case,Session & Agent are be present.!')
		// 	}
		// }
	},
	case_session: function (frm, cdt, cdn) {
		let case_no = frm.doc.case_session;
		let caseData;
		frappe.call({
			method: "batic.l_management.doctype.court_session.court_session.get_case",
			args: { case: case_no },
			callback: function (r) {
				console.log("cased", r.message);
				caseData = r.message
			},
			async: false
		});
		if (caseData) {
			if (caseData.case_status_workflow == "In Appeal" || caseData.case_status_workflow == "Motion for Review") {
				frm.set_value("case_status", caseData.case_status_workflow)
			} else {
				frm.set_value("case_status", "Trail Court")
			}
			frm.set_value("client", caseData.customer)
			frm.set_value("client_status", caseData.client_status)
			frm.set_value("court", caseData.court)
			frm.set_value("section", caseData.section)
			let rows = [];
			caseData.contender.forEach(element => {
				let row = {
					"name1": element.name1,
					"id_number": element.id_number
				}
				rows.push(row)
			});
			frm.set_value("contenders", rows)

			if (caseData.case_status_workflow == "Ended") {
				frappe.throw("Case Already Ended or Closed. Make sure case status in between Processing to Appeal or Motion for Review State!")
			}
		}
		frm.set_query('poa', function () {
			return {
				filters: {
					"customer": caseData.customer
				}
			}
		});

	},
	validate: function (frm) {
		let case_no = frm.doc.case_session;
		let caseData;
		frappe.call({
			method: "batic.l_management.doctype.court_session.court_session.get_case",
			args: { case: case_no },
			callback: function (r) {
				console.log("cased", r.message);
				caseData = r.message
			},
			async: false
		});
		if (caseData) {
			if (caseData.case_status_workflow == "Ended" || caseData.case_status_workflow == "Closed") {
				frappe.throw("Case Already Ended or Closed. Make sure case status in between Processing to Appeal or Motion for Review State!")
			}
		}
	},
	date_in_hirji: function (frm) {
		let date = frm.doc.date_in_hirji.split("/")
		if (date.length == 3) {
			if (date[2].length == 4) {
				frappe.call({
					method: "batic.l_management.doctype.power_of_attorney.power_of_attorney.get_Gregorian_date",
					args: { year: parseInt(date[2]), month: parseInt(date[1]), day: parseInt(date[0]) },
					callback: function (r) {
						console.log(r.message);
						frm.set_value("session_date", r.message)
					},
					async: false
				});
			}
		} else {
			frm.set_value("session_date", "")
		}
	},
	next_session_hijri_date: function (frm) {
		let date = frm.doc.next_session_hijri_date.split("/")
		if (date.length == 3) {
			if (date[2].length == 4) {
				frappe.call({
					method: "batic.l_management.doctype.power_of_attorney.power_of_attorney.get_Gregorian_date",
					args: { year: parseInt(date[2]), month: parseInt(date[1]), day: parseInt(date[0]) },
					callback: function (r) {
						console.log(r.message);
						frm.set_value("next_session_date", r.message)
					},
					async: false
				});
			}
		} else {
			frm.set_value("next_session_date", "")
		}
	},

});
