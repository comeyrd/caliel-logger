import CalielDb from "./db/CalielDb.mjs";
import dotenv from "dotenv";
import https from "https"; // Use 'https' instead of 'http'
import mysql from "mysql2/promise";

dotenv.config();

const PASTBIN = "https://api.jsonbin.io/v3/b/651934d454105e766fbc305e/latest?meta=false";
const mysqlConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
};
const cookiename = "REMEMBERME=";

async function requestGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}


async function scan(url, options) {
    return new Promise((resolve, reject) => {
        https.get(url, options, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                resolve(response.statusCode);
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

(async () => {
    try {

        const cal = new CalielDb(await mysql.createPool(mysqlConfig));
        const loggers = await cal.today_loggers();
        const response = await requestGet(PASTBIN);
        for(let i=0;i<loggers.length;i++){
            const options = {
                headers: {
                    'Cookie': cookiename + loggers[i].cookie
                }
            };
            const resp = await scan(response.url, options);
            if(resp !=401){
                await cal.log(loggers[i].id,"Qr Code Scanned Successfuly");
            }else{
                await cal.log(loggers[i].id,"Error with the QRcode Scanning");
            }
        }
        
    } catch (error) {
        console.error(error);
    } finally {
        process.exit(0);
    }
})();
