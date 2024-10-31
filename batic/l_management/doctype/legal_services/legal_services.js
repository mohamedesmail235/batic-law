// Copyright (c) 2023, law firm and contributors
// For license information, please see license.txt

frappe.ui.form.on("Legal Services", {
    onload: async function (frm) {

        frm.set_query('contarct', function () {
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
    refresh(frm) {

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
    contarct: async function (frm) {
        if (frm.doc.contarct) {
            let contractData = await frappe.db.get_doc("Contract", frm.doc.contarct)
            frm.set_value("client", contractData.party_name)
        } else {
            frm.set_value("client", "")
        }
    },
    after_save: function (frm) {
        localStorage.setItem("LegalService", frm.doc.name)
    },
    validate: function (frm) {
        if (frm.fields_dict.contarct.value) {
            let contractData;
            frappe.call({
                method: 'batic.l_management.doctype.case.case.get_doc',
                args: { doctype: "Contract", name: frm.fields_dict.contarct.value },
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
