import requests
import time
import random
from emailsender import send_email
from log import writelog,is_today_in_list
import json


#Recuperation du lien du QR code
#r_qrcode = requests.get("https://api.jsonbin.io/v3/b/651934d454105e766fbc305e/latest?meta=false")
#link_qr = (r_qrcode.json()).get("url")
link_qr = "https://www.caliel.fr/book/liste"

with open('loggers.json', 'r') as file:
    wait = random.randint(1, 2*60)
    data = json.load(file)
    for item in data:
        if is_today_in_list(item["days"]):
            cookies = {'REMEMBERME':item["cookie"]} 
            time.sleep(wait)
            r = requests.get(link_qr,cookies=cookies)
            #send_email(r.text,item["mail"])
            writelog(item["id"],r.status_code)
