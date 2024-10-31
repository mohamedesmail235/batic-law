// Copyright (c) 2023, law firm and contributors
// For license information, please see license.txt


frappe.ui.form.on('Power of Attorney', {
	onload: function (frm) {
		// var casevalue = localStorage.getItem("Case")
		// if (casevalue) frm.set_value("cases", casevalue)
		var customer = localStorage.getItem("Customer")
		if (!frm.doc.customer) {
			if (customer) frm.set_value('customer', customer)
		}
	},
	issue_date_in_hijri: function (frm) {
		let date = frm.doc.issue_date_in_hijri.split("/")
		if (date.length == 3) {
			if (date[2].length == 4) {
				frappe.call({
					method: "batic.l_management.doctype.power_of_attorney.power_of_attorney.get_Gregorian_date",
					args: { year: parseInt(date[2]), month: parseInt(date[1]), day: parseInt(date[0]) },
					callback: function (r) {
						console.log(r.message);
						frm.set_value("issue_date", r.message)
					},
					async: false
				});
			}
		}
	},
	expire_date_in_hijri: function (frm) {
		let date = frm.doc.expire_date_in_hijri.split("/")
		if (date.length == 3) {
			if (date[2].length == 4) {
				frappe.call({
					method: "batic.l_management.doctype.power_of_attorney.power_of_attorney.get_Gregorian_date",
					args: { year: parseInt(date[2]), month: parseInt(date[1]), day: parseInt(date[0]) },
					callback: function (r) {
						console.log(r.message);
						frm.set_value("expire_date", r.message)
					},
					async: false
				});
			}
		}
	},
	validate: function (frm) {
		if (frm.doc.issue_date && frm.doc.expire_date) {
			var issue = new Date(frm.doc.issue_date);
			var expire = new Date(frm.doc.expire_date);
		}

		if (issue > expire) {
			frappe.throw("Issue Date can not be greater than Expire Date!")
		}
		// let casedata;
		// let contractData;
		// frappe.call({
		// 	method: 'batic.l_management.doctype.case.case.get_doc',
		// 	args: { doctype: "Case", name: frm.doc.cases },
		// 	callback: function (r) {
		// 		casedata = r.message
		// 	},
		// 	async: false
		// })
		// frappe.call({
		// 	method: 'batic.l_management.doctype.case.case.get_doc',
		// 	args: { doctype: "Contract", name: casedata.contract },
		// 	callback: function (r) {
		// 		contractData = r.message
		// 	},
		// 	async: false
		// })
		// if (casedata.is_signed != 1) {
		// 	frappe.msgprint('Make sure Contract is Signed, Without Contract Sign, Customer cannot be filled!');
		// 	frappe.throw("Contract is not Signed & Customer Data missing for it!");
		// }
		// if (contractData.party_type == "Customer") {
		// 	frm.set_value('customer', contractData.party_name)
		// }
	}
});




