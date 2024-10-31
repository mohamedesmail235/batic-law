

if (frappe.session.user_fullname == "Administrator") {
	const user_fullname = frappe.session.user_fullname;
	console.log("user", frappe.session);
	let intervalID = null
	const pauseButton = document.getElementById('pauseButton')
	frappe.call({
		method: "batic.cases.page.overview.overview.CheckLastWorkTimeStillContinue", //dotted path to server method
		args: { user_fullname },
		callback: function (r) {
			if (r.message.length == 0) {
				$("#timeTrigger")[0].innerText = "Start";
				$("#clock")[0].innerText = "00:00:00"
				pauseButton.classList.add('hidden')

			} else {
				$("#timeTrigger")[0].innerText = "Stop";
				let start
				if (r.message[0][17] != "") {
					$("#clock")[0].innerText = r.message[0][20]
					$("#timeTriggerPause")[0].innerText = "Resume"
				} else {

					if (r.message[0][21] == "") {
						start = r.message[0][8].split(" ")[1];
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
						console.log(runningCounter);
						$("#clock")[0].innerText = runningCounter
						countDown(diffTime);
					} else {
						start = r.message[0][21].split(" ")[1];
						let spend_time = r.message[0][20]
						spend_time = spend_time.split(":")
						spend_time[0] = checkTime(spend_time[0])
						spend_time = spend_time.join(":")
						console.log("fsjhdbfh", start, spend_time);
						let today = new Date();
						let current = checkTime(today.getHours()) + ":" + checkTime(today.getMinutes()) + ":" + checkTime(today.getSeconds());
						const startTime = Date.parse(`1970-01-01T${start}Z`);
						const currentTime = Date.parse(`1970-01-01T${current}Z`);
						const spendTime = Date.parse(`1970-01-01T${spend_time}Z`);

						let diffTime
						if (currentTime < startTime) {
							const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
							diffTime = oneDayInMilliseconds - Math.abs(parseInt(currentTime) - parseInt(startTime));
						} else {
							diffTime = (parseInt(currentTime) - parseInt(startTime) + parseInt(spendTime));
							console.log("time", startTime, currentTime, spendTime, diffTime);
						}
						let runningCounter = millisecondToTime(diffTime)
						console.log("shiol", runningCounter);
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
						label: 'Case',
						fieldname: 'case',
						fieldtype: 'Link',
						reqd: 0,
						options: "Case"
					},
					{
						label: 'Case Task',
						fieldname: 'case_task',
						fieldtype: 'Link',
						options: "Case Task",
						reqd: 0
					}
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
				console.log(doc, dialog_data, "for dia");
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
			let doc = await workTime(operation, editAbleDoc[0], "No Need", timeZone)
			console.log('enXDSd', doc)
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
			let doc = await workTime(operation, editAbleDoc[0], "No Need", timeZone)
			console.log('pause', doc)
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
			let doc = await workTime(operation, editAbleDoc[0], "No Need", timeZone)
			console.log('resume', doc)
			location.reload()

		}
	})

	async function workTime(operation, docName, dialog_data, timeZone) {
		let user_fullname = frappe.session.user_fullname;
		let response = await frappe.call({
			method: `batic.cases.page.overview.overview.${operation}`, //dotted path to server method
			args: { user_fullname, docName, dialog_data, timeZone },
			callback: function (r) {

			}
		})

		return response.message
	}

	async function getThePendingWorkTimeDoc() {
		let user_fullname = frappe.session.user_fullname;
		let response = await frappe.call({
			method: `batic.cases.page.overview.overview.getThePendingWorkTimeDoc`, //dotted path to server method
			args: { user_fullname },
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

		return timeString
	}
}


