import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'

import mixins from '../mixins'

import Firebase from 'firebase'
var ref = new Firebase("https://fantasygawlf.firebaseio.com")

class Leaderboard extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      teams: []
    }
  }

  componentDidMount() {
    this.getUsers().then((users) => {
      this.loadLeaderboard(users)
    })
  }

  getUsers = () => new Promise((resolve, reject) => {
    let usersList = {}
    ref.child('users').once("value", (snapshot) => {
      let users = snapshot.val()
      for (let user in users) {
        if (users.hasOwnProperty(user)) {
          let userObj = users[user]
          usersList[userObj.team] = user
        }
      }
      resolve(usersList)
    })
  })

  loadLeaderboard = (users) => {
    ref.child('leaderboard')
      .child(mixins.getQuarter(moment().unix()))
      .once("value", (snapshot) => {
        let leaders = snapshot.val(),
          leaderboardArr = []
        for (let team in leaders) {
          let score = leaders[team]
          leaderboardArr.push({
            team_id: users[team],
            name: team,
            score: score
          })
        }
        this.setState({
          teams: leaderboardArr
        })
      })
  }

  render() {
    /*<Link to={'/'}>Back Home</Link>*/
    return (
      <div>
        <h2>Leaderboard</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {
              (this.state.teams).sort((a, b) => {
                return b.score - a.score
              }).map((team, key) => {
                return (
                  <tr key={key}>
                    <td><Link to={'/user-picks/' + team.team_id}>{team.name}</Link></td>
                    <td>
                      {'$' + (parseInt(team.score)).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default Leaderboard;
