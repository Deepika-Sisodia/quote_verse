import React, { Fragment } from 'react'
import MainNavigation from './components/mainNavigation/MainNavigation'
import {Routes, Route} from 'react-router-dom'

import AllQuotes from './components/pages/AllQuotes'
import NewQuotes from './components/pages/NewQuotes'
import ShowQuotes from './components/pages/ShowQuotes'

const App = () => {
  return (
    <Fragment>
      <MainNavigation/>
      <main>
        <Routes>
          <Route path='/' element={<AllQuotes/>} />
          <Route path='/new' element={<NewQuotes/>} />
          <Route path='/quotes/:id' element={<ShowQuotes/>} />
        </Routes>
      </main>
    </Fragment>
  )
}

export default App