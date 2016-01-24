import React from 'react';

import Firebase from 'firebase'
var ref = new Firebase("https://fantasygawlf.firebaseio.com")

class Leaderboard extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      teams: {}
    }
  }

  componentDidMount() {
    this.loadLeaderboard()
  }

  loadLeaderboard = () => {
    ref.child('leaderboard')
      .once("value", (snapshot) => {
        this.setState({
          teams: snapshot.val()
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
              Object.keys(this.state.teams).map((team) => {
                return (
                  <tr key={Math.random()}>
                    <td>{team}</td>
                    <td>
                      {'$' + (parseInt(this.state.teams[team])).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
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
