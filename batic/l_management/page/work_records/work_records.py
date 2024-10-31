import frappe
import datetime
import math

def timeCalcutaion(all_spend_time):
    all_time_work_spend_time = datetime.timedelta()
    for time in all_spend_time:
        timeCount = datetime.datetime.strptime(str(time[0]), '%H:%M:%S').time()
        all_time_work_spend_time = all_time_work_spend_time + datetime.timedelta(hours=timeCount.hour, minutes=timeCount.minute, seconds=timeCount.second) 
    inSeconds = all_time_work_spend_time.total_seconds()
    hour = math.floor((inSeconds/60)/60)
    inSeconds = inSeconds - hour*60*60
    minute = math.floor(inSeconds/60)
    inSeconds = inSeconds - minute*60
    inSeconds = math.floor(inSeconds)
    
    return str(hour)+'h '+str(minute)+'m '

@frappe.whitelist()
def get_card_data(user_fullname):
    #All time work hour
    all_spend_time = frappe.db.sql("""select spend_session_time from `tabWorkTime` where user='{}' and spend_session_time != "";""".format(user_fullname))
    all_time_work_spend_time_string = timeCalcutaion(all_spend_time)
    
    #Currently Working
    currently_working = frappe.db.sql("""select * from `tabWorkTime` where user='{}' and end_session_time="";""".format(user_fullname))
    currently_working_string = "No"
    if len(currently_working) > 0 :
        currently_working_string = "Yes"
        if currently_working[0][10] != None and currently_working[0][11] != None:
            currently_working_string = currently_working_string+", in "+"Case & Task"    
        elif currently_working[0][10] != None and currently_working[0][11] == None:
            currently_working_string = currently_working_string+", in "+"Case" 
        elif currently_working[0][10] == None and currently_working[0][11] != None:
            currently_working_string = currently_working_string+", in "+"Task"
    
    #Last 7 days work hour
    last7Days_work_hour = frappe.db.sql("""select spend_session_time from `tabWorkTime` where user='{}' and modified >= DATE_SUB(NOW(), INTERVAL 7 DAY) and end_session_time!="";""".format(user_fullname))
    last7Days_work_hour_string = timeCalcutaion(last7Days_work_hour)
    
    #Last 7 days work attempts
    last7Days_work_attempts = len(last7Days_work_hour)
    
    #recent Work records on a employee
    workTimeSheet = frappe.db.sql("""select * from `tabWorkTime` where user='{}' ORDER BY modified DESC limit 20;""".format(user_fullname),as_dict=True)
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
    
    return all_time_work_spend_time_string,currently_working_string,last7Days_work_hour_string,last7Days_work_attempts,finalTimeSheet