
frappe.pages['top-employee-page'].on_page_load = function(wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper){
			this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: '',
			custom_page: true
		});
		this.make();
	},


	make: function(){
		let me = $(this);
		let context = {}
		let employee_data = function(){
			frappe.call({
				method: "batic.consumer.page.top_employee_page.top_employee_page.get_top_employees", //dotted path to server method
				args: context,
				callback: function(r) {
					console.log(r.message)
					context['employees'] = r.message.employees
				},
				async: false
			});
		}
		console.log(context)
		employee_data();
		$(frappe.render_template("top_employee_page", context)).appendTo(this.page.main)
	}

})

