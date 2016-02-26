import React from 'react'
import moment from 'moment'
import Firebase from 'firebase'

const ref = new Firebase("https://fantasygawlf.firebaseio.com");
const authData = ref.getAuth()

class MakePick extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      tournaments: [],
      picks: [],
      error: '',
      msg: ''
    }

    this.getTournaments()
    this.getPicks()
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

  getPicks = () => {
    ref.child('picks').child(authData.uid).on("value", (snapshot) => {
      let picks = []
      snapshot.forEach((data) => {
        let pick = data.val()
        picks.push(pick.player)
      })
      this.setState({
        picks: picks
      })
    })
  }

  validate = () => {
    // Check player name
    if (this.refs.playerName.value === "") {
      this.setState({
        error: "You must enter a player name"
      })
      return false
    }

    // Check tournament
    if (!this.refs.tournamentSelect.value) {
      this.setState({
        error: "You must select a tournament"
      })
      return false
    }

    return true
  }

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.validate()) {

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
        .child(authData.uid)
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
  }

  closeAlert = () => {
    this.setState({
      error: '',
      msg: ''
    })
  }

  render() {
    return (
      <div>
        <h2>Make Pick</h2>
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
            <select className="form-control" ref="playerName">
              <option value="">Available Players..</option>
              {
                (this.props.players)
                .map((player) => {
                  let disabled = (this.state.picks).indexOf(player) !== -1
                  return <option key={Math.random()} value={player} disabled={(disabled ? 'disabled' : '')}>{player + (disabled ? ' (Already Picked)' : '')}</option>
                })
              }
            </select>
          </div>
          <div className="form-group">
            <select className="form-control" ref="tournamentSelect">
              <option value="">Upcoming Tournaments..</option>
              {
                (this.state.tournaments)
                .filter((tournament) => {
                  return moment().unix() < tournament.startDate
                })
                .sort((a, b) => {
                  return a.startDate - b.startDate
                })
                .map((tournament) => {
                  return <option key={Math.random()} value={tournament.key}>{moment(tournament.startDate, 'X').format('MM/DD/YYYY') + " - " + moment(tournament.endDate, 'X').format('MM/DD/YYYY') + " - " + tournament.courseName + ' (' + (tournament.quarter).toUpperCase() + ')'}</option>
                })
              }
            </select>
          </div>
          <input type="submit" className="btn btn-primary btn-block" value="Submit" />
        </form>
      </div>
    );
  }
}

export default MakePick;
