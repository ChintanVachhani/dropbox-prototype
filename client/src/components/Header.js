import React, {Component} from 'react';
import {connect} from "react-redux";
import {signout} from "../actions/user";
import {loadAccount} from "../actions/board";

class Header extends Component {

  state = {
    initials: '',
    name: '',
  };

  componentWillMount() {
    if (this.props.user.status !== 'authenticated' || !this.props.user.userId || this.props.user.error) {
      this.props.history.push('/login');
    } else {
      let firstName = this.props.user.firstName;
      let lastName = this.props.user.lastName;
      this.setState({
        initials: firstName.toString().substring(0, 1).toUpperCase() + lastName.toString().substring(0, 1).toUpperCase(),
        name: firstName + ' ' + lastName,
      });
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.user.status !== 'authenticated' || !nextProps.user.userId || nextProps.user.error) {
      this.props.history.push('/login');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.user.status !== 'authenticated' || !this.props.user.userId || this.props.user.error) {
      this.props.history.push('/login');
    } else if (this.props.board !== prevProps.board) {
      this.props.history.push('/');
    }
  }

  render() {
    const {handleSignout, handleLoadAccount} = this.props;
    return (
      <div className="col col-md-10 col-lg-10 col-xl-10 ml-auto fixed-top" id="main-header">
        <div className="float-left" id="page-heading">{this.props.board.pageTitle}</div>
        <div className="dropdown show float-right">
          <a className="btn btn-secondary rounded-circle" href="" role="button" id="userDropdownMenuLink"
             data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {this.state.initials}
          </a>
          <div className="dropdown-menu dropdown-menu-right mt-2" aria-labelledby="userDropdownMenuLink"
               id="userDropdownMenuItems">
            <h4 className="dropdown-header">{this.state.name}</h4>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="" onClick={(e) => {
              e.preventDefault();
              handleLoadAccount();
            }}>Personal Account</a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="" onClick={(e) => {
              e.preventDefault();
              handleSignout();
            }}>Sign out</a>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleSignout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      dispatch(signout())
    },
    handleLoadAccount: () => dispatch(loadAccount()),
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
    board: state.board,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
