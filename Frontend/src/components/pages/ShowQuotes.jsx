import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'


const ShowQuotes = () => {
    const params = useParams();

    let [quote,setQuotes] = useState({
        author:'',
        text:''
    })

    async function fetchQuote(){
        const url = `http://localhost:8080/quotes/${params.id}`;
        let res = await axios.get(url)
        let {author, text} = res.data;
        setQuotes({author,text});
    }

    useEffect(()=>{
        fetchQuote();
    },[])

  return (
    <div>
        <h3>{quote.author}</h3>
        <p>{quote.text}</p>
    </div>
  )
}

export default ShowQuotes