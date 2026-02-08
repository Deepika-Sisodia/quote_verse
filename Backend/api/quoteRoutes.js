const Quotes = require('../models/Quote');
const router = require('express').Router();

router.get('/allquotes',async (req,res)=>{
    try{
        let allQuotes = await Quotes.find({});
        res.status(200).json(allQuotes);
    }
    catch(e){
        res.status(400).json({msg:'something went wrong'})
    }
})

router.post('/addquotes', async (req,res)=>{
    let {text,author} = req.body;
    await Quotes.create({text,author});
    res.status(201).json({msg:"new quote create successfully"})
})

router.get('/quotes/:id', async (req,res)=>{
    let {id} = req.params;
        // return a single quote by id
        try{
            const quote = await Quotes.findById(id);
            if(!quote) return res.status(404).json({msg: 'Quote not found'});
            res.status(200).json(quote);
        }
        catch(e){
            res.status(400).json({msg:'something went wrong'})
        }
})

module.exports = router;