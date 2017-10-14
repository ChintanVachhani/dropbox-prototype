import React, {Component} from 'react';
import {connect} from "react-redux";
import {getUser} from "../actions/user";

class App extends Component {

  componentWillMount() {
    let token = localStorage.getItem('token');
    let userId = localStorage.getItem('userId');
    if (!token || token === '' || !userId || userId === '') {
      return
    }
    this.props.handleAuthentication({
      userId: userId,
      token: token,
    });
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleAuthentication: (data) => {
      dispatch(getUser(data))
    },
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
    board: state.board,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
