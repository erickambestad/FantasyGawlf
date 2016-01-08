import React from 'react'
import moment from 'moment'

class TournamentList extends React.Component {

  constructor(props) {
    super(props)
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
            (this.props.tournaments).reverse().map((tournament) => {
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
