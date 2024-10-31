
frappe.pages['emp-work-records'].on_page_load = function(wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper){
			this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Employee Work Records',
			custom_page: true
		});

		//for back button on browser, Don't need to touch
		window.addEventListener('popstate', function(event) {
			this.window.location.reload()
		  });

		  
		var context = {}
		var datatable;
		frappe.call({
			method: "batic.l_management.page.emp_work_records.emp_work_records.workTimeData",
			args: {},
			callback: function(r) {
				context['total_work_hours'] = r.message[0]
				context['currently_working'] = r.message[1]
				context['today_work_hours'] = r.message[2]
				context['today_work_attempt'] = r.message[3]
				datatable= r.message[4]
				console.log("res",r.message);
			},
			async: false
		});

		// for(let i=0;i<datatable.length;i++){
		// 	for(let j=0;j<datatable[i].length;j++){
		// 		if(datatable[i][j] == null){
		// 			datatable[i][j] = "No Data"
		// 		}
		// 		else if(datatable[i][j] == ""){
		// 			datatable[i][j] = "Pending"	
		// 		}
		// 		if((j==2 || j==1) && datatable[i][j] != "Pending"){
		// 			let data = datatable[i][j].split(" ")[1]
		// 			datatable[i][j] = data
		// 		}
		// 	}
		// }

		var workTimeSheet = [];
		datatable.forEach(item => {
			const stringData = timeSheet(item)
			workTimeSheet.push(stringData)
		})
		context['hiddeTable'] = ""
		if(datatable.length==0) {
			context['hiddeTable'] = "hidden"
		}

		workTimeSheet = workTimeSheet.join(" ")

		context['workTimeSheet'] = workTimeSheet

		function timeSheet(item){
			return	`<div class="invoiceList">
						<p><a href="work-records/${item.user}" target=_blank>${item.user}</a></p>
						<p>${item.start_session_time}</p>
						<p>${item.end_session_time}</p>
						<p><a href="case-page-extend/${item.case}">${item.case}</a></p>
						<p><a href="case-task/${item.task}">${item.task}</a></p>
						<p>${item.spend_session_time}</p>
					</div>`

		}
		
		console.log("sas",datatable);
		$(frappe.render_template('emp_work_records', context)).appendTo(this.page.main)
	}
})
