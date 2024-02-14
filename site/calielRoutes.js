const express = require('express');
const bodyParser = require('body-parser');
const { addLogger, getLogger, removeLogger,editLogger } = require('./localdb.js');

const router = express.Router();
const path = require('path');
const viewPath = path.join(__dirname, './caliel-views/caliel');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
console.log(__dirname)



router.get("/", (req, res) => {
    res.render(viewPath, {users: getLogger()});
});

router.post('/edit-logger', (req, res) => {
    const { cookie, email, days,id } = req.body;
    let logger = {
        id: id,
        cookie:cookie,
        mail:email,
        days:days,
    };
    editLogger(logger);
    res.redirect(req.baseUrl);
}); 

router.post('/delete-logger', (req, res) => {
    const id = req.body.id;
    if (id) {
        removeLogger(id);
    }
    res.redirect(req.baseUrl);
});

router.post('/create-logger', (req, res) => {
    const { cookie, email, days,id } = req.body;
    let logger = {
        id: id,
        cookie:cookie,
        mail:email,
        days:days,
    };
    addLogger(logger);
    res.redirect(req.baseUrl);
});

module.exports = router;
