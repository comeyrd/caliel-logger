const express = require('express');
const ejs = require('ejs');
const path = require('path');
const calielRoutes = require('./calielRoutes.js');

const app = express();
const port = 8103;

app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use('/caliel', calielRoutes); 

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
