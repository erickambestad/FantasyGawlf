import React from 'react'

import MakePick from '../components/MakePick'
import Leaderboard from '../components/Leaderboard'
import MyPicks from '../components/MyPicks'
import Login from '../components/Login'
import Register from '../components/Register'

// Get the logged in user
import Firebase from 'firebase'
var ref = new Firebase("https://fantasygawlf.firebaseio.com")
var authData = ref.getAuth()

class Home extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      loggedIn: !!authData
    }
  }

  login = () => {
    var ref = new Firebase("https://fantasygawlf.firebaseio.com")
    ref.authWithOAuthPopup("facebook", (error, authData) => {
      if (error) {
        this.setState({loggedIn: false})
      } else {
        window.location = '/'
      }
    });
  }

  logout = (e) => {
    e.preventDefault()
    ref.unauth()
    window.location = '/'
  }

  render() {
    return (
      <div className="jumbotron">
        <div className="container">
          <h1>Fantasy Gawlf</h1>
          {
            (this.state.loggedIn)
              ? (
                <div>
                  <div className="col-md-12">
                    Welcome! (<a href="#" onClick={this.logout}>Logout</a>)
                  </div>
                  <div className="col-md-3">
                    <MakePick />
                  </div>
                  <div className="col-md-5">
                    <MyPicks />
                  </div>
                  <div className="col-md-4">
                    <Leaderboard />
                  </div>
                </div>
              )
              //: <a href="#" className="btn btn-primary" onClick={this.login}>Login</a>
              : (
                <div>
                  <div className="col-md-12">
                    <div className="col-md-6">
                      <Login />
                    </div>
                    <div className="col-md-6">
                      <Register />
                    </div>
                  </div>
                </div>
              )
          }
        </div>
      </div>
    )
  }
}

export default Home
