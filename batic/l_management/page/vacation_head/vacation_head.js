
frappe.pages['vacation-head'].on_page_load = function(wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper){
			this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Vacations',
			custom_page: true
		});
		this.make();
	},


	make: function(){
		let me = $(this);
		let isAllowed = false
		let context = {}
		context["employee"] = frappe.session.user_fullname
		let setup_functions = function(){
			if(context['employee_vacation'].msg){
				Array.from($(".border-primary")).forEach(e => {
						$(e).removeClass("border-primary")
						$(e).addClass("border-dark")
				});
			}else if(context['employee_vacation'].waiting){
				Array.from($(".border-primary")).forEach(e => {
						$(e).removeClass("border-primary")
						$(e).addClass("border-warning")
				});
			}else{
				Array.from($(".border-primary")).forEach(e => {
						$(e).removeClass("border-primary")
						$(e).addClass("border-success")
				});
			}
				
			$(function() {

				$(".progress").each(function() {
				
				var value = $(this).attr("data-value");
				var left = $(this).find(".progress-left .progress-bar");
				var right = $(this).find(".progress-right .progress-bar");
				
				if (value > 0) {
				if (value <= 50) {
				right.css("transform", "rotate(" + percentageToDegrees(value) + "deg)")
				} else {
				right.css("transform", "rotate(180deg)")
				left.css("transform", "rotate(" + percentageToDegrees(value - 50) + "deg)")
				}
				}
				
				})
				
				function percentageToDegrees(percentage) {
				
				return percentage / 100 * 360
				
				}
				
				});
			context['vacations'].forEach((value) => {
				console.log(value)
				$(`#accept-${value.name}`).on('click', ()=>{
					
					frappe.call({
						method: "batic.consumer.page.vacation_page.vacation_page.update_doc", //dotted path to server method
						args: {updatedStatus: "Approved",
							docName: `${value.name}`
						},
						async: false,
						callback: function(r) {
							$(`#request-${value.name}`).remove();
							remaining_requests = $(".total_requests").find(`.data`)
							$("#requests_text")[0].innerHTML = `${remaining_requests.length} Vacation Requests`
							frappe.show_alert({
								message:__('Vacation Approved'),
								indicator:'green'
							}, 5);
						}
					});
				})
				$(`#reject-${value.name}`).on('click', ()=>{
					frappe.call({
						method: "batic.consumer.page.vacation_page.vacation_page.update_doc", //dotted path to server method
						args: {updatedStatus: "Rejected",
							docName: `${value.name}`
						},
						async: false,
						callback: function(r) {
							$(`#request-${value.name}`).remove();
							remaining_requests = $(".total_requests").find(`.data`)
							$("#requests_text")[0].innerHTML = `${remaining_requests.length} Vacation Requests`
							frappe.show_alert({
								message:__('Vacation Rejected'),
								indicator:'red'
							}, 5);
						}
					});
				})
			})
		}
		let total_requests = function(){
			frappe.call({
				method: "batic.consumer.page.vacation_page.vacation_page.vacation_data", //dotted path to server method
				args: context,
				callback: function(r) {
					console.log(r.message)
					context['vacations'] = r.message['output']
					context['holidays'] = r.message['holidays']
					context['current_vacations'] = r.message['current_vacations']
					context['employee_vacation'] = r.message['employee_vacation']
					if (context['employee_vacation'].length == 0){
						context['employee_vacation'].push({msg: "none", total_days: 100})
						context['employee_vacation'] = context['employee_vacation'][0]
					}
					else{
						context['employee_vacation'] = context['employee_vacation'][0]
						if (context['employee_vacation'].status == "Waiting"){
							context['employee_vacation']["total_days"] = 100
							context['employee_vacation']["waiting"] = true
						}
						else{
							let date_1 = new Date();
							let start_date = new Date(context['employee_vacation'].start_date.replaceAll("-", "/"))
							let end_date = new Date(context['employee_vacation'].end_date.replaceAll("-", "/"))
							let total_vacation_date = end_date.getTime() - start_date.getTime();
							let difference = null
							if (start_date > date_1){
								difference = start_date.getTime() - date_1.getTime();
								context['employee_vacation']["days_msg"] = "Days left to Start"
								let total_days = Math.ceil(difference / (1000 * 3600 * 24));
								context['employee_vacation']["total_days"] = total_days
								context['employee_vacation']["percentage"] = 0
							}
							else{
								difference = end_date.getTime() - date_1.getTime();
								context['employee_vacation']["days_msg"] = "Days left"
								let remaining = Math.ceil(difference / (1000 * 3600 * 24));
								let total_days = Math.ceil(total_vacation_date / (1000 * 3600 * 24));
								context['employee_vacation']["percentage"] = Math.round(remaining/total_days, 1)
								context['employee_vacation']["total_days"] = remaining
							}
						}
					}
				},
				async: false
			});

		}
		
		console.log(context)
		total_requests();
		$(frappe.render_template('vacation_head', context)).appendTo(this.page.main)
		console.log(context)
		setup_functions()

	}

})

let body=`
<div class="container-fluid">
	
	<h4 id="requests_text" style="Padding-bottom: 2%">Total requests right now</h4>
	<div class="container total_requests mw-100" style="max-width: 100%">
		
	</div>
</div>
`
