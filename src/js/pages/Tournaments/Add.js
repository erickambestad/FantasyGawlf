import React from 'react'
import moment from 'moment'

import TournamentList from '../../components/TournamentList'

const ref = new Firebase("https://fantasygawlf.firebaseio.com");

class AddTournament extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      error: '',
      msg: '',
      tournaments: {}
    }

    this.getTournaments()
  }

  getTournaments = () => {
    // Attach an asynchronous callback to read the data at our posts reference
    ref.child('tournaments').orderByChild("startDate").on("value", (snapshot) => {

      let quarterObj = {},
        tournamentYear = snapshot.val()

      for (let quarter in tournamentYear) {
        if (tournamentYear.hasOwnProperty(quarter)) {
          let tournaments = tournamentYear[quarter],
            tournamentArr = []
          for (let tournament in tournaments) {
            if (tournaments.hasOwnProperty(tournament)) {
              tournamentArr.push(tournaments[tournament])
            }
          }
          quarterObj[quarter] = tournamentArr
        }
      }

      this.setState({
        tournaments: quarterObj
      })
    })
  }

  validate = () => {
    // Check course name
    if (this.refs.courseName.value === "") {
      this.setState({
        error: "You must enter a course name"
      })
      return false
    }
    // check course location
    if (this.refs.courseLocation.value === "") {
      this.setState({
        error: "You must enter a course location"
      })
      return false
    }
    //check tourney start date
    if (this.refs.startDate.value === "") {
      this.setState({
        error: "You must enter a start date"
      })
      return false
    }
    if (!moment(this.refs.startDate.value, "MM/DD/YYYY").isValid()) {
      this.setState({
        error: "Please enter a valid start date"
      })
      return false
    }
    //check tourney end date
    if (this.refs.endDate.value === "") {
      this.setState({
        error: "You must enter an end date"
      })
      return false
    }
    if (!moment(this.refs.endDate.value, "MM/DD/YYYY").isValid()) {
      this.setState({
        error: "Please enter a valid end date"
      })
      return false
    }
    return true
  }

  resetForm = () => {
    this.refs.courseName.value = ""
    this.refs.courseLocation.value = ""
    this.refs.startDate.value = ""
    this.refs.endDate.value = ""
  }

  handleSubmit = (e) => {
    e.preventDefault()
    if (this.validate()) {

      let obj = {}
      obj.courseName = this.refs.courseName.value
      obj.courseLocation = this.refs.courseLocation.value
      obj.startDate = moment(this.refs.startDate.value, "MM/DD/YYYY").unix()
      obj.endDate = moment(this.refs.endDate.value, "MM/DD/YYYY").unix()

      let tournament = ref.child("tournaments").child(this.refs.quarter.value).push(obj)

      if (tournament.key()) {
        this.setState({
          error: '',
          msg: 'Tournament saved!'
        })
        this.resetForm()
      } else {
        this.setState({
          error: 'Something went wrong. Please try again!',
          msg: ''
        })
      }
    }
  }

  render() {
    return (
      <div className="jumbotron">
        <div className="container">
          <div className="col-md-12">
            <h1>Add Tournament</h1>
            {
              (this.state.error)
              ? (
                <div className="alert alert-danger" role="alert">{this.state.error}</div>
              ) : ''
            }
            {
              (this.state.msg)
              ? (
                <div className="alert alert-success" role="alert">{this.state.msg}</div>
              ) : ''
            }
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Course Name" ref="courseName"/>
              </div>
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Course Location" ref="courseLocation"/>
              </div>
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Start Date (mm/dd/yyyy)" ref="startDate"/>
              </div>
              <div className="form-group">
                <input type="text" className="form-control" placeholder="End Date (mm/dd/yyyy)" ref="endDate"/>
              </div>
              <div className="form-group">
                <label>Quarter</label>
                <select className="form-control" ref="quarter">
                  <option value="q1">1</option>
                  <option value="q2">2</option>
                  <option value="q3">3</option>
                  <option value="q4">4</option>
                  <option value="fe">FedEx Cup</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AddTournament;
