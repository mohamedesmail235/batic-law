
frappe.pages['vacation-page'].on_page_load = function(wrapper) {
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
		$("#casesButton").click(() => {
			frappe.route_options = {}
			frappe.set_route(`/app/case-doctype/new-case-doctype-1`);
		});	
	},


	make: function(){
		let me = $(this);
		let isAllowed = false
		let context = {}
		let setup_functions = function(){
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
				callback: function(r) {
					console.log(r.message)
					context['vacations'] = r.message['output']
					context['holidays'] = r.message['holidays']
					context['current_vacations'] = r.message['current_vacations']
					$("#loading-page").remove()
				},
				async: false
			});
		}
		
		$(`<h1 id="loading-page">Loading....</h1>`).appendTo(this.page.main)
		total_requests();
		$(frappe.render_template('vacation_page', context)).appendTo(this.page.main)
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
