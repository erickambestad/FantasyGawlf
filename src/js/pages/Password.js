import React from 'react'

class Password extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      error: '',
      msg: ''
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    alert('email has been sent!')
    location.href = "/"
  }

  render() {
    return (
      <div className="jumbotron">
        <div className="container">
          <h1>Forgot Password</h1>
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
          <h6>Enter your email address to reset your password.</h6>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input type="text" className="form-control" placeholder="Email Address" ref="email"/>
            </div>
            <button type="submit" className="btn btn-primary">Email New Password Request</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Password;
