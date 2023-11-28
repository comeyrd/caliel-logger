import datetime
LOGFILE = "caliel.log"
def writelog(id,message):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}]| {id}  :  {message}\n"
    with open(LOGFILE, 'a') as log_file:
        log_file.write(log_entry)
        
def is_today_in_list(days_list):
    current_day = datetime.datetime.now().strftime("%a")
    return current_day in days_list