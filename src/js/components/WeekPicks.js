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

    this.loadCourse().then((tournament) => {
      this.setState({
        tournament: tournament
      });
    }).then(() => {
      return this.loadPicks()
    }).then((picks) => {
      this.setState({
        picks: picks
      })
    })
  }

  loadCourse = () => new Promise((resolve, reject) => {
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
                resolve(tournamentObj);
              }
              prev = tournamentObj;
            }
          });
        });
      });
  })

  loadPicks = () => new Promise((resolve, reject) => {
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
        resolve(picksArray)
      })
  })

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
