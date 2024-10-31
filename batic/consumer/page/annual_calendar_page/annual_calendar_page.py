import frappe
from datetime import date

@frappe.whitelist()
def vacation_data():
    data = {}
    data['current_vacations'] = frappe.db.sql("""select `tabEmployee`.full_name, `tabVacation`.start_date, `tabVacation`.end_date, `tabVacation`.description, `tabVacation`.days,
	DATEDIFF(`tabVacation`.end_date,
	now()) as left_days from `tabVacation` inner join `tabEmployee` on	`tabEmployee`.name = `tabVacation`.employee where Date(now()) BETWEEN Date(`tabVacation`.start_date) AND Date(`tabVacation`.end_date) and `tabVacation`.status = 'Approved'""", as_dict=True)

  
    return data