import React from 'react'
import moment from 'moment'

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
      teamName: null,
      paid: null
    }

    if (authData && authData.uid) {
      this.getTeamName()
    }
  }

  getTeamName = () => {
    ref.child('users').child(authData.uid).on("value", (snapshot) => {
      let user = snapshot.val()
      if (user) {
        this.setState({
          teamName: user.team,
          paid: user.paid
        })
      } else {
        this.setState({
          teamName: ''
        })
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

  // handleTeamNameChange = (e) => {
  //   e.preventDefault()
  //
  //   if (this.refs.teamName.value === "") {
  //     this.setState({
  //       error: "Error saving team name."
  //     })
  //     return
  //   }
  //
  //   let teamName = this.refs.teamName.value
  //
  //   let obj = {}
  //   obj.name = teamName
  //
  //   ref.child("teams")
  //     .child(authData.uid)
  //     .set(obj, (error) => {
  //       if (error) {
  //         this.setState({
  //           error: "Error saving team name."
  //         })
  //       } else {
  //         this.setState({
  //           msg: "Team name saved.",
  //           teamName: teamName
  //         })
  //       }
  //     })
  // }

  render() {

    // let needTeamName = (this.state.teamName === '') ? (
    //   <div className="col-md-12">
    //     <div className="alert alert-warning" role="alert">
    //       <form onSubmit={this.handleTeamNameChange}>
    //         <label>Change Team Name</label>
    //         <div className="form-group">
    //           <input className="form-control" type="text" placeholder="Please select a team name" ref="teamName" />
    //         </div>
    //         <button type="submit" className="btn btn-primary">Submit Team Name</button>
    //       </form>
    //     </div>
    //   </div>
    // ) : ''

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

    let needsPayment = (this.state.paid === false)
      ? <div className="alert alert-warning" role="alert" dangerouslySetInnerHTML={{__html: "Unpaid. <a href='https://www.paypal.me/erickambestad' target='_blank'>https://www.paypal.me/erickambestad</a> to pay with Paypal or email <a href='mailto:erickambestad@yahoo.com'>erickambestad@yahoo.com</a> for other methods. If you have recently paid, please allow 24 hours for the website to update."}}></div> : ''

    return (
      <div className="jumbotron">
        <div className="container">
          <h1>Fantasy Gawlf</h1>
          <h6>(Cause better names were taken.)</h6>
          <hr />
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
                    <strong>Welcome {this.state.teamName}</strong> (<a href="#" onClick={this.logout}>Logout</a>)
                  </div>
                  <div className="col-md-12">
                    {needPassword}
                    {needsPayment}
                  </div>
                  <div className="col-md-12">
                    <h3><strong>Schedule</strong></h3>
                    <ul style={{listStyle: 'none', paddingLeft: '0'}}>
                      <li><strong>Quarter 1:</strong> CareerBuilder Challenge (1/21/16) - Valspar Championship (3/13/2016)</li>
                      <li><strong>Quarter 2:</strong> Arnold Palmer Invitational (3/17/16) - Wells Fargo Championship (5/8/2016)</li>
                      <li><strong>Quarter 3:</strong> THE PLAYERS Championship (5/12/16) - World Golf Championships-Bridgestone Invitational (7/3/2016)</li>
                      <li><strong>Quarter 4:</strong> The Greenbrier Classic (7/7/16) - Wyndham Championship (8/21/2016)</li>
                      <li><strong>Championship:</strong> The Barclays (8/25/2016) - TOUR Championship by Coca-Cola (9/25/2016)</li>
                    </ul>
                  </div>
                  <div className="col-md-3">
                    <MakePick players={data.players} />
                  </div>
                  <div className="col-md-6">
                    <MyPicks />
                  </div>
                  <div className="col-md-3">
                    <Leaderboard />
                  </div>
                  <div className="col-md-12">
                    <hr />
                  </div>
                  <div className="col-md-12" style={{textAlign: 'center'}}>
                    <h2>Your winnings: <span style={{color:'green',fontWeight:'bold'}}>$0</span></h2>
                    <h6>As of {moment().format('MMMM Do YYYY')}</h6>
                  </div>
                </div>
              )
              //: <a href="#" className="btn btn-primary" onClick={this.login}>Login</a>
              : (
                <div>
                  <div className="col-md-12">
                    <div className="jumbotron">
                      <div>
                        <h3>How does it work?</h3>
                        <ul>
                          <li>Select one golfer each week....each golfer can only be used once during the season and cannot be re-used if they miss the cut the first time you chose them</li>
                          <li>Dollars earned by your player each week is our points system--if they miss the cut, you earn $0 that week.  So bigger purse tournaments are more important than smaller ones</li>
                          <li>The 2016 PGA Tour is split in to quarters and the winner from each quarter will face off in the Championship (final 4 events of the year).</li>
                          <li>Top players in each quarter will win prize money with the championship being the biggest pot</li>
                        </ul>
                      </div>
                      <div>
                        <h3>How do I play?</h3>
                        <p>Pick one player each tournament.. that’s it. Have fun! (and try not to rip your hair out)</p>
                      </div>
                    </div>
                  </div>
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
