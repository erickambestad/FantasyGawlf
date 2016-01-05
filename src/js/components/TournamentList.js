import React from 'react'
import moment from 'moment'

class TournamentList extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      tournaments: []
    }

    this.getData()
  }

  getData = () => {
    var ref = new Firebase("https://fantasygawlf.firebaseio.com");
    // Attach an asynchronous callback to read the data at our posts reference
    ref.child('tournaments').orderByChild("startDate").on("value", (snapshot) => {
      let tournamentArray = []
      let tournaments = snapshot.val()
      for (let key in tournaments) {
        if (tournaments.hasOwnProperty(key)) {
          tournamentArray.push(tournaments[key])
        }
      }
      this.setState({
        tournaments: tournamentArray
      })
    })
  }

  render() {

    let styles ={
      h2: {
        paddingBottom: '15px',
        borderBottom: '1px solid white'
      },
      li: {
        borderBottom: '1px solid white'
      }
    }

    return (
      <div>
        <h2 style={styles.h2}>Tournaments</h2>
        <ul>
          {
            (this.state.tournaments).reverse().slice(0,5).map((tournament) => {
              return (
                <li style={styles.li} key={Math.random()}>
                  <h5>{moment(tournament.startDate, 'X').format('MM/DD/YYYY') + ' - ' + moment(tournament.endDate, 'X').format('MM/DD/YYYY')}</h5>
                  <h4><strong>{tournament.courseName}</strong></h4>
                  <h6>{tournament.courseLocation}</h6>
                </li>
              )
            })
          }
        </ul>
      </div>
    );
  }
}

export default TournamentList;
