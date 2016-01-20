import React from 'react';

class Leaderboard extends React.Component {

  constructor(props) {
    super(props)
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
              Object.keys(this.props.users).map((team) => {
                return (
                  <tr key={Math.random()}>
                    <td>{this.props.users[team]}</td>
                    <td>$0</td>
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
