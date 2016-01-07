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
      error: '',
      msg: ''
    }

    this.getTournaments()
  }

  getTournaments = () => {
    // Attach an asynchronous callback to read the data at our posts reference
    let tournamentArray = []
    ref.child('tournaments').orderByChild("startDate").on("value", (snapshot) => {
      let tournaments = snapshot.val()
      for (let key in tournaments) {
        if (tournaments.hasOwnProperty(key)) {
          tournamentArray.push({key: key, val: tournaments[key]})
        }
      }
      this.setState({
        tournaments: tournamentArray
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
        return c.val;
      })[0];

      obj.course = tourn.courseName
      obj.startDate = tourn.startDate

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

  render() {
    return (
      <div>
        <h2>Make Pick</h2>
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
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <select className="form-control" ref="playerName">
              <option value="">Select Player..</option>
              {
                (this.props.players).map((player) => {
                  return <option key={Math.random()} value={player}>{player}</option>
                })
              }
            </select>
          </div>
          <div className="form-group">
            <select className="form-control" ref="tournamentSelect">
              <option value="">Select Tournament..</option>
              {
                (this.state.tournaments).map(function(tournament) {
                  return <option key={Math.random()} value={tournament.key}>{moment(tournament.val.startDate, 'X').format('MM/DD/YYYY') + " - " + moment(tournament.val.endDate, 'X').format('MM/DD/YYYY') + " - " + tournament.val.courseName}</option>
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
