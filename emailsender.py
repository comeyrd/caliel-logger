import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import make_msgid
from dotenv import load_dotenv
import os
load_dotenv()

def send_email(body,receivermail,lastmail):
    message = MIMEMultipart()
    sender_name = "Miti Cron"  # Change this to the desired name
    sender_email = os.getenv('SENDER_MAIL')
    message['From'] = f"{sender_name} <{sender_email}>"
    message['To'] = receivermail
    message['Subject'] = "Passage Caliel"
    message.attach(MIMEText(body, 'html'))  # Use 'html' for HTML content
    if lastmail:
        message['In-Reply-To'] = lastmail
        message['References'] = lastmail
    # Connect to the SMTP server
    with smtplib.SMTP(os.getenv('SENDER_SMTP'), 587) as server:
        # Start the TLS connection
        server.starttls()
        # Login to the email account
        server.login(os.getenv('SENDER_MAIL'), os.getenv('SENDER_PASS'))
        # Send the email
        message["Message-ID"]=make_msgid()
        server.sendmail(os.getenv('SENDER_MAIL'), receivermail, message.as_string())
        print("Email sent successfully!")
        return message['Message-ID']
        