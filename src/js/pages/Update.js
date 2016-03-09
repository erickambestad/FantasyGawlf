import React from 'react'
import moment from 'moment'

import Firebase from 'firebase'
var ref = new Firebase("https://fantasygawlf.firebaseio.com")

class Update extends React.Component {

  constructor(props) {
    super(props)

    let { userId, pickId } = this.props.params
    if (!pickId || !userId) {
      location.href = '/picks'
    }

    this.state = {
      pick: {},
      pickId: pickId,
      userId: userId
    }
  }

  componentDidMount() {
    ref.child('picks')
      .child(this.state.userId)
      .child(this.state.pickId)
      .once("value", (snapshot) => {
        this.setState({
          pick: snapshot.val()
        })
      })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    ref.child('picks')
      .child(this.state.userId)
      .child(this.state.pickId)
      .update({
        result: this.refs.amount.value
      }, function(error) {
        if (!error) {
          location.href = "/#/picks"
        }
      })
  }

  render() {
    return (
      <div className="jumbotron">
        <div className="container">
          <h1>Update Pick</h1>
          <div>
            <h3>{(this.state.pick).player}</h3>
            <h5>{(this.state.pick).course}</h5>
            <h6>{moment((this.state.pick).startDate, 'X').format('MM/DD/YYYY') + ' - ' + moment((this.state.pick).endDate, 'X').format('MM/DD/YYYY')}</h6>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input type="text" className="form-control" placeholder="Amount" ref="amount"/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Update;
