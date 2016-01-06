import React from 'react'
import { Link } from 'react-router'

// Get the logged in user
import Firebase from 'firebase'
var ref = new Firebase("https://fantasygawlf.firebaseio.com")
var authData = ref.getAuth()

class Login extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      error: '',
      msg: ''
    }
  }

  validate = () => {
    let email = this.refs.emailAddress.value,
        password = this.refs.password.value

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
    return true
  }

  login = (e) => {
    e.preventDefault();

    if (this.validate()) {
      ref.authWithPassword({
        email : this.refs.emailAddress.value,
        password : this.refs.password.value
      }, (error, authData) => {
        if (error) {
          switch (error.code) {
            case "INVALID_EMAIL":
              this.setState({
                error: "The specified user account email is invalid."
              })
              break;
            case "INVALID_PASSWORD":
              this.setState({
                error: "The specified user account password is incorrect."
              })
              break;
            case "INVALID_USER":
              this.setState({
                error: "The specified user account does not exist."
              })
              break;
            default:
              this.setState({
                error: "Error logging user in."
              })
          }
        } else {
          location.href = '/'
        }
      })
    }
  }

  render() {
    return (
      <div>
        <h2>Login</h2>
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
        <form onSubmit={this.login}>
          <div className="form-group">
            <input type="text" className="form-control" placeholder="Email Address" ref="emailAddress"/>
          </div>
          <div className="form-group">
            <input type="password" className="form-control" placeholder="Password" ref="password"/>
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <br />
        <div>
          <Link to={'/password'}>Forgot Password?</Link>
        </div>
      </div>
    )
  }
}

export default Login
