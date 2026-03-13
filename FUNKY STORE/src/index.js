const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;

app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'token']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connect DB
const db = require('./config/index');
db.connect();

//Route Init
const route = require('./route');
route(app);

app.get('/', (req, res) => { res.send("Server Okay !")});

app.listen(port, () => console.log(`App Listening At HTTP://localhost:${port}`));