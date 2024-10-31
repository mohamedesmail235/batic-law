import frappe

@frappe.whitelist()
def orders_data():
    total_orders = frappe.db.sql("""SELECT count(*) FROM `tabClient Orders`""")[0][0]
    on_processing = frappe.db.sql("""SELECT count(*) FROM `tabClient Orders` where order_status_workflow="Processing" """)[0][0]
    need_review = frappe.db.sql("""SELECT count(*) FROM `tabClient Orders` where order_status_workflow="Draft" """)[0][0]
    order_complete = frappe.db.sql("""SELECT count(*) FROM `tabClient Orders` where order_status_workflow="Closed" """)[0][0]
    
    recent_orders_data = frappe.db.sql('''select name,client,consultation,contract,order_status_workflow  FROM `tabClient Orders` ORDER BY modified desc limit 5''')
    
    return [total_orders,on_processing,need_review,order_complete,recent_orders_data]