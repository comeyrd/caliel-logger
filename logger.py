import requests
import time
import random
from dotenv import load_dotenv
import os
load_dotenv()

wait = random.randint(1, 5*60) #attends entre 1s et 15 minutes
time.sleep(wait)

#Recuperation du lien du QR code
r_qrcode = requests.get("https://api.jsonbin.io/v3/b/651934d454105e766fbc305e/latest?meta=false")
link_qr = (r_qrcode.json()).get("url")


cookies = {'REMEMBERME':os.getenv('CALIEL_COOKIE')} # <----- Mettre son cookie ici

r = requests.get(link_qr,cookies=cookies)

now = time.strftime("%m-%d-%y_%H-%M-%S")
file = open("/var/www/html/"+now+".html","w")
file.write(r.text)
file.close()

# Envoi du SMS chez free
"""
message = "QR code scanne ! Resultat dispo ici : http://137.194.13.98/"+now+".html"

payload = {'user':'0','pass':'0','msg':message}
r2 = requests.post("https://smsapi.free-mobile.fr/sendmsg",json=payload)
"""
#print(r.text)