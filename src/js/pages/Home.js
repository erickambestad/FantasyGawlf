import React from 'react'

import data from '../data.js'

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
      loggedIn: !!authData,
      error: '',
      msg: '',
      teamName: ''
    }

    this.getTeamName()
  }

  getTeamName = () => {
    ref.child('teams').child(authData.uid).on("value", (snapshot) => {
      let teams = snapshot.val()

      if (teams) {
        for (let team in teams) {
          if (teams.hasOwnProperty(team) && teams[team].hasOwnProperty('name')) {
            this.setState({
              teamName: teams[team].name
            })
          }
        }
      }
    })
  }

  login = () => {
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

  handlePasswordChange = (e) => {
    e.preventDefault()
    ref.changePassword({
      email       : authData.password.email,
      oldPassword : this.refs.oldpassword.value,
      newPassword : this.refs.newpassword.value
    }, (error) => {
      if (error === null) {
        ref.unauth()
        alert("Password changed successfully, please log in again.")
        location.href = "/"
      } else {
        this.setState({
          error: "Error changing password"
        })
      }
    });
  }

  handleTeamNameChange = (e) => {
    e.preventDefault()

    if (this.refs.teamName.value === "") {
      this.setState({
        error: "Error saving team name."
      })
      return
    }

    let obj = {}
    obj.name = this.refs.teamName.value;

    let team = ref.child("teams").child(authData.uid).push(obj)
    if (team.key()) {
      this.setState({
        msg: "Team name saved."
      })
    } else {
      this.setState({
        error: "Error saving team name."
      })
    }
  }

  render() {

    let needTeamName = (!this.state.teamName) ? (
      <div className="col-md-12">
        <div className="alert alert-warning" role="alert">
          <form onSubmit={this.handleTeamNameChange}>
            <label>Change Team Name</label>
            <div className="form-group">
              <input className="form-control" type="text" placeholder="Please select a team name" ref="teamName" />
            </div>
            <button type="submit" className="btn btn-primary">Submit Team Name</button>
          </form>
        </div>
      </div>
    ) : ''

    let needPassword = (authData && (authData.password).hasOwnProperty('isTemporaryPassword') && authData.password.isTemporaryPassword) ? (
      (
        <div className="container col-md-12">
          <div className="alert alert-danger" role="alert">
            <form onSubmit={this.handlePasswordChange}>
              <label>Change Temporary Password</label>
              <div className="form-group">
                <input className="form-control" type="password" placeholder="Old password" ref="oldpassword" />
              </div>
              <div className="form-group">
                <input className="form-control" type="password" placeholder="New password" ref="newpassword" />
              </div>
              <button type="submit" className="btn btn-primary">Change Password</button>
            </form>
          </div>
        </div>
      )
    ) : ''

    let welcome = (this.state.teamName) ? 'Welcome ' + this.state.teamName + '!' : 'Welcome!'

    return (
      <div className="jumbotron">
        <div className="container">
          <h1>Fantasy Gawlf</h1>
          {
            (this.state.error)
            ? (
              <div className="alert alert-danger" role="alert">{this.state.error}</div>
            ) : ''
          }
          {
            (this.state.msg)
            ? (
              <div className="alert alert-success" role="alert">{this.state.msg}</div>
            ) : ''
          }
          {
            (this.state.loggedIn)
              ? (
                <div>
                  <div style={{marginBottom: '10px'}} className="col-md-12">
                    {welcome} (<a href="#" onClick={this.logout}>Logout</a>)
                  </div>
                  {needPassword}
                  {needTeamName}
                  <div className="col-md-3">
                    <MakePick players={data.players} />
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
