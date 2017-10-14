import React, {Component} from 'react';
import {connect} from "react-redux";
import {loadHome, loadFiles} from "../actions/board";

class Navigation extends Component {

  componentWillMount() {
    if (this.props.user.status !== 'authenticated' || !this.props.user.userId || this.props.user.error) {
      this.props.history.push('/login');
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
    const {handleLoadHome, handleLoadFiles} = this.props;
    return (
      <div className="col-2 d-none d-sm-none d-md-block d-lg-block d-xl-block fixed-bottom" id="nav-left">
        <img src="./dropbox-logo.svg" alt="dropbox-logo" id="dropbox-logo-nav"/>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className={`nav-link ${this.props.board.toLoad==='home'?'active':'disabled'}`} href="" onClick={(e) => {
              e.preventDefault();
              handleLoadHome();
            }}>Home</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${this.props.board.toLoad==='files'?'active':'disabled'}`} href="" onClick={(e) => {
              e.preventDefault();
              handleLoadFiles();
            }}>Files</a>
          </li>
          {/*<li className="nav-item">
            <a className="nav-link disabled" href="#" onClick={(e) => {
              e.preventDefault();
              loadHome
            }}>Sharing</a>
          </li>*/}
        </ul>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleLoadHome: () => {
      dispatch(loadHome())
    },
    handleLoadFiles: () => {
      dispatch(loadFiles())
    },
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
    board: state.board,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
