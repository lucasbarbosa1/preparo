const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

require('./app/controllers/index')(app);



app.listen(3333);
