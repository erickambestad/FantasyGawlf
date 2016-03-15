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
      user: {},
      picks: {}
    }
  }

  componentDidMount() {
    let { userId } = this.props.params
    if (!userId) {
      location.href = "/"
    }

    this.loadUser(userId).then((user) => {
      return this.loadPicks(user).then((picks) => {
        this.setState({
          user: user,
          picks: picks
        })
      })
    })
  }

  loadUser = (userId) => new Promise((resolve, reject) => {
    ref.child('users')
      .child(userId)
      .once("value", (snapshot) => {
      let user = snapshot.val()
      user.key = snapshot.key()
      resolve(user)
    }, (error) => {
      console.log(error,' error')
    })
  })

  loadPicks = (user) => new Promise((resolve, reject) => {
    ref.child('picks')
      .child(user.key)
      .once("value", (snapshot) => {
        let picksArray = []
        let picks = snapshot.val()
        resolve(picks)
      })
  })

  handleSubmit = (e) => {
    e.preventDefault()
  }

  render() {
    let pickArr = Object.keys(this.state.picks)
      .filter((pick) => {
        let pickObj = this.state.picks[pick]
        return pickObj.result !== false
      })
      .map((pick, key) => {
        let pickObj = this.state.picks[pick]
        return (
          <tr key={key}>
            <td>{pickObj.course}</td>
            <td>{pickObj.player}</td>
            <td>{(pickObj.result <= 0) ? '$0' : '$' + (parseInt(pickObj.result)).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
          </tr>
        )
      })

    return (
      <div className="jumbotron">
        <div className="container">
          <h1>User's Picks</h1>
          <Link to={'/'}>Back Home</Link>
          <h2>{this.state.user.team}</h2>
          <div className="col-md-12">
            <table className="table">
              <thead>
                <tr>
                  <th>Tournament</th>
                  <th>Pick</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {pickArr.length > 0 ? pickArr : <tr><td colSpan="3">Not available.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default TournamentPicks;
