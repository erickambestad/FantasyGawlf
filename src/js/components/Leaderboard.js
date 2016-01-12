import React from 'react';

class Leaderboard extends React.Component {

  render() {
    return (
      <div>
        <h2>Leaders</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="2">Leaderboard will be updated after the first tournament.</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Leaderboard;
