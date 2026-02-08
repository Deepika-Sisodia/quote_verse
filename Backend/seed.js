const mongoose = require('mongoose');
const Quotes = require('./models/Quote');

let dummyQuotes = [
    {
        author: 'Samarth Vohra',
        text: 'Syntax Over Semantics'
    },

    {
        author: 'Sir Francis Bacon',
        text: 'Knowledge is power.'
    },

    {
        author: 'Forrest Gump',
        text: `Life is like a box of chocolates. You never know what you're gonna get.`
    },

    {
        author: 'Albert Einstein',
        text: 'Life is like riding a bicycle. To keep your balance, you must keep moving.'
    },
    {
        author: 'Star Wars',
        text: 'May the Force be with you.'
    }


]

async function seedDB(){
    await Quotes.deleteMany({});
    await Quotes.insertMany(dummyQuotes);
    console.log("DB seeded");
}

module.exports = seedDB;