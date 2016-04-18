import React from 'react'
import { Router, Route, Link, hashHistory } from 'react-router'
import { render } from 'react-dom'

import Home from './js/pages/Home'
import AddTournament from './js/pages/Tournaments/Add'
import Password from './js/pages/Password'
import Picks from './js/pages/Picks'
import Rules from './js/pages/Rules'
import Update from './js/pages/Update'
import PickMe from './js/pages/PickMe'
import UserPicks from './js/pages/UserPicks'
import TournamentPicks from './js/pages/TournamentPicks'

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
  <Router history={hashHistory}>
    <Route path="/" component={Home} />
    <Route path="/user-picks/:userId" component={UserPicks} onEnter={requireAuth} />
    <Route path="/tournament-picks/:tournamentId" component={TournamentPicks} onEnter={requireAuth} />
    <Route path="/tournament/add" component={AddTournament} onEnter={requireAdmin} />
    <Route path="/picks" component={Picks} onEnter={requireAdmin} />
    <Route path="/pick/update/:userId/:pickId" component={Update} onEnter={requireAdmin} />
    <Route path="/password" component={Password} />
    <Route path="/rules" component={Rules} />
    <Route path="/pick-me" component={PickMe} onEnter={requireAdmin} />
  </Router>
), document.getElementById('content'))
