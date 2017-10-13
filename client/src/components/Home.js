import React, {Component} from 'react';
import {connect} from "react-redux";
import {signout} from "../actions/user";

class Home extends Component {

  componentWillMount() {
    if (this.props.user.status !== 'authenticated' || !this.props.user.userId || this.props.user.error) {
      this.props.history.push('/login');
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.user.status !== 'authenticated' || !nextProps.user.userId || !nextProps.user.error) {
      this.props.history.push('/login');
    }
  }

  render() {
    const {handleSignout} = this.props;
    return (
      <button type="button" className="btn btn-danger" onClick={handleSignout}>Logout</button>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleSignout: (data) => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      dispatch(signout(data))
    },
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
