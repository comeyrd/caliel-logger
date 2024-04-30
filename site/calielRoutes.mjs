import express from 'express';
import bodyParser from 'body-parser';
import calieldb from "../db/CalielDb.mjs";
import mysql from "mysql2/promise";
import http from "https"
const router = express.Router();
const caliel_test_url = "https://www.caliel.fr/book/liste";
const cookiename = "REMEMBERME=";

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));



let mysqlConfig = {};

let cal;

router.post('/edit-logger', async (req, res) => {
    let { cookie, email, days, caliel_id ,originurl } = req.body;
    const logger = {
        id: caliel_id,
        cookie: cookie,
        mail: email, 
        days: days,
    };
    if(!Array.isArray(days)){
        let temp = days;
        days = [];
        days.push(temp);
    }   
    if(cookie == "MASKED"){
        cookie = false;
    }
    await cal.update_logger(caliel_id,days,cookie);
    await test_cookie(caliel_id).catch((error) => {
    });
    res.redirect(originurl);
});

router.post('/test-cookie',async (req,res)=>{
    let {caliel_id,originurl} = req.body;
    test_cookie(caliel_id)
  .then(() => {
    console.log(originurl);
    res.redirect(originurl);
  })
  .catch((error) => {
    console.log(originurl);
    res.redirect(originurl);
  });
    
})

async function test_cookie(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const logger = await cal.get_logger(id);
        const options = {
          headers: {
            'Cookie': cookiename + logger.cookie
          }
        };
        const cookie_req = http.get(caliel_test_url, options, async (cookie_res) => {
          if (cookie_res.statusCode == 200) {
            await cal.validate_cookie(id);
            resolve();
          } else {
            reject(new Error(`Cookie request failed with status code: ${cookie_res.statusCode}`));
          }
        });
  
        cookie_req.on('error', (err) => {
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  
async function get_caliel_obj(id){
    let logger = await cal.get_logger(id);
    logger.cookie = "MASKED";
    return logger;
}

async function get_all_caliel(){
    let loggers = await cal.get_all_logger();
    loggers.forEach((log) => {
        log.cookie = "MASKED";
      });
    return loggers;
}
async function get_all_caliel_logs(){
    let logs = await cal.get_all_logs();
    return logs;
}

async function get_caliel_logs(id){
    let logs = await cal.get_logs(id);
    return logs;
}

async function caliel_setup(mysqlconfig){
    mysqlConfig = mysqlconfig;
    cal = new calieldb(await mysql.createPool(mysqlConfig));
}


export default router;
export {get_caliel_obj,caliel_setup,get_caliel_logs,get_all_caliel,get_all_caliel_logs};