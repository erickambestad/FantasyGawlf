import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'

import Firebase from 'firebase'
var ref = new Firebase("https://fantasygawlf.firebaseio.com")

class Picks extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      picks: []
    }
  }

  componentDidMount() {
    this.loadPicks()
  }

  loadPicks() {

    ref.child('picks').on("value", (snapshot) => {
      let picks = []
      let users = snapshot.val()
      for (let user in users) {
        let userPicks = users[user]
        for (let pick in userPicks) {
          let pickObj = userPicks[pick]
          if (pickObj.result === false) {
            pickObj.userId = user
            pickObj.pickId = pick
            picks.push(pickObj)
          }
        }
      }
      this.setState({
        picks: picks.sort((a, b) => {
          return a.startDate - b.startDate
        })
      })
    })
  }

  render() {
    return (
      <div className="jumbotron">
        <div className="container">
          <h1>Picks</h1>
          <div className="col-md-12">
              {
                (this.state.picks).map((pick) => {
                  return (
                    <form key={Math.random()} onSubmit={this.handleSubmit}>
                      <div className="col-md-12" style={{borderBottom: '1px solid #999', margin: '5px 0', padding: '5px 0 10px'}}>
                        <div className="col-md-4">
                          <h4><strong>{pick.player}</strong></h4>
                        </div>
                        <div className="col-md-4">
                          <div>{pick.course}</div>
                          {moment(pick.startDate, 'X').format('MM/DD/YYYY') + ' - ' + moment(pick.endDate, 'X').format('MM/DD/YYYY')}
                        </div>
                        <div className="col-md-1">
                          <Link to={'/pick/update/' +  pick.userId + '/' + pick.pickId} className="btn btn-primary">Update</Link>
                        </div>
                      </div>
                    </form>
                  )
                })
              }
          </div>
          <div className="col-md-12" style={{marginTop: '20px'}}>
            <button className="btn btn-success btn-block btn-lg">Update Leaderboard</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Picks;
