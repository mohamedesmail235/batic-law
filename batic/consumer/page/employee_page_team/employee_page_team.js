
frappe.pages['employee-page-team'].on_page_load = function(wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper){
			this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Employee Homepage',
			custom_page: true
		});
		this.make();
	},


	make: function(){
		let me = $(this);
		let employee_name = null
		let context = {}
		if (frappe.route_options.employee != undefined)
			employee_name = frappe.route_options.employee
		
		if(!frappe.session.user.includes("Admin"))
			employee_name = frappe.session.user_fullname
		context["allow"] = null
		if (frappe.session.user_fullname.includes("HTLawyer") || frappe.session.user_fullname.includes("Admin")){
			context["allow"] = frappe.session.user_fullname
		}
			
		let employee_data = function(){
			frappe.call({
				method: "batic.consumer.page.employee_page_team.employee_page_team.employee_teams", //dotted path to server method
				args: {employee: employee_name},
				callback: function(r) {
					console.log(r.message)
					// if (!r.message.teams[0]){
					// 	r.message.teams = []
					// }
					context['teams'] = r.message.teams
				},
				async: false
			});
		}
		let setup_functions = function(){
			context['teams'].forEach((team) => {
				$(`#${team.name}`).on('click', ()=>{
					
					location.href=`/app/team-page/?team=${team.name}`
					
				})
			})
		}
		employee_data();
		console.log(context)
		$(frappe.render_template("employee_page_team", context)).appendTo(this.page.main)
		setup_functions()
		if ($("#teamButton")){
			$("#teamButton").click(() => {
				frappe.route_options = {}
				location.href = `/app/employee-teams/new-employee-teams-1?head_lawyer=${employee_name}`;
			});	
		}
	}

})
