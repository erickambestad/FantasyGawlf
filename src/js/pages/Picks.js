import React from 'react'
import moment from 'moment'

import Firebase from 'firebase'
var ref = new Firebase("https://fantasygawlf.firebaseio.com")

class Picks extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      picks: []
    }

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
          if (pickObj.result === false && pickObj.endDate < moment().unix()) {
            pickObj.pickId = pick
            picks.push(pickObj)
          }
        }
      }
      this.setState({
        picks: picks
      })
    })
  }

  handleSubmit(e) {
      e.preventDefault()
  }

  render() {
    return (
      <div className="jumbotron">
        <div className="container">
          <h1>Picks</h1>
          <div className="col-md-12">
            <form onSubmit={this.handleSubmit}>
              {
                (this.state.picks).map((pick) => {
                  return (
                    <div key={Math.random()} className="col-md-12" style={{borderBottom: '1px solid #999', margin: '5px 0', padding: '5px 0 10px'}}>
                      <input type="hidden" value={pick.pickId} ref="pickId" />
                      <div className="col-md-4">
                        <h4><strong>{pick.player}</strong></h4>
                      </div>
                      <div className="col-md-4">
                        <div>{pick.course}</div>
                        {moment(pick.startDate, 'X').format('MM/DD/YYYY') + ' - ' + moment(pick.endDate, 'X').format('MM/DD/YYYY')}
                      </div>
                      <div className="col-md-3">
                        <div><input className="form-control" type="text" placeholder="Enter Winnings" ref="winnings" /></div>
                      </div>
                      <div className="col-md-1">
                        <button className="btn btn-primary">Submit</button>
                      </div>
                    </div>
                  )
                })
              }
            </form>
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
