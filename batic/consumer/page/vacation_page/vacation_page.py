import frappe
from datetime import date
import holidays
@frappe.whitelist()
def vacation_data(employee=None):
    data = {}
    if employee:
        data['employee_vacation'] = frappe.db.sql("""select `tabVacation`.status, `tabVacation`.start_date, `tabVacation`.end_date from `tabVacation` where `tabVacation`.employee = '{}'; """.format(employee), as_dict=True)

    data['output'] = frappe.db.sql("""SELECT `tabEmployee`.full_name, `tabVacation`.* FROM `tabVacation` INNER JOIN `tabEmployee` on `tabEmployee`.name = `tabVacation`.employee WHERE `tabVacation`.status='Waiting'""", as_dict=True)
    data['current_vacations'] = frappe.db.sql("""select `tabEmployee`.full_name, `tabVacation`.start_date, `tabVacation`.end_date, 
	DATEDIFF(`tabVacation`.end_date,
	now()) as left_days from `tabVacation` inner join `tabEmployee` on	`tabEmployee`.name = `tabVacation`.employee where Date(now()) BETWEEN Date(`tabVacation`.start_date) AND Date(`tabVacation`.end_date) and `tabVacation`.status = 'Approved'""", as_dict=True)
    # data['current_vacations'] = frappe.db.sql("""SELECT * FROM `tabVacation` WHERE '{}' BETWEEN start_date and end_date AND status='Approved'""".format(str(date.today())), as_dict=True)
    data['holidays'] = []
    dates = []
    current_date = date.today()
    vacs = holidays.UnitedArabEmirates(years=[date.today().year])
    holidays_happened = []
    for holiday in vacs.items():
        if holiday[1] in holidays_happened: continue
        holidays_happened.append(holiday[1])
        dates.append(holiday)
    print(dates)
    cloz_dict = { 
    date_[0] - current_date : [date_, (date_[0] - current_date).days]
    for date_ in dates if date_[0] > current_date}
    if cloz_dict == {}:
        data['holidays'] = []
        
    sort_dictionary= list(dict(sorted(cloz_dict.items(), key=lambda item: item[0])).values())
    if len(sort_dictionary) == 0:
        data['holidays'] = []
    elif len(sort_dictionary) >= 3:
        data['holidays'] = sort_dictionary[:3]
    else:
        data['holidays'] = sort_dictionary
  
    return data
@frappe.whitelist()
def update_doc(updatedStatus, docName):
    doc = frappe.db.sql("""UPDATE `tabVacation` SET status='{}' WHERE name='{}'""".format(updatedStatus, docName))
    return doc
