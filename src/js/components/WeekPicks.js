import React from 'react'
import moment from 'moment'

const ref = new Firebase("https://fantasygawlf.firebaseio.com")
let authData;

class WeekPicks extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      picks: [],
      tournament: {}
    }
  }

  componentDidMount() {
    authData = ref.getAuth()

    this.loadPicks()
    this.loadCourse()
  }

  loadCourse = () => {
    let tournament;
    ref.child('tournaments')
      .once("value", (snapshot) => {
        let tournaments = snapshot.val();
        Object.keys(tournaments).map((quarter) => {
          let quarterObj = tournaments[quarter],
            prev;
          Object.keys(quarterObj).map((tournamentId) => {
            let tournamentObj = quarterObj[tournamentId],
              now = moment().unix();
            if (prev === undefined) {
              prev = tournamentObj;
            } else {
              if (now > prev.endDate && now < tournamentObj.endDate) {
                tournament = tournamentObj;
              }
              prev = tournamentObj;
            }
          });
        });
      });

      setTimeout(() => {
        this.setState({
          tournament: tournament
        });
      }, 1000);
  }

  loadPicks = () => {
    ref.child('picks')
      .once("value", (snapshot) => {
        let picksArray = []
        let picks = snapshot.val()
        for (let user in picks) {
          if (picks.hasOwnProperty(user)) {
            let pickObj = picks[user]
            for (let tournId in pickObj) {
              if (pickObj.hasOwnProperty(tournId)) {
                let userPick = pickObj[tournId]
                if (userPick.course === (this.state.tournament).courseName) {
                  picksArray.push({
                    team: this.props.users[user],
                    player: userPick.player
                  })
                }
              }
            }
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
        <h2>{"This week's picks"}</h2>
        <div>
          <div><strong>{(this.state.tournament).courseName}</strong></div>
          <div>{(this.state.tournament).courseLocation}</div>
          <div>{moment((this.state.tournament).startDate, 'X').format('MM/DD/YYYY') + ' - ' + moment((this.state.tournament).endDate, 'X').format('MM/DD/YYYY')}</div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Pick</th>
            </tr>
          </thead>
          <tbody>
            {
              (this.state.picks && (this.state.tournament.startDate < moment().unix()))
                ? (
                  (this.state.picks).map((pick) => {
                    return (
                      <tr key={Math.random()}>
                        <td>{pick.team}</td>
                        <td>{pick.player}</td>
                      </tr>
                    )
                  })
                )
                : <tr><td colSpan="2" style={{textAlign: 'center', color: 'green'}}>Available {moment((this.state.tournament).startDate, 'X').format('MM/DD/YYYY')}</td></tr>
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default WeekPicks;
