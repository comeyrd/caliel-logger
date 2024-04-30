import express from "express"
import ejs from 'ejs';
import calielRoutes,{get_caliel_obj,caliel_setup,get_caliel_logs,get_all_caliel,get_all_caliel_logs} from './calielRoutes.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const mysqlConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};


await caliel_setup(mysqlConfig);

const app = express();
const port = 8103;

app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/caliel-views');

app.use('/caliel', calielRoutes); 

app.get("/", async (req, res) => {
    const caliel = await get_caliel_obj("3");
    const caliel_logs = await get_caliel_logs("3");
    const obj = {caliel,caliel_logs,'originurl':'/'};
    res.render("caliel",obj);
});


app.get("/admin", async (req, res) => {
    const caliel_loggers = await get_all_caliel();
    const caliel_alllogs = await get_all_caliel_logs();
    const obj = {"caliel_loggers":caliel_loggers,'caliel_alllogs':caliel_alllogs,'originurl':'/admin'};
    res.render("admin",obj);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
