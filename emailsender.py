import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os
load_dotenv()

def send_email(body,receivermail):
    message = MIMEMultipart()
    message['From'] = os.getenv('SENDER_MAIL')
    message['To'] = receivermail
    message['Subject'] = "Passage Caliel"
    message.attach(MIMEText(body, 'html'))  # Use 'html' for HTML content
    # Connect to the SMTP server
    with smtplib.SMTP(os.getenv('SENDER_SMTP'), 587) as server:
        # Start the TLS connection
        server.starttls()
        # Login to the email account
        server.login(os.getenv('SENDER_MAIL'), os.getenv('SENDER_PASS'))
        
        # Send the email
        server.sendmail(os.getenv('SENDER_MAIL'), receivermail, message.as_string())
    print("Email sent successfully!")
