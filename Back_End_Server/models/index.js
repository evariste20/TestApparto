const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { mongoose } = require('./db.js');
var userController = require('./controllers/user.controller.js');

var app = express();
app.use(bodyParser.json());
app.use(cors({ origin:'http://localhost:4200' }));

app.listen(3000, () => console.log('port du serveur : 3000 '));

//nom de la table dans la db
app.use('/users', userController);