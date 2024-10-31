
frappe.pages['case-page-extend'].on_page_load = function(wrapper) {
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
		var caseNumber
		if(frappe.get_route()[1]){
			caseNumber = frappe.route_history_queue[0].route
			caseNumber = caseNumber.split('case-page-extend/')[1]
			console.log("number",caseNumber);
	   }
		window.onpopstate = function(event) {
			window.location.href = document.referrer
		};
		if(!window.location.href.includes(frappe.route_history_queue[0].route)){
			caseNumber = caseNumber.split('case-page-extend/')[1]
			caseNumber = caseNumber.split('-')[1]
			window.location.href = `${window.location.href}/${caseNumber}`;
		}
		
		// console.log(window.history);

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
						fieldtype: 'Float',
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
					values.case = caseNumber
					console.log(values);
					frappe.call({
						method: "batic.cases.page.case_page_extend.case_page_extend.invoice_Add",
						args: {values},
						callback: function(r) {
							console.log("dd",r.message);
							location.reload()
						},
						async: false
					});
					d.hide();
				}
			});
			
			d.show();
		})
		
		
	},

	make: function(){
		console.log(frappe);
		let me = $(this);

		let finalData 
		let caseTaskData = []
		let evidenceData
		let contractDetails
		let caseWorkList
		let finalEvidenceData = []
		let total_spend_times_case
		let total_spend_times_in_seconds
		var caseDataInfo;
		let paidAmount;
		let invoiceList;
		let caseNumber;
		if(frappe.get_route()[1]){
			caseNumber = frappe.route_history_queue[0].route
			caseNumber = caseNumber.split('case-page-extend/')[1]
			console.log("number",caseNumber);
	   }
		let data = frappe.route_options.case
		if(caseNumber){
			data = caseNumber
		}
		data = data.split('-')[1]

		console.log("DataRoute",data);
		let context = {}
		frappe.call({
			method: "batic.cases.page.case_page_extend.case_page_extend.case_data",
			args: {case_data: data},
			callback: function(r) {
				context['data'] = r.message[0][0]
				caseDataInfo = r.message[0][0]
				finalData = r.message[1]
				evidenceData = r.message[2]
				contractDetails = r.message[3]
				caseWorkList = r.message[4]
				total_spend_times_case = r.message[5]
				context['total_attempt_case'] = r.message[6]
				context['total_unique_emp_worked'] = r.message[7]
				total_spend_times_in_seconds = r.message[8]
				paidAmount = r.message[9][0]
				invoiceList = r.message[9][1]
				console.log("from",r.message);
			},
			async: false
		});
		for(let i=0;i<finalData.length;i++){
			caseTaskData[i] = finalData[i][1]
		}
		for(let i=0;i<evidenceData.length;i++){
			finalEvidenceData[i] = evidenceData[i][1]
		}
		

		var allCaseTaskTamplate = [];
		var caseWorkListTamplate = []
		var allInvoiceTamplate = []
		caseTaskData.forEach(task =>{ 
			const stringData = caseTaskTamplate(task)
			allCaseTaskTamplate.push(stringData);
		
		})
		allCaseTaskTamplate = allCaseTaskTamplate.join(" ")


		for(let i=0;i<caseWorkList.length;i++){
			for(let j=0;j<caseWorkList[i].length;j++){
				if(caseWorkList[i][j] == null){
					caseWorkList[i][j] = "No Data"
				}
				else if(caseWorkList[i][j] == ""){
					caseWorkList[i][j] = "Pending"	
				}
				if((j==1) && caseWorkList[i][j] != "Pending"){
					let data = caseWorkList[i][j].split(" ")[0]
					caseWorkList[i][j] = data
				}
			}
		}

		caseWorkList.forEach(task => {
			const stringData = timeSheet(task)
			caseWorkListTamplate.push(stringData);
		})
		caseWorkListTamplate = caseWorkListTamplate.join(" ")

		invoiceList.forEach(invoice => {
			const stringData = invoiceTamplate(invoice)
			allInvoiceTamplate.push(stringData)
		})
		allInvoiceTamplate = allInvoiceTamplate.join(" ")


		function timeSheet(item){
			return	`<div class="invoiceList">
						<p><a href="work-records/${item.user}" target=_blank>${item.user}</a></p>
						<p>${item.creation}</p>
						<p>${item.task}</p>
						<p>${item.spend_session_time}</p>
					</div>`

		}

		function caseTaskTamplate(task) {
			return `<div class="row">
						<div class="col-sm-2">
							<div class="timeline-item mb-5">${task.task_name}</div>
						</div>
						<div class="col-sm-2"><div>${task.team}</div></div>
						<div class="col-sm-2"><div>${task.task_priority}</div></div>
						<div class="col-sm-4"><div>${task.task_start_on} </div></div>
						<div class="col-sm-2"><div>${task.case_task_workflow_state} </div></div>
					</div>`
		}

		function invoiceTamplate(invoice) {
			return `<div class="invoiceList">
						<p>${invoice[0]}</p>
						<p>${invoice[1]}</p>
						<p>${invoice[2]}</p>
						<p>${invoice[3]}</p>
						<p><a href="${invoice[4]}" target="_blank"><img src="/files/2606506_5845.jpg" width="30px" class="imghandle" alt="Recipt"/></a></p>
					</div>`
		}

		context['title'] = data
		context['caseTask'] = caseTaskData
		context['evidence'] = finalEvidenceData
		context['contractDetails'] = contractDetails
		context['total_spend_times_case'] = total_spend_times_case
		context['caseWorkListTamplate'] = caseWorkListTamplate
		context['caseTaskTamplate'] = allCaseTaskTamplate;
		context['invoiceTamplate'] = allInvoiceTamplate
		context['evidenceLen'] = context['evidence'].length
		context['caseTaskLen'] = context['caseTask'].length
		context['invoiceList'] = invoiceList
		context['hiddenValueForWorkTime'] = ""
		context['hiddenValueForInvoice'] = ""

		if(caseWorkList.length == 0){
			context['hiddenValueForWorkTime'] = "hidden"
		}
		if(invoiceList.length==0){
			context['hiddenValueForInvoice'] = "hidden"
		}
		console.log("Context", context);
		






		

		var total_bill = 0.0
		
		if(contractDetails.calculation_type == "Flat Fee"){
			// Flat Fee calculation
			if(caseDataInfo.case_status_workflow == "Cancel") {
				total_bill = 0.0
			}else if(caseDataInfo.case_status_workflow == "Won" || caseDataInfo.case_status_workflow == "Lost"){
				console.log(new Date(Date.parse(caseDataInfo.modified)));
				let createDate = new Date(Date.parse(contractDetails.creation))
				let lastActiveDate = new Date(Date.parse(caseDataInfo.modified))
				var timeDiff = Math.abs(lastActiveDate.getTime() - createDate.getTime());
				var dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
				if(contractDetails.contract_type == "Monthly"){
					total_bill = (Math.floor(dayDiff/30)+1)* contractDetails.fee
				}else if(contractDetails.contract_type == "Yearly"){
					total_bill = (Math.floor(dayDiff/30)+1)* contractDetails.fee
				}else{
					// On task Condition
					total_bill = contractDetails.fee
				}
			}else {
				let createDate = new Date(Date.parse(contractDetails.creation))
				let presentDate = new Date()
				var timeDiff = Math.abs(presentDate.getTime() - createDate.getTime());
				var dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
				if(contractDetails.contract_type == "Monthly"){
					total_bill = (Math.floor(dayDiff/30)+1)* contractDetails.fee
				}else if(contractDetails.contract_type == "Yearly"){
					total_bill = (Math.floor(dayDiff/30)+1)* contractDetails.fee
				}else {
					// On task Condition
					total_bill = contractDetails.fee
				}
			}
			
		}else{
			// Per Hour Calculation
			let perSecond = (contractDetails.fee / 60) / 60 
			total_bill = total_spend_times_in_seconds* perSecond
		}

		context['total_bill'] = total_bill.toFixed(2);
		context['paidAmount'] = paidAmount.toFixed(2)
		context['Need_to_be_Paid'] =(Math.abs(context['total_bill'] - context['paidAmount'])).toFixed(2)

		$(frappe.render_template('case_page_extend', context)).appendTo(this.page.main)

	}

})



