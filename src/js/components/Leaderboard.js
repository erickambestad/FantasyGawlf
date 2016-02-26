import React from 'react';

import Firebase from 'firebase'
var ref = new Firebase("https://fantasygawlf.firebaseio.com")

class Leaderboard extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      teams: []
    }

    this.loadLeaderboard()
  }

  loadLeaderboard = () => {
    ref.child('leaderboard')
      .once("value", (snapshot) => {
        let leaders = snapshot.val(),
          leaderboardArr = []
        for (let team in leaders) {
          let score = leaders[team]
          leaderboardArr.push({
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
              }).map((team) => {
                return (
                  <tr key={team.name}>
                    <td>{team.name}</td>
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
