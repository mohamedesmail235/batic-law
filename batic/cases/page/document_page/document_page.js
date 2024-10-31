
frappe.pages['document-page'].on_page_load = function(wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper){
			this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'File Manager',
			single_column: false,
			custom_page: true
		});
		this.parent = wrapper;
		this.page = this.parent.page;
		// this.page.sidebar.html(
		// 	`<ul class="standard-sidebar leaderboard-sidebar overlay-sidebar"></ul>`
		// );
		// this.$sidebar_list = this.page.sidebar.find("ul");
		this.make();
		$("#clientsButton").click(() => {
			frappe.route_options = {}
			location.href="/app/client/new-client-1"
			// frappe.set_route(`/app/client/new-client-1`);
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
		let finalData = null
		let data = frappe.route_options.case
		let context = {}
		frappe.call({
			method: "batic.cases.page.document_page.document_page.files_data",
			args: {case_data: data},
			callback: function(r) {
				// clean_emp_data = r.message
				console.log(r.message)
				context["files"] = r.message
			},
			async: false
		});
		$(frappe.render_template('document_page', context)).appendTo(this.page.main)
	}

})

