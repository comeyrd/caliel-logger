# caliel-logger

This is a way for alternant to not scan the qr code.

First get the cookie by loging into caliel with "remember me" then look into your browser to get the REMEMBERME cookie
You do a cron job, for me its :
25 8 \* _ 2,3,5 /path/to/your/script.sh
55 16 _ \* 2,3,5 /path/to/your/script.sh

then create a script
#!/bin/bash

# Change to your desired directory

cd /path/to/your/directory

# Run the first Python script

python3.11 myfile.py

Mon
Tue
Wed
Thu
Fri
Sat
Sun
