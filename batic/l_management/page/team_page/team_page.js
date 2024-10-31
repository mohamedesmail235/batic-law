
frappe.pages['team-page'].on_page_load = function(wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper){
			this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Lawyer Team',
			custom_page: true
		});
		this.make();
		
	},


	make: function(){
		let me = $(this);
		let team_name = frappe.route_options.team
		let context = {"team": team_name}
		let employee_name = null
		let user = "Administrator"

		if(frappe.route_options.employee){
			employee_name = frappe.route_options.employee
			context["employee"] = employee 
		}
		if (!frappe.session.user_fullname.includes("Admin") && !frappe.session.user_fullname.includes("HTLawyer")){
			context["employee"] = frappe.session.user_fullname
			context["user"] = "Head Team Lawyer"
		}
		
		context["allow"] = null
		if (frappe.session.user_fullname.includes("HTLawyer") || frappe.session.user_fullname.includes("Admin")){
			context["allow"] = frappe.session.user_fullname
		}
		let team_data = function(){
			frappe.call({
				method: "batic.l_management.page.team_page.team_page.get_team_data", //dotted path to server method
				args: context,
				callback: function(r) {
					console.log(r.message)
					context['employees'] = r.message.employees
					context['cases'] = r.message.cases
					context['tasks'] = r.message.tasks
					context['head_lawyer'] = r.message.head_lawyer[0]
				},
				async: false
			});
		}
		let setup_functions = function(){
			context['tasks'].forEach((task) => {
				if($(`#complete-${task.name}`))
				$(`#complete-${task.name}`).on('click', ()=>{
					if (frappe.session.user_fullname.includes("Admin") || frappe.session.user_fullname.includes("HTLawyer")){
						frappe.call({
							method: "batic.l_management.page.team_page.team_page.update_task_status", //dotted path to server method
							args: {status: "Completed", docName: `${task.name}`},
							callback: function(r) {		
								$(`#${task.name}`).remove()
								frappe.show_alert({
									message:__('Task Marked as Completed'),
									indicator:'green'
								}, 5);
							},
							async: false
						});
					}
					else{
						frappe.call({
							method: "batic.l_management.page.team_page.team_page.update_task_status", //dotted path to server method
							args: {status: "Approve", docName: `${task.name}`},
							callback: function(r) {		
								console.log(r.message)
								$(`#${task.name}`).remove()
								frappe.show_alert({
									message:__('Task Sent for Approval'),
									indicator:'green'
								}, 5);
							},
							async: false
						});
					}			
				})
			})
			$("#cases").on("click", ()=>{
				let button = $('#cases')
				button.addClass("btn-primary")
				$(`#teams`).removeClass("btn-primary")
				$(`#tasks`).removeClass("btn-primary")

				$('#overview-div').attr("class", "d-block")

				$('#tasks-div').attr("class", "d-none")
				$('#teams-div').attr("class", "d-none")
				
			})
			$("#tasks").on("click", ()=>{
				let button = $('#tasks')
				button.addClass("btn-primary")
				$(`#teams`).removeClass("btn-primary")
				$(`#cases`).removeClass("btn-primary")

				$('#tasks-div').attr("class", "d-block")

				$('#teams-div').attr("class", "d-none")
				$('#overview-div').attr("class", "d-none")
				
			})
			$("#teams").on("click", ()=>{
				let button = $('#teams')
				button.addClass("btn-primary")
				$(`#tasks`).removeClass("btn-primary")
				$(`#cases`).removeClass("btn-primary")

				$('#teams-div').attr("class", "d-block")

				$('#tasks-div').attr("class", "d-none")
				$('#overview-div').attr("class", "d-none")
				
			})
			$("#taskButton").click(() => {
				location.href = `/app/case-task/new-case-task-1?team=${team_name}`;
			});	
			$("#teamButton").click(() => {
				location.href = `/app/employee-teams/${team_name}`;
			});	
		}
		team_data();
		$(frappe.render_template("team_page", context)).appendTo(this.page.main)
		setup_functions()

	}

})
