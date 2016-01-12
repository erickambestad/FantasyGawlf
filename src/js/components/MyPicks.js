import React from 'react';

const ref = new Firebase("https://fantasygawlf.firebaseio.com");
const authData = ref.getAuth()

class MyPicks extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      picks: []
    }

    this.loadPicks()
  }

  loadPicks = () => {
    ref.child('picks')
      .child(authData.uid)
      .orderByChild("startDate")
      .on("value", (snapshot) => {
        let picksArray = []
        let picks = snapshot.val()
        for (let key in picks) {
          if (picks.hasOwnProperty(key)) {
            picksArray.push({
              course: picks[key].course,
              player: picks[key].player,
              result: picks[key].result
            })
          }
        }
        this.setState({
          picks: picksArray
        })
      })
  }

  render() {

    let picks = ((this.state.picks).length > 0) ?
      (this.state.picks).map((pick) => {
        return (
          <tr key={Math.random()}>
            <td><strong>{pick.player}</strong></td>
            <td>{pick.course}</td>
            <td>{(pick.result === false) ? '$0' : '$' + (pick.result).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
          </tr>
        )
      }) : (
        <tr>
          <td colSpan="2">No picks yet.</td>
        </tr>
      )

    return (
      <div>
        <h2>My picks</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Pick</th>
              <th>Course</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
          { picks }
          </tbody>
        </table>
      </div>
    );
  }
}

export default MyPicks;
