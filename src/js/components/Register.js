import React from 'react'

// Get the logged in user
import Firebase from 'firebase'
var ref = new Firebase("https://fantasygawlf.firebaseio.com")

class Register extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      error: '',
      msg: ''
    }
  }

  validate = () => {
    let team = this.refs.teamName.value,
        email = this.refs.emailAddress.value,
        password = this.refs.password.value,
        confirm = this.refs.confirmPassword.value;

    if (team === "") {
      this.setState({
        error: "You must enter a team name"
      })
      return false
    }
    if (email === "") {
      this.setState({
        error: "You must enter an email address"
      })
      return false
    }
    if (password === "") {
      this.setState({
        error: "You must enter a password"
      })
      return false
    }
    if (confirm == "") {
      this.setState({
        error: "You must re-enter the password"
      })
      return false
    }
    if (password !== confirm) {
      this.setState({
        error: "Passwords do not match"
      })
      return false
    }
    return true
  }

  register = (e) => {
    e.preventDefault();

    if (this.validate()) {
      ref.createUser({
        email : this.refs.emailAddress.value,
        password : this.refs.password.value
      }, (error, authData) => {
        if (error) {
          switch (error.code) {
            case "INVALID_EMAIL":
              this.setState({
                error: "That email is invalid."
              })
              break;
            default:
              this.setState({
                error: "Error registering the user."
              })
          }
        } else {
          ref.authWithPassword({
            email : this.refs.emailAddress.value,
            password : this.refs.password.value
          }, (error, authData) => {
            if (error) {
              this.setState({
                error: "Login Failed! Please try again."
              })
            } else {
              ref.child("users").child(authData.uid).set({
                email: this.refs.emailAddress.value,
                team: this.refs.teamName.value,
                paid: false,
                finalist: false
              }, (error) => {
                if (error) {
                  this.setState({
                    error: "Error saving the user."
                  })
                } else {
                  location.href = '/'
                }
              })
            }
          })
        }
      })
    }
  }

  render() {
    return (
      <div>
        <h2>Register</h2>
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
        <form onSubmit={this.register}>
          <div className="form-group">
            <input type="text" className="form-control" placeholder="Team Name" ref="teamName"/>
          </div>
          <div className="form-group">
            <input type="text" className="form-control" placeholder="Email Address" ref="emailAddress"/>
          </div>
          <div className="form-group">
            <input type="password" className="form-control" placeholder="Password" ref="password"/>
          </div>
          <div className="form-group">
            <input type="password" className="form-control" placeholder="Confirm Password" ref="confirmPassword"/>
          </div>
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
      </div>
    )
  }
}

export default Register
