
frappe.pages['case-page'].on_page_load = function(wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper){
			this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Cases',
			custom_page: true
		});
		this.make();
		$("#casesButton").click(() => {
			frappe.route_options = {}
			frappe.set_route(`/app/case/new-case-1`);
		});	
		$("#total_cases_card").click(() => {
			//frappe.set_route(`/app/case`);
			frappe.set_route("/app/case")
		});
		$("#active_cases_card").click(() => {
			// frappe.route_options = {
			// 	'status': 'Pending'
			// }
			// frappe.set_route(`/app/case`);
			frappe.route_options = {"case_status_workflow": "Processing"};
			frappe.set_route("List", "Case");
		});
		$("#appealed_cases_card").click(() => {
			// frappe.route_options = {
			// 	'status': 'Draft'
			// }
			// frappe.set_route(`/app/case`);
			frappe.route_options = {"case_status_workflow": "Draft"};
			frappe.set_route("List", "Case");
		});
		$("#finished_cases_card").click(() => {
			// frappe.route_options = {
			// 	'status': ['in', ['Approved', 'Rejected', 'Cancelled']]
			// }
			// frappe.set_route(`/app/case`);

			frappe.route_options = {
				'case_status_workflow': ['in', ['Won','Lost','Cancel']]
			};
			frappe.set_route("List", "Case");
		});
		$("#cases_won_card").click(() => {
			// frappe.route_options = {
			// 	'status': 'Approved'
			// }
			// frappe.set_route(`/app/case`);
			// frappe.set_route("List", "Case", {"filters": [["case_status_workflow", "=", "Won"]]});
			frappe.route_options = {"case_status_workflow": "Won"};
			frappe.set_route("List", "Case");
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
		let caseDataTable;
		let context= {};
		let caseDataTableJinja=[];
		let total_cases = function(){
			frappe.call({
				method: "batic.cases.page.case_page.case_page.total_cases", //dotted path to server method
				callback: function(r) {
					$("#total_cases")[0].innerText = r.message;
				}
			});
		}
		let active_cases = function(){
			frappe.call({
				method: "batic.cases.page.case_page.case_page.active_cases", //dotted path to server method
				callback: function(r) {
					$("#active_cases")[0].innerText = r.message;
				}
			});
		}
		let appealed_cases = function(){
			frappe.call({
				method: "batic.cases.page.case_page.case_page.appealed_cases", //dotted path to server method
				callback: function(r) {
					$("#appealed_cases")[0].innerText = r.message;
				}
			});
		}
		let finished_cases = function(){
			frappe.call({
				method: "batic.cases.page.case_page.case_page.finished_cases", //dotted path to server method
				callback: function(r) {
					$("#finished_cases")[0].innerText = r.message;
				}
			});
		}
		let cases_won = function(){
			frappe.call({
				method: "batic.cases.page.case_page.case_page.cases_won", //dotted path to server method
				callback: function(r) {
					$("#cases_won")[0].innerText = r.message;
				}
			});
		}

		function makeQuery(){
			recent_cases_query = "SELECT client, name, case_title, start_date, case_status_workflow FROM `tabCase` ORDER BY modified DESC"
			frappe.call({
				method: "batic.cases.page.overview.overview.query_database", //dotted path to server method
				args: {query: recent_cases_query},
				callback: function(r) {
					caseDataTable = r.message.reply
					caseDataTemplate()
				},
				async: false
			});
		}

		function caseDataTemplate() {

			// for(let i=0;caseDataTable.length;i++){
			// 	const stringData =  timeSheet(item)
			// 	$(".invoiceContainer")[i+1].innerHtml = stringData
			// }

			caseDataTable.forEach(item => {
				const stringData =  timeSheet(item)
				caseDataTableJinja.push(stringData)

			})
			caseDataTableJinja = caseDataTableJinja.join(" ")
		}
		
		function timeSheet(item) {
			return `<div class="invoiceList">
						<p>${item[0]}</p>
						<p><a href="case-page-extend/${item[1]}">${item[1]}</a></p>
						<p>${item[2]}</p>
						<p>${item[3]}</p>
						<p>${item[4]}</p>
					</div>`
		}
		// function makeQuery(){
		// 	recent_cases_query = "SELECT client, name, case_title, start_date, case_status_workflow FROM `tabCase` ORDER BY modified DESC"
			
		// 	frappe.call({
		// 		method: "batic.cases.page.overview.overview.query_database", //dotted path to server method
		// 		args: {query: recent_cases_query},
		// 		callback: function(r) {
		// 			$("#queryResult")[0].innerText = JSON.stringify(r.message.reply)
		// 			console.log("JS", r.message.reply);	
		// 			makeTable(r.message.reply)
		// 			console.log(r.message["reply"])
		// 		},
		// 	});
		// }
		
		// function makeTable(queryData){
		// 	console.log("QU", queryData);
		// 	datatable = new DataTable('#queryResult', {
		// 		columns: ['Client', 'Case Number', 'Case Title', 'Beginning Date', 'Status'],
		// 		data: queryData,
		// 		layout: "fluid",
				
		// 	});
			
		// }
		// setTimeout(()=>{
		// 	heads = datatable.options.columns
			
		// 	$table = $(document).find(".dt-scrollable")
		// 	allRows = $table.find("div.dt-row")
		// 	$table.on("click", "div.dt-row", (e) => {		
		// 		let $row = $(e.currentTarget);
		// 		// let tableTop = $table.find("div.dt-row-header")
				
		// 		heads.unshift("")
		// 		let cells = $row.find(".dt-cell")
		// 		console.log(cells)
		// 		let values = Object.entries(cells).flatMap((value, _)=>{
		// 			return value[1].innerText != undefined ? value[1].innerText : []
		// 		})
		// 		// let values = String($row.outerText).split("\n")
		// 		console.log(heads)
		// 		console.log("This are" + values[0],values[1],values[2])
		// 		location.href=`case-page-extend?case=${values[2]}`
				
		// 	})
		// }, 100)
		makeQuery();
		context["caseDataTableJinja"] = caseDataTableJinja
		$(frappe.render_template("case_page", context)).appendTo(this.page.main)
		total_cases();
		active_cases();
		appealed_cases();
		finished_cases();
		cases_won();
	}

})

