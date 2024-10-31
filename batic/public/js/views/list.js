/*
* List View
*/

baticApp.vue_list_get_indicator_html = (doc, doctype, show_workflow_state) => {
    const indicator = frappe.get_indicator(doc, doctype, show_workflow_state);

    // console.log('doc', doc)
    // console.log('doctype', doctype)
    // console.log('show_workflow_state', show_workflow_state)
    // console.log('indicator', indicator)

    // sequence is important
    const docstatus_description = [
        __("Document is in draft state"),
        __("Document has been submitted"),
        __("Document has been cancelled"),
    ];
    const title = docstatus_description[doc.docstatus || 0];
    if (indicator) {
        return `<span class="indicator-pill ${
            indicator[1]
        } filterable no-indicator-dot ellipsis"
				data-filter='${indicator[2]}' title='${title}'>
				<span class="ellipsis"> ${__(indicator[0])}</span>
			</span>`;
    }
    return "";
}
