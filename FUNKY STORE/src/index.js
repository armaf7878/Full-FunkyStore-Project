const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;
const dotenv = require('dotenv');

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'token']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Env Config
dotenv.config();

//Connect DB
const db = require('./config/index');

db.connect();
//Route Init
const route = require('./route');
route(app);

app.get('/', (req, res) => { res.send("Server Okay !")});
app.listen(port, () => console.log(`App Listening At HTTP://localhost:${port}`));