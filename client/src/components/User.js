import React, {Component} from 'react';
import {connect} from "react-redux";
import {signin} from "../actions/user";

class User extends Component {

  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  };

  componentWillMount() {
    this.setState({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.status === 'authenticated' && nextProps.user.userId && !nextProps.user.error) {
      this.context.router.push('/');
    }
  }

  render() {
    const {handleSignin, handleSignup} = this.props;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col text-center p-3" id="login-header">
      <span><img src="./dropbox-logo.svg" alt="dropbox-logo" id="dropbox-logo"/><img
        src="./dropbox-logo-text.svg" alt="dropbox-logo-text" id="dropbox-logo-text"/></span>
          </div>
        </div>
        <div className="row pt-5">
          <div className="col text-right">
            <img src="./dropbox-sign-in.png" alt="dropbox-sign-in" id="dropbox-sign-in-img"/>
          </div>
          <div className="col text-left" id="forms">
            <div id="sign-in-div" className="collapse show">
              <div className="row">
                <div className="form-header col">Sign in</div>
                <div className="form-switch col text-right">or <a data-toggle="collapse" data-parent="#forms" href=""
                                                                  data-target="#sign-in-div,#sign-up-div">create an account</a></div>
              </div>
              <div className="form-body row">
                <form id="sign-in-form" className="col" onSubmit={(e) => {
                  e.preventDefault();
                  handleSignin(this.state);
                }}>
                  <div className="form-group mb-4"><input type="email" className="form-control" name="email" placeholder="Email" value={this.state.email}
                                                          onChange={(event) => {
                                                            this.setState({
                                                              email: event.target.value,
                                                            });
                                                          }} required/></div>
                  <div className="form-group mb-4"><input type="password" className="form-control" name="password" placeholder="Password" value={this.state.password}
                                                          onChange={(event) => {
                                                            this.setState({
                                                              password: event.target.value,
                                                            });
                                                          }} required/></div>
                  <button type="submit" className="btn btn-primary float-right">Sign in
                  </button>
                </form>
              </div>
            </div>
            <div id="sign-up-div" className="collapse">
              <div className="row">
                <div className="form-header col-8">Create an account</div>
                <div className="form-switch col text-right">or <a data-toggle="collapse" data-parent="#forms" href=""
                                                                  data-target="#sign-up-div,#sign-in-div">log in</a></div>
              </div>
              <div className="form-body row">
                <form id="sign-up-form" className="col" onSubmit={(e) => {
                  e.preventDefault();
                  handleSignup(this.state);
                }}>
                  <div className="form-group mb-4"><input type="text" className="form-control" name="firstName" placeholder="First name" value={this.state.firstName}
                                                          onChange={(event) => {
                                                            this.setState({
                                                              firstName: event.target.value,
                                                            });
                                                          }} required/></div>
                  <div className="form-group mb-4"><input type="text" className="form-control" name="lastName" placeholder="Last name" value={this.state.lastName}
                                                          onChange={(event) => {
                                                            this.setState({
                                                              lastName: event.target.value,
                                                            });
                                                          }} required/></div>
                  <div className="form-group mb-4"><input type="email" className="form-control" name="email" placeholder="Email" value={this.state.email}
                                                          onChange={(event) => {
                                                            this.setState({
                                                              email: event.target.value,
                                                            });
                                                          }} required/></div>
                  <div className="form-group mb-4"><input type="password" className="form-control" name="password" placeholder="Password" value={this.state.password}
                                                          onChange={(event) => {
                                                            this.setState({
                                                              password: event.target.value,
                                                            });
                                                          }} required/></div>
                  <button type="submit" className="btn btn-primary float-right">Create an account
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleSignin: (data) => dispatch(signin(data)),
    handleSignup: (data) => dispatch(signup(data)),
  };
}

function mapStateToProps(state, ownProps) {
  return {
    userId: state.userId,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
