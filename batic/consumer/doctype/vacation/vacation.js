// Copyright (c) 2023, law firm and contributors
// For license information, please see license.txt

frappe.ui.form.on('Vacation', {
	refresh: function (frm) {
		if (frappe.session.user == "Administrator") {
			frm.set_df_property('status', 'hidden', false);
			frm.refresh_field('status');
		}
	},
	before_save: function (frm) {
		if (frappe.session.user != "Administrator") {
			employee = null
			frappe.call({
				method: "batic.consumer.doctype.vacation.vacation.docs",
				args: {
					doctype: "Employee",
					docname: frm.doc.employee
				},
				callback: (r) => {
					employee = r.message
				},
				async: false
			})
			if (frappe.session.user != employee.prefered_email) {
				frappe.throw("Not Valid User to edit!")
			}

		}
	}
});
