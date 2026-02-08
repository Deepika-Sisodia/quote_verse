import React from 'react'
import styles from './NewQuote.module.css'

const NewQuotes = () => {
  return (
    <form className={styles['new-quote-form']} >
        <div>
            <label htmlForm='author'>Author:</label>
            <input type="text" id='author' placeholder="Author's Name" />
        </div>

        <div>
            <label htmlForm='quote'>Quote:</label>
            <textarea name='' id='quote' cols={15} placeholder="Author's Quote" />
        </div>
    </form>
  )
}

export default NewQuotes