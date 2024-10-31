// Copyright (c) 2023, law firm and contributors
// For license information, please see license.txt

frappe.ui.form.on("Order", {
    onload: function (frm) {

        // custom filter for head team lawyer
        frm.set_query('employee', 'agents', function (doc, cdt, cdn) {
            return {
                filters: {
                    "type_of_job": ['in', ['Team Head Lawyer']]
                }
            }

        });

    },
    refresh(frm) {
        if (frm.doc.order_status_workflow == "Processing") {
            frm.add_custom_button(__('Create a Quotation'), () => {
                frappe.new_doc("Quotation")
            }, __('Create'));
        }
    },
});
