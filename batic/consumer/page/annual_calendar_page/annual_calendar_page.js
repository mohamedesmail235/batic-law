
frappe.pages['annual-calendar-page'].on_page_load = function(wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper){
			this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: '',
			custom_page: true
		});
		this.make();
	},


	make: function(){
		let me = $(this);
		$("head").append(`<link type="text/css" rel="stylesheet" href="/assets/frappe/node_modules/frappe-gantt/dist/frappe-gantt.css">`)
		$("head").append(`<script src="/assets/frappe/node_modules/frappe-gantt/dist/frappe-gantt.min.js"></script>`)
		let tasks = [
			{
				id: 'Task 1',
				name: 'Buy hosting',
				start: '2022-01-22',
				end: '2022-01-23',
				progress: 100,
			},
			{
				id: 'Task 2',
				name: 'Draw wireframes',
				start: '2022-01-23',
				end: '2022-01-25',
				progress: 100,
			},
			{
				id: 'Task 3',
				name: 'Visual Design',
				start: '2022-01-25',
				end: '2022-01-27',
				progress: 20,
				dependencies: 'Task 2'
			},
			{
				id: 'Task 4',
				name: 'Build frontend',
				start: '2022-02-01',
				end: '2022-02-03',
				progress: 0,
				dependencies: 'Task 3'
			},
			{
				id: 'Task 5',
				name: 'Build backend',
				start: '2022-02-03',
				end: '2022-02-07',
				progress: 0,
			},
			{
				id: 'Task 6',
				name: 'Deploy Website',
				start: '2022-02-07',
				end: '2022-02-09',
				progress: 0,
				dependencies: 'Task 4, Task 5'
			},
		]
		let vacations = []
		let vacation_fill = function(){
			frappe.call({
				method: "batic.consumer.page.annual_calendar_page.annual_calendar_page.vacation_data", //dotted path to server method
				callback: function(r) {
					current_vacations = r.message['current_vacations']
					console.log(current_vacations)
					current_vacations.forEach((vacation) => {
						taskName = vacation.full_name
						if (vacation.description != undefined){
							taskName += " - " + vacation.description
						}
						vacations.push({
							name:  taskName,
							start: vacation.start_date,
							end: vacation.end_date,
							progress: (vacation.days - vacation.left_days)
						})
					})
				},
				async: false
			});
		}
		$("body").append(`<link type="text/html" href="dist/frappe-gantt.css" >`)
		$("body").append(`<script src="dist/frappe-gantt.js"></script>`)
		console.log(Gantt)
		$(frappe.render_template("annual_calendar_page", this)).appendTo(this.page.main)
		vacation_fill()
		if (vacations.length != 0){
			let gantt = new Gantt("#gantt-chart", vacations, {view_mode: "Month"});
		}
		else{
			let mainDiv = $("#gantt-chart").parent()
			mainDiv.append(`<p class="text-center" style="font-size: 20px">No Vacations currently<p>`)
			mainDiv.css("margin-top", "0px")
			$("#view_mode").addClass("hidden")
		}
		$("#view_mode").on('click', ()=>{
			let text = $("#view_mode").text().split(":")[1].trim()
			if (text == "Day"){
				gantt.change_view_mode('Week')
				$("#view_mode").text("View Mode: Week")
			}
			else if (text == "Week"){
				gantt.change_view_mode('Month')
				$("#view_mode").text("View Mode: Month")
			}
			else if (text == "Month"){
				gantt.change_view_mode('Year')
				$("#view_mode").text("View Mode: Year")
			}
			else if (text == "Year"){
				gantt.change_view_mode('Day')
				$("#view_mode").text("View Mode: Day")
			}
		})
	}

})

