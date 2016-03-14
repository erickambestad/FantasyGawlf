import React from 'react'
import moment from 'moment'
import Firebase from 'firebase'

const ref = new Firebase("https://fantasygawlf.firebaseio.com");
let authData;

class UserPicks extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
    }
  }

  componentDidMount() {
  }


  handleSubmit = (e) => {
    e.preventDefault()
  }

  render() {
    return (
      <div>
        User Picks
      </div>
    );
  }
}

export default UserPicks;
