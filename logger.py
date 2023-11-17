import requests
import time
import random
from dotenv import load_dotenv
import os
from emailsender import send_email
receivermail = "ce.eyraud@gmail.com"
load_dotenv()
wait = random.randint(1, 5*60) #attends entre 1s et 15 minutes
time.sleep(wait)
#Recuperation du lien du QR code
r_qrcode = requests.get("https://api.jsonbin.io/v3/b/651934d454105e766fbc305e/latest?meta=false")
link_qr = (r_qrcode.json()).get("url")
cookies = {'REMEMBERME':os.getenv('CALIEL_COOKIE')} 
r = requests.get(link_qr,cookies=cookies)
send_email(r.text,receivermail)
