
frappe.pages['dashboard-head'].on_page_load = function(wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper){
			this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Dashboard',
			custom_page: true
		});
		this.make();
		
	},


	make: function(){
		let me = $(this);
		
		let user = "Administrator"
		let context = {}
		console.log(frappe.session.user_fullname)
		if(frappe.session.user_fullname.includes("HTLawyer")){
			context["employee"] = frappe.session.user_fullname
			context["user"] = "Head Team Lawyer"
		}
		else if(!frappe.session.user_fullname.includes("Admin")){
			context["employee"] = frappe.session.user_fullname
			context["user"] = "Employee"
		}
		console.log(context)
		let activity_chart = () =>{
			let chart = new frappe.Chart( "#frost-chart", { // or DOM element
				data: {
					labels: ["12am-3am", "3am-6am", "6am-9am", "9am-12pm",
						"12pm-3pm", "3pm-6pm", "6pm-9pm", "9pm-12am"],
				
					datasets: [
						{
							name: "Yet Another", chartType: 'line',
							values: [15, 20, 35, 25, 58, 12, 1, 37]
						}
					],
				
					yMarkers: [{ label: "Marker", value: 70,
						options: { labelPos: 'left' }}],
					yRegions: [{ label: "Region", start: -10, end: 50,
						options: { labelPos: 'right' }}]
					},
				title: "Cases Data",
				type: 'axis-mixed',
				lineOptions: {
					dotSize: 8, // default: 4,
					regionFill: 1
				},
				height: 300,
				colors: ['lightblue', "blue"],
				axisOptions: {
					xAxisMode: "tick",
					xIsSeries: true
				  },
				  barOptions: {
					spaceRatio: 0.5
				  },
				  tooltipOptions: {
					formatTooltipX: (d) => (d + "").toUpperCase(),
					formatTooltipY: (d) => d + " cases"
				  }
			  });	
			  if (context["user"] == "Head Team Lawyer"){
				console.log(context["all_data"])
				const employeeTaskObj = {};

				context["all_data"].forEach(item => {
				if (employeeTaskObj[item.employee] !== undefined) {
					employeeTaskObj[item.employee]++;
				} else {
					employeeTaskObj[item.employee] = 1;
				}
				});

				const resultArray = Object.entries(employeeTaskObj).map(pair => ([
				pair[0], "None", pair[1], pair[1]*10
				]));
				console.log(resultArray)
				datatable = new DataTable('#queryResult', {
					columns: [
						{
							name: 'Employee',
							width: 250
						},
						{
							name: 'Work On',
							width: 250
						},
						{
							name: 'Tasks',
							width: 250
						},
						{
							name: 'Points',
							width: 200
						}, 
					],
					data: resultArray,
					layout: "fixed",
					clusterize: false
				});				
			  }
		}
		let dashboard_data = function(){
			frappe.call({
				method: "batic.l_management.page.dashboard_head.dashboard_head.get_dashboard_data", //dotted path to server method
				args: context,
				callback: function(r) {
					console.log(r.message)
					context['cases'] = r.message.employee_cases
					context['tasks'] = r.message.employee_tasks
					if(r.message.all_data){
						context['all_data'] = r.message.all_data
					}
				},
				async: false
			});
		}
		let setup_functions = function(){
			document.querySelectorAll(".carousel").forEach((carousel) => {
				const items = carousel.querySelectorAll(".carousel__case");
				const buttonsHtml = Array.from(items, () => {
				  return `<span class="carousel__button"></span>`;
				});
			  
				carousel.insertAdjacentHTML(
				  "beforeend",
				  `
					  <div class="carousel__nav">
						  ${buttonsHtml.join("")}
					  </div>
				  `
				);
			  
				const buttons = carousel.querySelectorAll(".carousel__button");
			  
				buttons.forEach((button, i) => {
				  button.addEventListener("click", () => {
					// un-select all the items
					items.forEach((item) =>
					  item.classList.remove("carousel__item--selected")
					);
					buttons.forEach((button) =>
					  button.classList.remove("carousel__button--selected")
					);
			  
					items[i].classList.add("carousel__item--selected");
					button.classList.add("carousel__button--selected");
				  });
				});
			  
				// Select the first item on page load
				items[0].classList.add("carousel__item--selected");
				buttons[0].classList.add("carousel__button--selected");
			  });
			  document.querySelectorAll(".carousel-2").forEach((carousel) => {
				const items = carousel.querySelectorAll(".carousel__task");
				const buttonsHtml = Array.from(items, () => {
				  return `<span class="carousel__button __task"></span>`;
				});
			  
				carousel.insertAdjacentHTML(
				  "beforeend",
				  `
					  <div class="carousel__nav">
						  ${buttonsHtml.join("")}
					  </div>
				  `
				);
			  
				const buttons = carousel.querySelectorAll(".carousel__button.__task");
				buttons.forEach((button, i) => {
				  button.addEventListener("click", () => {
					// un-select all the items
					items.forEach((item) =>
					  item.classList.remove("carousel__item--selected")
					);
					buttons.forEach((button) =>
					  button.classList.remove("carousel__button--selected")
					);
			  
					items[i].classList.add("carousel__item--selected");
					button.classList.add("carousel__button--selected");
				  });
				});
			  
				// Select the first item on page load
				items[0].classList.add("carousel__item--selected");
				buttons[0].classList.add("carousel__button--selected");
			  });
				  
		}
		dashboard_data()
		$(frappe.render_template("dashboard_head", context)).appendTo(this.page.main)
		setup_functions()
		activity_chart()

	}

})
