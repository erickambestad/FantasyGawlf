import React from 'react'
import { Router, Route, Link } from 'react-router'
import { render } from 'react-dom'

import Home from './js/pages/Home'
import AddTournament from './js/pages/Tournaments/Add'
import Password from './js/pages/Password'
import Picks from './js/pages/Picks'
import Rules from './js/pages/Rules'

// Get the logged in user
import Firebase from 'firebase'
var ref = new Firebase("https://fantasygawlf.firebaseio.com")
var authData = ref.getAuth()

function requireAuth(nextState, replaceState) {
  if (!authData) {
    replaceState({ nextPathname: nextState.location.pathname }, '/')
  }
}

render((
  <Router>
    <Route path="/" component={Home} />
    <Route path="/tournament/add" component={AddTournament} onEnter={requireAuth} />
    <Route path="/picks" component={Picks} onEnter={requireAuth} />
    <Route path="/password" component={Password} />
    <Route path="/rules" component={Rules} />
  </Router>
), document.getElementById('content'))
