
frappe.pages['case-related'].on_page_load = function (wrapper) {
	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function (wrapper) {
		this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: 'Case Related',
			custom_page: true
		});
		this.make();
	},


	make: function () {
		let me = $(this);
		let isAllowed = false
		let links = [
			{
				name: "Case",
				link: "/case/new-case-1"
			},
			{
				name: "Employee",
				link: "/employee/new-employee-1"
			},
			{
				name: "Judge",
				link: "/judge/new-judge-1"
			},
			{
				name: "Court",
				link: "/court/new-court-1"
			},
			{
				name: "Section",
				link: "/section/new-section-1"
			},
			{
				name: "Contract",
				link: "/contracts/new-contracts-1"
			},
			{
				name: "Consultations",
				link: "/consultations/new-consultations-1"
			},
			{
				name: "Evidence",
				link: "/evidence/new-evidence-1"
			},
			{
				name: "Court Session",
				link: "/court-session/new-court-session-1"
			},
			{
				name: "Power of Attorney",
				link: "/power-of-attorney/new-power-of-attorney-1"
			},
			{
				name: "Orders",
				link: "/sales-order/new-sales-order-1"
			},
			{
				name: "Customer",
				link: "/customer/new-customer-1"
			},
		]
		let context = {
			links
		}
		$(frappe.render_template('case_related', context)).appendTo(this.page.main)

	}

})

