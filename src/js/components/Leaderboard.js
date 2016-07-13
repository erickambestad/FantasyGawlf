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
      teams: [],
      quarter: "q1"
    }
  }

  componentDidMount() {
    let currentQuarter = mixins.getQuarter(moment().unix())
    this.selectQuarter(currentQuarter)
    this.getUsers().then((users) => {
      this.loadLeaderboard(users)
    })
  }

  selectQuarter = (quarter) => {
    this.setState({
      quarter: quarter
    })
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

  loadLeaderboard = (users, quarter) => {
    ref.child('leaderboard')
      .child(this.state.quarter)
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

    let styles = {
      ul: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
        textAlign: 'center'
      },
      li: {
        display: 'inline',
        cursor: 'pointer',
        color: '#337ab7',
        textDecoration: 'underline'
      },
      liActive: {
        display: 'inline',
        cursor: 'default',
        fontWeight: 'bold',
        color: 'black'
      },
      liDisabled: {
        display: 'inline',
        cursor: 'default',
        color: 'black'
      }
    }

    return (
      <div>
        <h2>Leaderboard</h2>
        <div className="quarter-filters">
          <ul style={styles.ul}>
            <li style={(this.state.quarter === 'q1') ? styles.liActive : styles.li} onClick={this.selectQuarter.bind(this, 'q1')}>Q1</li>
            {" - "}
            <li style={(this.state.quarter === 'q2') ? styles.liActive : styles.li} onClick={this.selectQuarter.bind(this, 'q2')}>Q2</li>
            {" - "}
            <li style={(this.state.quarter === 'q3') ? styles.liActive : styles.li} onClick={this.selectQuarter.bind(this, 'q3')}>Q3</li>
            {" - "}
            <li style={(this.state.quarter === 'q4') ? styles.liActive : styles.li} onClick={this.selectQuarter.bind(this, 'q4')}>Q4</li>
          </ul>
        </div>
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
                    <td style={(key === 0) ? {fontWeight: 'bold'} : {}}><Link to={'/user-picks/' + team.team_id}>{team.name}</Link></td>
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
