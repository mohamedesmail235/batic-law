// Copyright (c) 2023, law firm and contributors
// For license information, please see license.txt

frappe.ui.form.on('Client Orders', {
	refresh: function(frm) {
		frm.add_custom_button(__("Contracts"), function(){
			location.href=`/app/contracts/new-contracts-1`
			}, __("Create"));
		frm.add_custom_button(__("Consultation"), function(){
			location.href=`/app/consultations/new-consultations-1`
		  }, __("Create"));
		frm.add_custom_button(__("Case"), function(){
			location.href=`/app/case/new-case-1`
		}, __("Create"));
		frm.add_custom_button(__("Sales Invoice"), function(){
			location.href=`/app/sales-invoice/new-sales-invoice-1`
		}, __("Create"));

		if(frm.doc.order_status_workflow != "Rejected"){
			frm.toggle_display("reject_reason", false);
		}
		if(frm.doc.order_status_workflow == "Draft" && frm.docname.substr(0,3) != "new"){
			frm.set_df_property('due_date', 'reqd', 1);
			frm.set_df_property('order_details', 'reqd', 1);
			frm.set_df_property('agents', 'reqd', 1);
			console.log(frm.doc.order_status_workflow)
			console.log(frm.doc.docstatus)
			console.log(frm.docname.substr(0,3))
			console.log(frm)


		}
	}
	
});