import frappe
import datetime
import math

@frappe.whitelist()
def case_data(case_data):
    #files = frappe.db.sql("""SELECT * FROM `tabFile` WHERE attached_to_name='{}'""".format(case_data), as_dict=True)
    data = frappe.db.sql("""SELECT * FROM `tabCase` WHERE case_no='{}'""".format(case_data), as_dict=True)
    case_data = 'Case-'+case_data
    
    caseTask = frappe.db.sql("""SELECT * FROM `tabCaseTaskChildTable` WHERE parent='{}' ORDER BY creation ASC""".format(case_data), as_dict=True)
    
    evidanceChildData = frappe.db.sql("""SELECT * FROM `tabEvidenceChildTable` WHERE parent='{}' ORDER BY creation ASC""".format(case_data), as_dict=True)
    
    
    count = 0 
    finalCasetask = []
    while(count < len(caseTask)):
        caseTaskChildData = caseTask[count]
        caseTaskData = frappe.get_doc('Case Task', caseTask[count].case_task)
        finalCasetask.append([caseTaskChildData,caseTaskData])
        count=count+1
    
    count2 = 0 
    finalEvidence = []
    fileData = []
    while(count2 < len(evidanceChildData)):
        childData = evidanceChildData[count2]
        evidenceData = frappe.get_doc('Evidence', evidanceChildData[count2].evidence)
        #fileData = (frappe.db.sql("""Select * from `tabFile` where attached_to_name='{}' ORDER BY creation ASC""".format(evidenceData.name), as_dict=True))
        finalEvidence.append([childData,evidenceData])
        #finalEvidence.append([childData,evidenceData,fileData])
        
        count2=count2+1
        
    contract = frappe.get_doc("Contracts",data[0].contract)
        
    caseWorkHistory = frappe.db.sql(""" select * from `tabWorkTime` where spend_session_time!="" ;""",as_dict=True)
    caseWorkHistoryList = []

    for item in caseWorkHistory:
        if item.case == case_data:
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
                if item.task != "":
                    item.task =  "No Data"    
                if item.creation :
                    item.creation = str(item.creation).split(" ")[0]
            caseWorkHistoryList.append(item)
                
            
    spend_times_case = []
    unique_user = []
    
    for item in caseWorkHistoryList:
        spend_times_case.append(item.spend_session_time)
        unique_user.append(item.user)
        
    total_spend_times_case = datetime.timedelta()
    for time_str in spend_times_case:
        time1  = datetime.datetime.strptime(str(time_str), '%H:%M:%S').time()
        delta1 = datetime.timedelta(hours=time1.hour, minutes=time1.minute, seconds=time1.second)
        total_spend_times_case = total_spend_times_case + delta1
 
    return data,finalCasetask,finalEvidence,contract, caseWorkHistoryList, timeCalcutaion(total_spend_times_case.total_seconds()),len(spend_times_case), len(set(unique_user)), total_spend_times_case.total_seconds(),invoiceHistory(case_data),caseWorkHistory


@frappe.whitelist()
def invoiceHistory(case_data):
    paidAmount = 0
    data = frappe.db.sql("""select * from `tabInvoice`;""")
    finalInvoiceList = []
    for item in data:
        date = str(item[1]).split(' ')[0]
        temp = item[0],date,item[7],item[8],item[9]
        
        if item[10] == case_data:
            paidAmount+=item[7]
            finalInvoiceList.append(temp)
            
    return paidAmount, finalInvoiceList

@frappe.whitelist()
def invoice_Add(values):
    values = eval(values)
    doc = frappe.new_doc('Invoice')
    doc.invoice_value = values['invoice_value']
    doc.address_invoice = values['address_invoice']
    doc.receipt = values['receipt']
    doc.case = values['case']
    
    doc.insert();
    
    return doc



def timeCalcutaion(inSeconds):
    hour = math.floor((inSeconds/60)/60)
    inSeconds = inSeconds - hour*60*60
    minute = math.floor(inSeconds/60)
    inSeconds = inSeconds - minute*60
    inSeconds = math.floor(inSeconds)
    return str(hour)+' hours '+str(minute)+' minutes'