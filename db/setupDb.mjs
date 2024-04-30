import mysql from "mysql2/promise";
import dotenv from "dotenv";
import CalielDb from "./CalielDb.mjs";
dotenv.config();

const mysqlConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};
const mysqlConfigFirst = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "",
};

(async () => {
  let con;

  try {
    con = await mysql.createConnection(mysqlConfigFirst);
    await con.query(`DROP DATABASE caliel;`);
    await con.query(`CREATE DATABASE caliel;`);
    await con.end();
    let caliel = new CalielDb(await mysql.createPool(mysqlConfig))
    await caliel.setupDatabase()
    await caliel.new_logger('4',["Mon","Tue"],"zzzzzz");
    await caliel.new_logger('3',["Mon","Tue"],"azeazf");
    console.log(await caliel.get_logger('4'));
    await caliel.log('4','this is it');
    await caliel.log('4','maybe');
    console.log(await caliel.get_logs('4'));
    await caliel.set_lastmail('4','azeazfd');
    console.log(await caliel.today_loggers());
    await caliel.log('3','testing logging');
    await caliel.log('3','does it work ? ');
    await caliel.log('3','azmekjapkgfba^znepaigfnaôzerjapziehazôprj');
  } catch (e) {
    console.error("An error occurred:", e);
  } finally {
    // Close your connections or do any other necessary cleanup here
    if (con) {
      await con.end();
    }
    // Exit the Node.js process
    process.exit(0);
  }
})();
