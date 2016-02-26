import React from 'react'
import moment from 'moment'

const ref = new Firebase("https://fantasygawlf.firebaseio.com")
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
              id: key,
              course: picks[key].course,
              player: picks[key].player,
              result: picks[key].result,
              startDate: picks[key].startDate
            })
          }
        }
        this.setState({
          picks: picksArray
        })
      })
  }

  deletePick = (id) => {
    if (window.confirm('Are you sure you want to delete that pick?')) {
      ref.child('picks')
        .child(authData.uid)
        .child(id)
        .remove()
    } else {
      return
    }
  }

  render() {

    let picks = ((this.state.picks).length > 0) ?
      (this.state.picks).map((pick) => {
        return (
          <tr key={Math.random()}>
            <td><strong>{pick.player}</strong></td>
            <td>{pick.course}</td>
            <td>{(pick.result === false) ? '$0' : '$' + (parseInt(pick.result)).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
            <td style={{color: 'red', fontWeight: 'bold', cursor: 'pointer'}}>{(pick.startDate > moment().unix()) ? <span onClick={this.deletePick.bind(this, pick.id)}>X</span> : ''}</td>
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
              <th></th>
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
