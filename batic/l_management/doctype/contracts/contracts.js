// Copyright (c) 2023, law firm and contributors
// For license information, please see license.txt

frappe.ui.form.on('Contracts', {
	refresh: function(frm) {
		frm.add_custom_button(__("Consultation"), function(){
			location.href=`/app/consultations/new-consultations-1`
		  }, __("Create"));
		frm.add_custom_button(__("Case"), function(){
			location.href=`/app/case/new-case-1`
		}, __("Create"));
		frm.add_custom_button(__("Project"), function(){
			location.href=`/app/project/new-project-1`
			}, __("Create"));
		frm.add_custom_button(__("Sales Invoice"), function(){
			location.href=`/app/sales-invoice/new-sales-invoice-1`
		}, __("Create"));
	}
});
