frappe.pages['my-task-page'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'My Tasks',
		single_column: true
	});
}