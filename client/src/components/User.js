import React, {Component} from 'react';
import {connect} from "react-redux";
import {getUser, signin, signup} from "../actions/user";

class User extends Component {

  state = {
    user: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    }, error: '',
    isCompleted: false,
  };

  componentWillMount() {
    this.setState({
      user: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      }, error: '',
      isCompleted: false,
    });
  }

  componentWillReceiveProps(nextProps, nextState) {
    // if signed in
    if (nextProps.user.status === 'authenticated' && nextProps.user.userId && !nextProps.user.error) {
      this.props.history.push('/');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isCompleted) {
      // if error
      if (prevProps.user.error !== this.props.user.error) {
        this.setState({...this.state, error: this.props.user.error});
      } else if (this.props.user !== prevProps.user) {
        if (this.props.user.status === 'authenticated' && this.props.user.userId && !this.props.user.error) {
          this.props.handleAuthentication({
            userId: this.props.user.userId,
            token: localStorage.getItem('token')
          });
          this.props.history.push('/');
        }
      }
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
        <div className="row">
          <div className="col text-center fixed-top alert-container">
            {this.state.error ? <div className="alert alert-danger alert-dismissible fade show" role="alert" id="alert-div">
              <div id="alert-text-div">
                {this.state.error}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <div id="alert-close-btn-div">
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" id="alert-close-btn">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div> : ''}
          </div>
        </div>
        <div className="row pt-3">
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
                  handleSignin(this.state.user);
                  this.setState({...this.state, isCompleted: true});
                }}>
                  <div className="form-group mb-4"><input type="email" className="form-control" name="email" placeholder="Email" value={this.state.user.email}
                                                          onChange={(event) => {
                                                            this.setState({
                                                              ...this.state,
                                                              user: {...this.state.user, email: event.target.value},
                                                            });
                                                          }} required/></div>
                  <div className="form-group mb-4"><input type="password" className="form-control" name="password" placeholder="Password" value={this.state.user.password}
                                                          onChange={(event) => {
                                                            this.setState({
                                                              ...this.state,
                                                              user: {...this.state.user, password: event.target.value},
                                                            });
                                                          }} required/></div>
                  <button href="#" type="submit" className="btn btn-primary float-right" role="button">Sign in
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
                  handleSignup(this.state.user);
                  this.setState({...this.state, isCompleted: true});
                }}>
                  <div className="form-group mb-4"><input type="text" className="form-control" name="firstName" placeholder="First name" value={this.state.user.firstName}
                                                          onChange={(event) => {
                                                            this.setState({
                                                              ...this.state,
                                                              user: {...this.state.user, firstName: event.target.value},
                                                            });
                                                          }} required/></div>
                  <div className="form-group mb-4"><input type="text" className="form-control" name="lastName" placeholder="Last name" value={this.state.user.lastName}
                                                          onChange={(event) => {
                                                            this.setState({
                                                              ...this.state,
                                                              user: {...this.state.user, lastName: event.target.value},
                                                            });
                                                          }} required/></div>
                  <div className="form-group mb-4"><input type="email" className="form-control" name="email" placeholder="Email" value={this.state.user.email}
                                                          onChange={(event) => {
                                                            this.setState({
                                                              ...this.state,
                                                              user: {...this.state.user, email: event.target.value},
                                                            });
                                                          }} required/></div>
                  <div className="form-group mb-4"><input type="password" className="form-control" name="password" placeholder="Password" value={this.state.user.password}
                                                          onChange={(event) => {
                                                            this.setState({
                                                              ...this.state,
                                                              user: {...this.state.user, password: event.target.value},
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
    handleAuthentication: (data) => dispatch(getUser(data)),
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
