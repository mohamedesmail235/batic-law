// Copyright (c) 2023, law firm and contributors
// For license information, please see license.txt

frappe.ui.form.on('Case Doctype', {
	// refresh: function(frm) {

	// }
	after_save:function(frm){
		frm.set_value("case_number", frm.doc.name)
	}
});