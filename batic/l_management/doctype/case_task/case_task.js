// Copyright (c) 2023, law firm and contributors
// For license information, please see license.txt

frappe.ui.form.on('Case Task', {
	onload: function (frm) {
		// let urlParams = document.URL.split('?')
		// if (urlParams.length > 0){
		// 	const paramString = urlParams[1]
			
		// 	let queryString = new URLSearchParams(paramString);
		// 	let key, val;
		// 	for (let pair of queryString.entries()){
		// 		key = pair[0]
		// 		val = pair[1]
		// 	}
		// 	if (val != undefined){
		// 		let row = frm.set_value('team', val)
		// 		frm.refresh_field('team');
		// 	}
		// }
		console.log(frm.doc.case_task_workflow_state)
		console.log(frm.docname)
		console.log(frm)

	},
	before_save: function(frm){
		if(frm.doc.task_priority == "High")
			frm.set_value("color", "#ff0000")
		else if (frm.doc.task_priority == "Medium")
			frm.set_value("color", "#00ff00")
		else
			frm.set_value("color", "#ffff00")

	}
});
