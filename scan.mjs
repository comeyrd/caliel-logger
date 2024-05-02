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

const twomin = 2 * 60 * 1000;
const sevenmin = 7 * 60 * 1000;
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

function delay(min, max) {
    return new Promise(resolve => {
        const timeout = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(timeout);
        setTimeout(resolve,timeout);
    });
}

async function scanWithDelay(cal,url, options, loggerId) {
    const resp = await scan(url, options);
    if (resp != 401) {
        await cal.log(loggerId, "Qr Code Scanned Successfully");
    } else {
        await cal.log(loggerId, "Error with the QRcode Scanning");
    }
}


(async () => {
    try {

        const cal = new CalielDb(await mysql.createPool(mysqlConfig));
        const loggers = await cal.today_loggers();
        const response = await requestGet(PASTBIN);
        const promises = [];
        for (let i = 0; i < loggers.length; i++) {
            const options = {
                headers: {
                    'Cookie': cookiename + loggers[i].cookie
                }
            };
            promises.push(
                delay(twomin, sevenmin)
                    .then(() => scanWithDelay(cal,response.url, options, loggers[i].id))
            );
        }

        await Promise.all(promises);
    } catch (error) {
        console.error(error);
    } finally {
        process.exit(0);
    }
})();
