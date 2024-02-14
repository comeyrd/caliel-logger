import datetime
LOGFILE = "caliel.log"
def writelog(id,message):
    timestamp = datetime.datetime.now().strftime("%Y/%m/%d %H-%M")
    log_entry = f"{timestamp} | {id}  :  {message}\n"
    with open(LOGFILE, 'a') as log_file:
        log_file.write(log_entry)
        
def is_today_in_list(days_list):
    current_day = datetime.datetime.now().strftime("%a")
    return current_day in days_list

def process_message(html_content):
    start_index = html_content.find('<p>')
    end_index = html_content.find('</p>', start_index)
    # Extract the content between <p> and </p>
    if start_index != -1 and end_index != -1:
       desired_text = html_content[start_index + len('<p>'):end_index].strip()
       return desired_text
    else:
       return "error"