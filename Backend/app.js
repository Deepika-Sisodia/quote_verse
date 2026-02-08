const express = require('express');
const app = express();
const mongoose = require('mongoose');
const seedDB = require('./seed');
const quoteRoutes = require('./api/quoteRoutes');

mongoose.connect('mongodb://127.0.0.1:27017/Quote')
.then(()=>{console.log('DB Connected')})
.catch((err)=>{console.log(err)});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// CORS middleware: allow requests from the frontend and allow Content-Type header
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
        return res.sendStatus(200);
    }
    next();
});

app.use('/', quoteRoutes);

app.get('/hello', (req,res)=>{
    res.status(200).json({msg:"hello from quotes app"})
})

//seedDB();

const port = process.env.PORT || 8080;

app.listen(port, ()=>{
    console.log("Server Connected Successfully!!!")
})