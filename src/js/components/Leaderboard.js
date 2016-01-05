import React from 'react';

class Leaderboard extends React.Component {

  render() {
    return (
      <div>
        <h2>Leaders</h2>
        <h6>Last updated: 1/1/16 12:00:00</h6>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Eric</td>
              <td>$15,000,000</td>
            </tr>
            <tr>
              <td>John</td>
              <td>$14,000,000</td>
            </tr>
            <tr>
              <td>Paul</td>
              <td>$13,900,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Leaderboard;
