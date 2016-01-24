import React from 'react'
import { Router, Route, Link } from 'react-router'
import { render } from 'react-dom'

import Home from './js/pages/Home'
import AddTournament from './js/pages/Tournaments/Add'
import Password from './js/pages/Password'
import Picks from './js/pages/Picks'
import Rules from './js/pages/Rules'
import Update from './js/pages/Update'

// Get the logged in user
import Firebase from 'firebase'
var ref = new Firebase("https://fantasygawlf.firebaseio.com")
var authData = ref.getAuth()

function requireAuth(nextState, replaceState) {
  if (!authData) {
    replaceState({ nextPathname: nextState.location.pathname }, '/')
  }
}

function requireAdmin(nextState, replaceState) {
  if (!authData || authData.password.email !== 'erickambestad@yahoo.com') {
    replaceState({ nextPathname: nextState.location.pathname }, '/')
  }
}

render((
  <Router>
    <Route path="/" component={Home} />
    <Route path="/tournament/add" component={AddTournament} onEnter={requireAdmin} />
    <Route path="/picks" component={Picks} onEnter={requireAdmin} />
    <Route path="/pick/update/:userId/:pickId" component={Update} onEnter={requireAdmin} />
    <Route path="/password" component={Password} />
    <Route path="/rules" component={Rules} />
  </Router>
), document.getElementById('content'))
