
frappe.pages['orders'].on_page_load = function(wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper){
			this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'orders',
			custom_page: true
		});
		let context = {};
		let datatable;
		let dataStore;
		let tableData ;
		frappe.call({
			method: "batic.l_management.page.orders.orders.orders_data",
			args: {},
			callback: function(r) {
				dataStore = r.message;
				context['total_orders'] = dataStore[0]
				context['on_processing'] = dataStore[1]
				context['need_review'] = dataStore[2]
				context['completed'] = dataStore[3]
				tableData = dataStore[4]
			},
			async: false
		});

		for(let i=0;i<tableData.length;i++)
			for(let j=0;j<tableData[i].length;j++)
				if(tableData[i][j] == null)
					tableData[i][j] = "No Data"

		var orderTableData = [];
		tableData.forEach(item => {
			const stringData = timeSheet(item)
			orderTableData.push(stringData)
		})
		orderTableData = orderTableData.join(" ")

		context['orderTableData'] = orderTableData
		
		// function timeSheet(item){
		// 	return	`<tr style="font-weight:bold;">
		// 				<td><a href="employee/${item[0]}">${item[0]}</a></td>
		// 				<td>${item[1]}</td>
		// 				<td>${item[2]}</td>
		// 				<td><a href="case-page-extend?case=${item[3]}">${item[3]}</a></td>
		// 				<td><a href="case-task/${item[4]}">${item[4]}</a></td>
		// 			</tr>`
		// }
		function timeSheet(item) {
			return `<div class="invoiceList">
						<p>${item[0]}</p>
						<p>${item[1]}</p>
						<p>${item[2]}</p>
						<p>${item[3]}</p>
						<p>${item[4]}</p>
						</br>
					</div>`
		}

		this.make(context);
		$("#createOrder").on("click", ()=> {
			location.href = "/app/client-orders/new-client-orders-1";
		})
		$("#allOrderlist").on("click", ()=> {
			location.href = "/app/client-orders";
		})
		
		// for(let i=0;i<5;i++)
		// 	for(let j=0; j<5;j++)
		// 		if(!tableData[i][j])
		// 			tableData[i][j] = "No Data"
			
		// datatable = new frappe.DataTable('#orderTable', { 
		// 	columns: [
		// 		"Name", "Client", "Contract", "Consultation", "Status"
		// 	],
		// 	width: "50%",
		// 	data: tableData,
		// 	layout: "fluid",
		// 	options: {
		// 		scrollX: true,
		// 		scrollY: true,
		// 		autoWidth: true,
		// 		responsive: true
		// 	  }

		//   });
		//   console.log(tableData);
		// setTimeout(()=>{
		// 	heads = datatable.options.columns
		// 	$table = $(document).find(".dt-scrollable")
		// 	console.log($table);
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
		
		
		
	},
	make: function(context){
		$(frappe.render_template('orders', context)).appendTo(this.page.main)
	}
});
