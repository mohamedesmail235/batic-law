
frappe.pages['work-records'].on_page_load = function(wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper){
			this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'My Work Records',
			custom_page: true
		});
		
		//for back button on browser, Don't need to touch
		window.addEventListener('popstate', function(event) {
			this.window.location.reload()
		  });
		

		var user_fullname, adminView
		if((frappe.session.user).startsWith("Admin")){
			if(frappe.get_route()[1]){
				 user_fullname = frappe.get_route()[1]
				 adminView = true
			}
		}else{
			 user_fullname = frappe.session.user_fullname;
			 adminView = false
		}
		console.log("Route",frappe.get_route()[1]);


		let context = {}
		let datatable = []
		frappe.call({
			method: "batic.l_management.page.work_records.work_records.get_card_data",
			args: {user_fullname},
			callback: function(r) {
				console.log("main",r.message);
				context['all_time_work_spend_time_string'] = r.message[0]
				context['currently_working_string'] = r.message[1]
				context['last7Days_work_hour_string'] = r.message[2]
				context['last7Days_work_attempts'] = r.message[3]
				datatable = r.message[4]
				console.log("s",datatable);
			},
			async: false
		});


		var workTimeSheet = [];
		datatable.forEach(item => {
			const stringData = timeSheet(item,adminView)
			workTimeSheet.push(stringData)
		})

		console.log();
		workTimeSheet = workTimeSheet.join(" ")
		context['workTimeSheet'] = workTimeSheet

		context['hiddeTable'] = ""
		if(datatable.length==0) {
			context['hiddeTable'] = "hidden"
		}
		
		console.log(workTimeSheet);

		

		function timeSheet(item,adminView){
			if(!adminView){
				return	`<div class="invoiceList">
							<p>${item.start_session_time}</p>
							<p>${item.end_session_time}</p>
							<p><a href="case-page-extend/${item.case}">${item.case}</a></p>
							<p><a href="case-task/${item.task}">${item.task}</a></p>
							<p>${item.spend_session_time}</p>
						</div>`
			}else{
				return	`<div class="invoiceList">
							<p>${item.start_session_time}</p>
							<p>${item.end_session_time}</p>
							<p><a href="case-page-extend/${item.case}">${item.case}</a></p>
							<p><a href="case-task/${item.task}">${item.task}</a></p>
							<p>${item.spend_session_time}</p>
						</div>`
			}

		}

		//location.reload()


		$(frappe.render_template('work_records', context)).appendTo(this.page.main)
	}
})
