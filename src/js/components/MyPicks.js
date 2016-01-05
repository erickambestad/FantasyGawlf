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
            picksArray.push({course: picks[key].course, player: picks[key].player})
          }
        }
        this.setState({
          picks: picksArray
        })
      })
  }

  render() {
    return (
      <div>
        <h2>My picks</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Pick</th>
              <th>Course</th>
            </tr>
          </thead>
          <tbody>
          {
            (this.state.picks).map((pick) => {
              return (
                <tr key={Math.random()}>
                  <td>{pick.player}</td>
                  <td>{pick.course}</td>
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

export default MyPicks;
