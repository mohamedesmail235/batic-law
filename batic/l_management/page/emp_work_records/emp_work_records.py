import frappe
import datetime

@frappe.whitelist()
def workTimeData():
    spend_times = frappe.db.sql("""select spend_session_time from `tabWorkTime` where spend_session_time!="";""")
    total_work_hours = datetime.timedelta()
    for time_str in spend_times:
         time1  = datetime.datetime.strptime(str(time_str[0]), '%H:%M:%S').time()
         delta1 = datetime.timedelta(hours=time1.hour, minutes=time1.minute, seconds=time1.second)
         total_work_hours = total_work_hours + delta1
         
    currently_working = frappe.db.sql("""select count(*) from `tabWorkTime` where end_session_time="";""")[0][0]
    
    spend_times_today = frappe.db.sql("""select spend_session_time from `tabWorkTime` WHERE DATE(modified) = CURDATE() and spend_session_time!="";""")
    today_work_hours = datetime.timedelta()
    for time_str in spend_times_today:
         time1  = datetime.datetime.strptime(str(time_str[0]), '%H:%M:%S').time()
         delta1 = datetime.timedelta(hours=time1.hour, minutes=time1.minute, seconds=time1.second)
         today_work_hours = today_work_hours + delta1
        
    today_work_attempt = frappe.db.sql("""select count(*) from `tabWorkTime` WHERE DATE(modified) = CURDATE() and end_session_time!="";""")[0][0]
    
    workTimeSheet = frappe.db.sql("""select * from `tabWorkTime` ORDER BY modified DESC limit 20;""",as_dict=True)
        
    finalTimeSheet = []
    for item in workTimeSheet:
        if item.end_session_time != "":
            item.end_session_time = item.end_session_time.split(" ")[1]
        if item.start_session_time != "":
            item.start_session_time = item.start_session_time.split(" ")[1]
        if item.end_session_time == "":
            item.end_session_time = "Pending"
        if item.spend_session_time == "":
            item.spend_session_time = "Pending"    
        if item.case == None:
            item.case = "No Data"
        if item.task == "" or item.task == None:
            item.task =  "No Data"
        finalTimeSheet.append(item)
    
    
    return total_work_hours,currently_working,today_work_hours,today_work_attempt,finalTimeSheet


