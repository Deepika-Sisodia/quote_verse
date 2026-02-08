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

app.use('/', quoteRoutes);

app.get('/hello', (req,res)=>{
    res.status(200).json({msg:"hello from quotes app"})
})

//seedDB();

const port = process.env.PORT || 8080;

app.listen(port, ()=>{
    console.log("Server Connected Successfully!!!")
})