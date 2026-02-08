import React, { useRef } from 'react'
import styles from './NewQuote.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const NewQuotes = () => {
  let navigate = useNavigate();
  let usernameInputRef = useRef(null);
  let quoteInputRef = useRef(null);

  const addQuoteHandler =  async (e)=>{
    e.preventDefault();
    const author = usernameInputRef.current.value;
    const text = quoteInputRef.current.value;
    try{
      let res =  await axios.post('http://localhost:8080/addquotes',{author,text});
      console.log(res);
      // clear inputs on success
      if(usernameInputRef.current) usernameInputRef.current.value = '';
      if(quoteInputRef.current) quoteInputRef.current.value = '';
      navigate('/');
    }
    catch(err){
      console.log("Can't create a quote at this moment:", err)
    }
  }

  return (
    <form onSubmit={addQuoteHandler} className={styles['new-quote-form']} >
        <div>
            <label htmlFor='author'>Author:</label>
            <input type="text" id='author' ref={usernameInputRef} placeholder="Author's Name" />
        </div>

        <div>
            <label htmlFor='quote'>Quote:</label>
            <textarea name='quote' id='quote' cols={15} rows={4} ref={quoteInputRef} placeholder="Author's Quote" />
        </div>

        <button type="submit">Add Quote</button>
    </form>
  )
}

export default NewQuotes