
frappe.pages['request-page'].on_page_load = function(wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper){
			this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Requests',
			custom_page: true
		});
		this.make();
		$("#casesButton").click(() => {
			frappe.route_options = {}
			frappe.set_route(`/app/case-doctype/new-case-doctype-1`);
		});	
	},

	parseObject: function(value){
		let parseToObject=function(value){
			output = value.reduce((r, o) => {
				Object.entries(o).forEach(([k, v]) => {
					if (k in r) {
						r[k][1].push(v);
					} else {
						r[k] = ["in", []];
						r[k][1].push(v)
					}
				});
				return r;
			}, {});
			console.log(output)
			return output;
		} 
		return parseToObject(value);
	},

	make: function(){
		let me = $(this);
		let isAllowed = false
		let total_requests = function(){
			frappe.call({
				method: "batic.cases.page.request_page.request_page.employee_data", //dotted path to server method
				callback: function(r) {
					isAllowed = r.message["user"]
					$("#requests_text")[0].innerHTML = `${r.message["data"].length} New Requests...`
					r.message["data"].forEach((requestData)=>{
						console.log(requestData.document)
						let card = `
						<div class="request-div row mt-3" id="request-${requestData.name}">
							<div class="col-12">
								<div class="card border border-dark">
									<div class="card-body">
										<div class="row">
											<div class="col-10">
												<div class="row">
													<div class="col-3 bold">Customer</div>
													<div class="col-2 bold">Case Number</div>
													<div class="col-3 bold">Beginning of the Claim</div>
													<div class="col-2 bold">Claim Stage</div>
													<div class="col-2 bold">Case File</div>
												</div>
												<div class="row pt-2">
													<div class="col-3">${requestData.client}</div>
													<div class="col-2">${requestData.name}</div>
													<div class="col-3">${requestData.start_date}</div>
													<div class="col-2">${requestData.created == null ? "N/A" : requestData.created}</div>
													<div class="col-2">${requestData.document == null ? "N/A": `<a href="${requestData.document}" class="stretched-link text-danger" style="position: relative;  height: 18px; width: 140px; padding: 0; overflow: hidden; position: relative; color: #000;">file attached</a>`}</div>
												</div>
												
												<div class="row pt-3">
													<div class="col-12 bold">Claim Description</div>
												</div>
												<div class="row">
												 	<div class="col-12">${requestData.description}</div>
												</div>
											</div>
						`
						if(isAllowed){
							card+= `<div class="col-2 text-right">
							<div class="row text-center">
								<div class="col-12 bold small"">Action</div>
							</div>
							<div class="row pt-3">
								<div class="col-6 bold px-0"><button type="button" id="accept-${requestData.name}" class="btn btn-primary btn-md  py-2">Accept</button>
								</div>
								<div class="col-6 bold px-0"><button type="button" id="reject-${requestData.name}"class="btn btn-secondary btn-md  py-2">Cancel</button>
								</div>
							</div>
						</div>`
						}
						card+= `</div>
								</div>
						</div>
						</div>
						</div>`
						$(".total_requests").append(`${card}`)
						
						$(`#accept-${requestData.name}`).click(()=>{

							frappe.call({
								method: "batic.cases.page.request_page.request_page.update_doc", //dotted path to server method
								args: {updatedStatus: "Processing",
									docName: `${requestData.name}`
								},
								callback: function(r) {
									$(`#request-${requestData.name}`).remove();
									remaining_requests =$(".total_requests").find(".row.mt-3")
									$("#requests_text")[0].innerHTML = `${remaining_requests.length} New Requests...`
									frappe.show_alert({
										message:__('Request Approved'),
										indicator:'green'
									}, 5);
								}
							});
							
						})
						$(`#reject-${requestData.name}`).click(()=>{

							frappe.call({
								method: "batic.cases.page.request_page.request_page.update_doc", //dotted path to server method
								args: {updatedStatus: "Cancel",
									docName: `${requestData.name}`
								},
								callback: function(r) {
									$(`#request-${requestData.name}`).remove();
									remaining_requests =$(".total_requests").find(".row.mt-3")
									$("#requests_text")[0].innerHTML = `${remaining_requests.length} New Requests...`
									frappe.show_alert({
										message:__('Request Rejected'),
										indicator:'red'
									}, 5);
								}
							});
						})
					})
				}
			});
		}
		$(frappe.render_template(frappe.cases_page_dashboard.body, this)).appendTo(this.page.main)

		total_requests();

	}

})

let body=`
<div class="container-fluid">
	
	<h4 id="requests_text" style="Padding-bottom: 2%">Total requests right now</h4>
	<div class="container total_requests mw-100" style="max-width: 100%">
		
	</div>
</div>

<style>
  .card {
    position: relative;
    padding-left: 25px;
	padding-top: 10px;
	padding-bottom: 10px;
	border: none;
	cursor: pointer;
}
h5{
	color: #fff;
	text-shadow: 0px 0px 1px #000;
}
.heading{
	text-align: center; 
	font-size: 16px;
}
.output_data{
	text-align: center; 
	font-weight: bold; 
	font-size: 1.2em;
}
.dark-mode .datatable {
	--dt-border-color: #424242;
	--dt-light-bg: #2e3538;
	--dt-text-color: #dfe2e5;
	--dt-text-light: #dfe2e5;
	--dt-cell-bg: #1c1f20;
	--dt-focus-border-width: 1px;
	--dt-selection-highlight-color: var(--dt-light-bg);
	--dt-toast-message-border: 1px solid var(--dt-border-color);
	--dt-header-cell-bg: #262c2e;
}
</style>`

frappe.cases_page_dashboard = {
	body: body
}
