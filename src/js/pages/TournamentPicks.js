import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import Firebase from 'firebase'

const ref = new Firebase("https://fantasygawlf.firebaseio.com");
let authData;

class TournamentPicks extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      tournamentId: '',
      tournament: {},
      picks: [],
      users: {}
    }
  }

  componentDidMount() {
    let { tournamentId } = this.props.params
    if (!tournamentId) {
      location.href = "/"
    }

    // get users for the list
    this.getUsers().then((users) => {
      this.setState({
        users: users,
        tournamentId: tournamentId
      })
    }).then(() => {
      return this.loadCourse()
    }).then(() => {
      return this.loadPicks()
    }).then((picks) => {
      this.setState({
        picks: picks
      })
    })

  }

  getUsers = () => new Promise((resolve, reject) => {
    let usersList = {}
    ref.child('users').once("value", (snapshot) => {
      let users = snapshot.val()
      for (let user in users) {
        if (users.hasOwnProperty(user)) {
          let userObj = users[user]
          usersList[user] = userObj.team
        }
      }
      resolve(usersList)
    })
  })

  loadCourse = () => new Promise((resolve, reject) => {
    ref.child('tournaments')
      .once("value", (snapshot) => {
        let tournaments = snapshot.val();
        Object.keys(tournaments).map((quarter, key) => {
          let q = tournaments[quarter]
          // console.log(q, 'q', this.state.tournamentId)
          if (q && q.hasOwnProperty(this.state.tournamentId) && typeof q[this.state.tournamentId] === 'object') {
            let t = q[this.state.tournamentId]
            this.setState({
              tournament: t
            })
            resolve(t)
          }
        })
      })
  })

  loadPicks = () => new Promise((resolve, reject) => {
    ref.child('picks')
      .once("value", (snapshot) => {
        let picksArray = []
        let picks = snapshot.val()
        Object.keys(picks).map((userId, key) => {
          let picksObj = picks[userId]
          if (picksObj && picksObj.hasOwnProperty(this.state.tournamentId) && typeof picksObj[this.state.tournamentId] === 'object') {
            picksObj[this.state.tournamentId].userId = userId
            picksObj[this.state.tournamentId].team = this.state.users[userId]
            picksArray.push(picksObj[this.state.tournamentId])
          }
        })
        resolve(picksArray)
      })
  })

  handleSubmit = (e) => {
    e.preventDefault()
  }

  render() {
      console.log(this.state.picks)
    return (
      <div className="jumbotron">
        <div className="container">
          <h1>Tournament Picks</h1>
          <Link to={'/'}>Back Home</Link>
          <h4>{this.state.tournament.courseName}</h4>
          <h6>{this.state.tournament.courseLocation}</h6>
          <div className="col-md-12">
            <table className="table">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Pick</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {
                  (this.state.picks).sort((a, b) => {
                    return a.result - b.result
                  }).reverse().map((pick, key) => {
                    return (
                      <tr key={key}>
                        <td>{pick.team}</td>
                        <td>{pick.player}</td>
                        <td>{(pick.result <= 0) ? '$0' : '$' + (parseInt(pick.result)).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default TournamentPicks;
