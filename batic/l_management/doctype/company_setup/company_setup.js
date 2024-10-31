// Copyright (c) 2023, law firm and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Company Setup", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on('Company Setup', {
    onload: async function (frm) {
        frm.set_query('quotation', function () {
            return {
                filters: {
                    "status": "Open"
                }
            }
        });
    },
    company_member: function (frm) {
        if (frm.doc.company_member === 'One Person') {
            frm.set_df_property('client', 'reqd', true);
            frm.set_df_property('partners', 'reqd', false);
        } else {
            frm.set_df_property('client', 'reqd', false);
            frm.set_df_property('partners', 'reqd', true);

        }
    },
    quotation: async function (frm) {
        if (frm.doc.quotation) {
            let quotationData = await frappe.db.get_doc("Quotation", frm.doc.quotation)
            if (quotationData) {
                frm.set_value("client", quotationData.customer_name)
            }
        } else {
            frm.set_value("client", "")
        }
    },
});
