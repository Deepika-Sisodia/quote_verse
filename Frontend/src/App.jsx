import React, { Fragment } from 'react'
import MainNavigation from './components/mainNavigation/MainNavigation'
import {Routes, Route} from 'react-router-dom'
import AllQuotes from './components/pages/AllQuotes'
import NewQuotes from './components/pages/NewQuotes'

const App = () => {
  return (
    <Fragment>
      <MainNavigation/>
      <main>
        <Routes>
          <Route path='/' element={<AllQuotes/>} />
          <Route path='/new' element={<NewQuotes/>} />
        </Routes>
      </main>
    </Fragment>
  )
}

export default App