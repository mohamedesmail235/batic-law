
frappe.pages['employee-page'].on_page_load = function(wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper){
			this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Employees',
			custom_page: true
		});
		this.make();
		$("#employeeButton").click(() => {
			frappe.route_options = {}
			frappe.set_route(`/app/employee/new-employee-1`);
		});	
	},


	make: function(){
		let me = $(this);
		let cleanObject=function(value){
			const output = value.reduce((acc, curr) => {
				if (acc[curr.type_of_job]) {
				  acc[curr.type_of_job].push(curr);
				} else {
				  acc[curr.type_of_job] = [curr];
				}
				return acc;
			  }, {});
			console.log(output)
			return output;
		} 
		let data ;
		let specl =[]
		let recept = []
		let headl =[]
		let constul =[]
		let civil = []
		let acc = []

		let job_type = [headl,specl,constul,civil,acc,recept]
		let job_name = frappe.get_doc("employee")
		console.log(job_name);

		function frappeCall (){
			frappe.call({
				method: "batic.consumer.page.employee_page.employee_page.employee_data", //dotted path to server method
				callback: function(r) {
					data = r.message
					for(let i=0;i<data.length;i++){
						if(data[i].type_of_job == "Specialized Lawyer") specl.push(data[i])
						else if (data[i].type_of_job == "Receptionist") recept.push(data[i])
						else if (data[i].type_of_job == "Head Team Lawyer") headl.push(data[i])
						else if (data[i].type_of_job == "Civil Lawyer") civil.push(data[i])
						else if (data[i].type_of_job == "Consultant Lawyer") constul.push(data[i])
						else if (data[i].type_of_job == "Accounting") acc.push(data[i])
					}
				}
			});
		}

		let employee_data = function(){
			frappe.call({
				method: "batic.consumer.page.employee_page.employee_page.employee_data", //dotted path to server method
				callback: function(r) {
					clean_emp_data = cleanObject(r.message)
					console.log(clean_emp_data);
					if (Object.keys(clean_emp_data).length === 0){
						$(".employee-list-div").append(`<h4 class="text-primary mt-3">No Employees</h4>`)
					}
					Object.entries(clean_emp_data).forEach(([jobType, data])=>{
						$(".employee-list-div").append(`<h3 style="padding: 3% 0% 0% 0%">${jobType}</h3>`)

						jobType = jobType.replace(" ", "-")
						jobType = jobType.replace(" ", "-")
						$(".employee-list-div").append(`<div class="card-columns" id="${jobType}"</div>`)
						let cards = ""
						data.forEach(empData => {
							console.log(empData, jobType)
							let cardData = `<div class="card" id="${empData.name}" style="text-align: center;">	`
							if (empData.profile_picture != null)
								cardData +=	`<img class="rounded-circle pfp" alt="avatar1" src="${empData.profile_picture}" />`
								// cardData +=	`<img class="rounded-circle pfp" alt="avatar1" src="${empData.profile_picture}" />`
							else
								cardData +=	`<img class="rounded-circle pfp" alt="avatar1" src="/assets/frappe/images/default-avatar.png" />`
							cardData +=	`<div class="card-body">
										<h5 class="card-title text-dark">${empData.full_name}</h5>
										<p class="card-text">${ empData.title == null ? "No Title" : empData.title}</p>
									</div>
								</div>`
								$(`#${jobType}`).append(`${cardData}`);
								$(`#${empData.name}`).click(()=>{				
									// location.href=`case-task/new-case-task-1?case=${empData.name}`
									location.href=`employee-page-team/?employee=${empData.name}`
								})
							});
					})
				}
			});
		}
		employee_data();
		//frappeCall()
		$(frappe.render_template('employee_page', this)).appendTo(this.page.main)



	}

})

