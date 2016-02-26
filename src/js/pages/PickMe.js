import React from 'react'
import moment from 'moment'

import data from '../data.js'

import Firebase from 'firebase'
var ref = new Firebase("https://fantasygawlf.firebaseio.com")

class PickMe extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      users: [],
      tournaments: [],
      error: '',
      msg: ''
    }
  }

  componentDidMount() {
    this.getTournaments()
    this.getUsers()
  }

  getUsers = () => {
    let usersList = []
    ref.child('users').on("value", (snapshot) => {
      let users = snapshot.val()
      for (let user in users) {
        if (users.hasOwnProperty(user)) {
          let userObj = users[user]
          userObj.key = user
          usersList.push(userObj)
        }
      }
      this.setState({
        users: usersList
      })
    }, (error) => {
      this.setState({
        error: 'Something went wrong. Error retrieving users!',
        msg: ''
      })
    })
  }

  getTournaments = () => {
    // Attach an asynchronous callback to read the data at our posts reference
    let tournamentArray = []
    ref.child('tournaments').orderByChild("startDate").on("value", (snapshot) => {
      snapshot.forEach((data) => {
        let quarter = data.key(),
          tournaments = data.val()
        for (let tournament in tournaments) {
          if (tournaments.hasOwnProperty(tournament)) {
            let obj = tournaments[tournament]
            obj.key = tournament
            obj.quarter = quarter
            tournamentArray.push(obj)
          }
        }
      })
      this.setState({
        tournaments: tournamentArray
      })
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    let user = this.refs.userSelect.value
    let obj = {
      player: this.refs.playerName.value
    }
    let tourn = (this.state.tournaments).filter((tournament) => {
      return this.refs.tournamentSelect.value === tournament.key
    }).map((c) => {
      return c;
    })[0];
    obj.course = tourn.courseName
    obj.startDate = tourn.startDate
    obj.endDate = tourn.endDate
    obj.result = false

    let pick = ref.child("picks")
      .child(user)
      .child(this.refs.tournamentSelect.value)
      .set(obj, (error) => {
        if (error) {
          this.setState({
            error: 'Something went wrong. Please try again!',
            msg: ''
          })
        } else {
          this.setState({
            error: '',
            msg: 'Pick saved!'
          })
        }
      })
  }

  render() {
    return (
      <div className="jumbotron">
        <div className="container">
          <h1>{"Make user's pick"}</h1>
          {
            (this.state.error)
            ? (
              <div className="alert alert-danger" role="alert" onClick={this.closeAlert}>{this.state.error}</div>
            ) : ''
          }
          {
            (this.state.msg)
            ? (
              <div className="alert alert-success" role="alert" onClick={this.closeAlert}>{this.state.msg}</div>
            ) : ''
          }
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <select className="form-control" ref="userSelect">
                <option value="">Select user..</option>
                {
                  (this.state.users)
                    .map((user) => {
                      return <option key={Math.random()} value={user.key}>{user.team + " - " + user.email}</option>
                    })
                }
              </select>
            </div>
            <div className="form-group">
              <select className="form-control" ref="tournamentSelect">
                <option value="">Upcoming Tournaments..</option>
                {
                  (this.state.tournaments)
                    .sort((a, b) => {
                      return a.startDate - b.startDate
                    })
                    .map((tournament) => {
                      return <option key={Math.random()} value={tournament.key}>{moment(tournament.startDate, 'X').format('MM/DD/YYYY') + " - " + moment(tournament.endDate, 'X').format('MM/DD/YYYY') + " - " + tournament.courseName + ' (' + (tournament.quarter).toUpperCase() + ')'}</option>
                    })
                }
              </select>
            </div>
            <div className="form-group">
              <select className="form-control" ref="playerName">
                <option value="">Available Players..</option>
                {
                  (data.players)
                    .map((player) => {
                      return <option key={Math.random()} value={player}>{player}</option>
                    })
                }
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

export default PickMe;
