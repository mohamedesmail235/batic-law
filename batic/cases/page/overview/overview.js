
frappe.pages['overview'].on_page_load = function (wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function (wrapper) {
		this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Dashboard',
			custom_page: true
		});
		// if (frappe.session.user != "Administrator"){
		// 	this.notFound()
		// 	return
		// }
		// if(!frappe.session.user_fullname.includes("Admin")){
		// 	location.href = "/app/dashboard-head"
		// }
		this.make();
		$("#casesButton").click(() => {
			frappe.route_options = {}
			frappe.set_route(`/app/case`);
		});
		$("#total_clients_card").click(() => {
			frappe.route_options = {}
			frappe.set_route(`/app/case`);
		});
		$("#satisfied_clients_card").click(() => {
			let value = $("#satisfied_clients")[0].getAttribute("data-items");
			var obj = JSON.parse(value);
			obj = this.parseObject(obj)
			frappe.route_options = obj;
			frappe.set_route(`/app/client`);
		});
		$("#successfull_cases_card").click(() => {

			frappe.route_options = {
				status: `Approved`
			}
			frappe.set_route(`/app/case`);
		});
		$("#total_requests_card").click(() => {

			frappe.route_options = {
				status: `Draft`
			}
			frappe.set_route(`/app/case`);
		});

		$("#new_clients_card").click(() => {

			let value = $("#new_clients")[0].getAttribute("data-items");

			var obj = JSON.parse(value);
			obj = this.parseObject(obj)
			frappe.route_options = obj;
			frappe.set_route(`/app/client`);
		});
	},

	parseObject: function (value) {
		let parseToObject = function (value) {
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
	// notFound: function(){
	// 	$(frappe.render_template("overview", {frappe:frappe})).appendTo(this.page.main)
	// },
	make: function () {
		let me = $(this);
		let context = {};
		let clientDataTable;
		let clientDataTableTemplate = [];
		const compareArrays = (arr1, arr2) => {
			const result = {};

			//loop through first array, add each string as a key and set value to 0
			arr1.forEach(str => {
				result[str] = 0;
			});

			//loop through second array, if string is already in object, add 1, else set value to 0
			arr2.forEach(str => {
				if (result[str] !== undefined) {
					result[str] += 1;
				} else {
					result[str] = 1;
				}
			});

			return result;
		};
		let status_chart = function () {

			frappe.call({
				method: "batic.cases.page.overview.overview.status_chart_2", //dotted path to server method
				callback: function (r) {
					let status = []
					let values = []
					let dataset = []
					let caseTimes = r.message[0].map(val => val[0].split(" ")[0]);
					let output = compareArrays(r.message[1], caseTimes)
					console.log("W", output)

					console.log(dataset)

					let chart = new frappe.Chart("#frost-chart", { // or DOM element
						data: {
							labels: Object.keys(output),
							datasets: [
								{
									values: Object.values(output),
									chartType: 'line',
								},
							],
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

				}
			});
		}
		let total_clients = function () {
			frappe.call({
				method: "batic.cases.page.overview.overview.total_clients", //dotted path to server method
				callback: function (r) {
					$("#total_clients")[0].innerText = r.message;
				}
			});
		}


		let satisfied_clients = function () {
			frappe.call({
				method: "batic.cases.page.overview.overview.satisfied_clients", //dotted path to server method
				callback: function (r) {
					$("#satisfied_clients")[0].innerText = r.message.length;
					$("#satisfied_clients")[0].setAttribute("data-items", JSON.stringify(r.message))
				}
			});
		}

		let successfull_cases = function () {
			frappe.call({
				method: "batic.cases.page.overview.overview.successfull_cases", //dotted path to server method
				callback: function (r) {
					$("#successfull_cases")[0].innerText = r.message;
				}
			});
		}


		let total_requests = function () {
			frappe.call({
				method: "batic.cases.page.overview.overview.get_total_requests", //dotted path to server method
				callback: function (r) {
					$("#total_requests")[0].innerText = r.message;
				}
			});
		}


		let new_clients = function () {
			frappe.call({
				method: "batic.cases.page.overview.overview.new_clients", //dotted path to server method
				callback: function (r) {
					$("#new_clients")[0].innerText = r.message.length;

					$("#new_clients")[0].setAttribute("data-items", JSON.stringify(r.message))
				}
			});
		}

		//inside chartPart status
		let active_cases = function () {
			frappe.call({
				method: "batic.cases.page.case_page.case_page.active_cases", //dotted path to server method
				callback: function (r) {
					$("#active_cases")[0].innerText = r.message;
				}
			});
		}
		let appealed_cases = function () {
			frappe.call({
				method: "batic.cases.page.case_page.case_page.appealed_cases", //dotted path to server method
				callback: function (r) {
					$("#appealed_cases")[0].innerText = r.message;
				}
			});
		}
		let finished_cases = function () {
			frappe.call({
				method: "batic.cases.page.case_page.case_page.finished_cases", //dotted path to server method
				callback: function (r) {
					$("#finished_cases")[0].innerText = r.message;
				}
			});
		}
		let cases_won = function () {
			frappe.call({
				method: "batic.cases.page.case_page.case_page.cases_won", //dotted path to server method
				callback: function (r) {
					$("#cases_won")[0].innerText = r.message;
				}
			});
		}

		let main_chart = function () {
		}

		function makeQuery() {
			recent_cases_query = "SELECT client, name, case_title , start_date, case_status_workflow FROM `tabCase` ORDER BY modified DESC LIMIT 5"

			frappe.call({
				method: "batic.cases.page.overview.overview.query_database", //dotted path to server method
				args: { query: recent_cases_query },
				callback: function (r) {
					//$("#queryResult")[0].innerText = JSON.stringify(r.message.reply)	
					clientDataTable = r.message.reply
					caseDataTemplate()
				},
				async: false
			});
		}
		function caseDataTemplate() {

			clientDataTable.forEach(item => {
				const stringData = timeSheet(item)
				clientDataTableTemplate.push(stringData)

			})
			clientDataTableTemplate = clientDataTableTemplate.join(" ")
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

		// function makeTable(queryData){
		// 	let datatable = new DataTable('#queryResult', {
		// 		columns: ['Client', 'Case Number', 'Case Title', 'Beginning Date', 'Status'],
		// 		data: queryData,
		// 		layout: "fluid",
		// 	});
		// }
		makeQuery();
		context['clientDataTableTemplate'] = clientDataTableTemplate
		if (frappe.session.user.startsWith("Admin")) {
			context['display'] = "hidden"
		} else {
			context['display'] = ""
		}
		context['pauseHidden'] = ""


		$(frappe.render_template("overview", context)).appendTo(this.page.main)

		total_clients();
		satisfied_clients();
		successfull_cases();
		total_requests();
		new_clients();
		main_chart();
		status_chart();
		active_cases();
		appealed_cases();
		finished_cases();
		cases_won();

		context['pauseHidden'] = ""


		const user = frappe.session.user;
		let intervalID = null
		const pauseButton = document.getElementById('pauseButton')
		frappe.call({
			method: "batic.cases.page.overview.overview.CheckLastWorkTimeStillContinue", //dotted path to server method
			args: { user },
			callback: function (r) {
				if (r.message.length == 0) {
					$("#timeTrigger")[0].innerText = "Start";
					$("#clock")[0].innerText = "00:00:00"
					pauseButton.classList.add('hidden')

				} else {
					$("#timeTrigger")[0].innerText = "Stop";
					let start
					//console.log("check", r.message,r.message[0].start_session_time,r.message[0].spend_session_time);
					if (r.message[0].pause_session_time != "") {
						$("#clock")[0].innerText = r.message[0].spend_session_time
						$("#timeTriggerPause")[0].innerText = "Resume"
					} else {

						if (r.message[0].resume_session_time == "") {
							start = r.message[0].start_session_time.split(" ")[1];
							let today = new Date();
							let current = checkTime(today.getHours()) + ":" + checkTime(today.getMinutes()) + ":" + checkTime(today.getSeconds());
							const startTime = Date.parse(`1970-01-01T${start}Z`);
							const currentTime = Date.parse(`1970-01-01T${current}Z`);
							let diffTime
							if (currentTime < startTime) {
								const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
								diffTime = oneDayInMilliseconds - Math.abs(parseInt(currentTime) - parseInt(startTime));
							} else {
								diffTime = (parseInt(currentTime) - parseInt(startTime));
							}
							let runningCounter = millisecondToTime(diffTime)
							console.log("Counter", runningCounter);
							$("#clock")[0].innerText = runningCounter
							countDown(diffTime);
						} else {
							start = r.message[0].resume_session_time.split(" ")[1];
							let spend_time = r.message[0].spend_session_time
							spend_time = spend_time.split(":")
							spend_time[0] = checkTime(spend_time[0])
							spend_time = spend_time.join(":")
							let today = new Date();
							let current = checkTime(today.getHours()) + ":" + checkTime(today.getMinutes()) + ":" + checkTime(today.getSeconds());
							// const startTime = Date.parse(`1970-01-01T${start}Z`);
							// const currentTime = Date.parse(`1970-01-01T${current}Z`);
							// const spendTime = Date.parse(`1970-01-01T${spend_time}Z`);

							const startTime = Date.parse(`1970-01-01T${start}Z`);
							const currentTime = Date.parse(`1970-01-01T${current}Z`);
							// const spendTime = Date.parse(`1970-01-01T00:00:00Z`);
							var [hours, minutes, seconds] = spend_time.split(':');
							// Convert hours, minutes, and seconds to milliseconds
							var spendTime = (parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)) * 1000;


							console.log("SS", startTime, currentTime, spendTime);


							let diffTime
							if (currentTime < startTime) {
								const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
								diffTime = oneDayInMilliseconds - Math.abs(parseInt(currentTime) - parseInt(startTime));
							} else {
								diffTime = (parseInt(currentTime) - parseInt(startTime) + parseInt(spendTime));
								console.log("time", startTime, currentTime, spendTime, diffTime);
							}
							let runningCounter = millisecondToTime(diffTime)
							console.log("Counter", runningCounter);
							clearInterval(intervalID)
							$("#clock")[0].innerText = runningCounter
							countDown(diffTime);
						}
					}

				}
			},
			async: false
		});
		function countDown(time) {
			intervalID = setInterval(() => {
				time = time + 1000;
				$("#clock")[0].innerText = millisecondToTime(time);
			}, 1000)
		}

		function workForWhat() {

			const dialogPromise = new Promise((resolve, reject) => {
				let d = new frappe.ui.Dialog({
					title: 'Enter Details About Workes',
					fields: [
						{
							label: 'Case Task',
							fieldname: 'case_task',
							fieldtype: 'Link',
							options: "Task",
							reqd: 0
						},
						{
							label: 'Short Description',
							fieldname: 'description',
							fieldtype: 'Text',
							reqd: 0
						},
					],
					primary_action_label: 'Start Working..',
					primary_action(values) {
						resolve(values);
						d.hide();

					},
					secondary_action_label: 'Cancel',
					secondary_action() {
						resolve(0)
						d.hide();
					},
				});

				d.show();

			});

			return dialogPromise;

		}

		console.log("zone", Intl.DateTimeFormat().resolvedOptions().timeZone);

		$("#timeTrigger").on("click", async () => {
			const trigger = document.getElementById('timeTrigger')

			if (trigger.textContent == 'Start') {
				let operation = "addWorkTime"
				let dialog_data = await workForWhat()
				let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
				if (Object.keys(dialog_data).length > 0) {
					let doc = await workTime(operation, "No Need", dialog_data, timeZone)
					if (doc.start_session_time) {
						$("#timeTrigger")[0].innerText = "Stop";
						location.reload()
					} else {
						frappe.throw("Something Not Working in WorkTime DocType! From Start")
					}
				} else {
					//add dialog value || without dialog data addWorkTime
					operation = "addWorkTimeWithoutDialog"
					let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
					let doc = await workTime(operation, "No Need", "No Need", timeZone)
					if (doc.start_session_time) {
						$("#timeTrigger")[0].innerText = "Stop";
						location.reload()
					} else {
						frappe.throw("Something Not Working in WorkTime DocType! From Start without DialogData")
					}
				}

			} else {
				let operation = "endWorkTime"
				let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
				let editAbleDoc = await getThePendingWorkTimeDoc()
				let doc = await workTime(operation, editAbleDoc.name, "No Need", timeZone)
				if (doc.end_session_time) {
					$("#timeTrigger")[0].innerText = "Start";
					location.reload()
				} else {
					frappe.throw("Something Not Working in WorkTime DocType! From Stop")
				}
			}

		})

		$("#timeTriggerPause").on("click", async () => {
			const trigger = document.getElementById('timeTriggerPause')
			if (trigger.textContent == 'Pause') {
				//pause Part
				let operation = "pauseWorkTime"
				let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
				let editAbleDoc = await getThePendingWorkTimeDoc()
				let doc = await workTime(operation, editAbleDoc.name, "No Need", timeZone)
				if (doc.pause_session_time) {
					$("#timeTriggerPause")[0].innerText = "Resume";
					location.reload()
				} else {
					frappe.throw("Something Not Working in WorkTime DocType! From Pause")
				}
			} else {
				//Resume Part
				$("#timeTriggerPause")[0].innerText = "Pause";
				let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
				let operation = "resumeWorkTime"
				let editAbleDoc = await getThePendingWorkTimeDoc()
				let doc = await workTime(operation, editAbleDoc.name, "No Need", timeZone)
				location.reload()

			}
		})

		async function workTime(operation, docName, dialog_data, timeZone) {
			let user = frappe.session.user;
			let response = await frappe.call({
				method: `law.cases.page.overview.overview.${operation}`, //dotted path to server method
				args: { user, docName, dialog_data, timeZone },
				callback: function (r) {
					console.log(r.message, "DOC");
				}
			})

			return response.message
		}

		async function getThePendingWorkTimeDoc() {
			let user = frappe.session.user;
			let response = await frappe.call({
				method: `law.cases.page.overview.overview.getThePendingWorkTimeDoc`, //dotted path to server method
				args: { user },
				callback: function (r) {
				}
			})

			return response.message
		}

		function checkTime(i) {
			if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
			return i;
		}

		console.log(frappe);

		function millisecondToTime(milliseconds) {
			const hours = Math.floor(milliseconds / 3600000);
			const minutes = Math.floor((milliseconds % 3600000) / 60000);
			const seconds = Math.floor((milliseconds % 60000) / 1000);
			const ms = milliseconds % 1000;
			//const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
			const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
			// console.log("CHEk", milliseconds, timeString, hours, minutes, seconds);

			return timeString
		}
	}

})
