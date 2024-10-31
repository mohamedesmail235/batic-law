
frappe.pages['employee-page-extend'].on_page_load = function(wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper){
			this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Case Details',
			single_column: false,
			custom_page: true
		});
		this.parent = wrapper;
		this.page = this.parent.page;
		// this.page.sidebar.html(
		// 	`<ul class="standard-sidebar leaderboard-sidebar overlay-sidebar"></ul>`
		// );
		// this.$sidebar_list = this.page.sidebar.find("ul");
		this.make();
		$("#invoiceButton").on("click", ()=>{
			let d = new frappe.ui.Dialog({
				title: 'Enter details',
				fields: [
					{
						label: 'Invoice value',
						fieldname: 'invoice_value',
						fieldtype: 'Int',
						reqd: 1
					},
					{
						label: 'Address Invoice',
						fieldname: 'address_invoice',
						fieldtype: 'Data',
						reqd: 1
					},
					{
						label: 'Receipt',
						fieldname: 'receipt',
						fieldtype: 'Attach',
						reqd: 1
					}
				],
				primary_action_label: 'Submit',
				primary_action(values) {
					console.log(values);
					d.hide();
				}
			});
			
			d.show();
		})
		
	},

	make: function(){
		let me = $(this);
		let finalData = null
		let data = frappe.route_options.employee
		let context = {}
		
		let setup_functions = function(){
			context['tasks'].forEach((value) => {
				console.log(value)
				$(`#complete-${value.name}`).on('click', ()=>{
					
					frappe.call({
						method: "batic.consumer.page.employee_page_extend.employee_page_extend.update_task", //dotted path to server method
						args: {updatedStatus: "Complete",
							docName: `${value.name}`
						},
						async: false,
						callback: function(r) {
							// $(`#request-${value.name}`).remove();
							// remaining_requests = $(".total_requests").find(`.data`)
							// $("#requests_text")[0].innerHTML = `${remaining_requests.length} Vacation Requests`
							frappe.show_alert({
								message:__(`Task Marked Complete`),
								indicator:'green'
							}, 5);
						}
					});
				})
			})
		}
		frappe.call({
			method: "batic.consumer.page.employee_page_extend.employee_page_extend.employee_data",
			args: {employee_data: data},
			callback: function(r) {
				// clean_emp_data = r.message
				console.log(r.message)
				context['employee'] = r.message.employee[0];
				context['tasks'] = r.message.tasks;
			},
			async: false
		});
		context['title'] = data
		$(frappe.render_template('employee_page_extend', context)).appendTo(this.page.main)
		setup_functions()
	}

})

