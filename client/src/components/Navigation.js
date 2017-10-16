import React, {Component} from 'react';
import {connect} from "react-redux";
import {loadHome, loadFiles, changePath, loadSharing} from "../actions/board";
import {getDirectories, getFiles, getSharedDirectories, getSharedFiles, listSharedDirectories, listSharedFiles} from "../actions/content";

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
    const {handleLoadHome, handleLoadFiles, handleLoadSharing} = this.props;
    return (
      <div className="col-2 d-none d-sm-none d-md-block d-lg-block d-xl-block fixed-bottom" id="nav-left">
        <a href="" onClick={(e) => {
          e.preventDefault();
          if (this.props.board.toLoad === 'sharing') {
            this.props.handleListFiles();
            this.props.handleListDirectories();
          } else {
            let path = this.props.board.currentPath;
            console.log(path);
            let pathArray = path.split('\\');
            let newPath = '';
            for (let i = 1; i < pathArray.length - 1; ++i) {
              newPath += "\\" + pathArray[i];
            }
            console.log(newPath);
            this.props.handleChangePath(newPath);
            this.props.handleGetFiles(newPath);
            this.props.handleGetDirectories(newPath);
          }
        }}><span>
        <i className="material-icons back-arrow text-secondary">keyboard_arrow_left</i>
        <img src="./dropbox-logo.svg" alt="dropbox-logo" id="dropbox-logo-nav"/>
        </span></a>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className={`nav-link ${this.props.board.toLoad === 'home' ? 'active' : 'disabled'}`} href="" onClick={(e) => {
              e.preventDefault();
              handleLoadHome();
            }}>Home</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${this.props.board.toLoad === 'files' ? 'active' : 'disabled'}`} href="" onClick={(e) => {
              e.preventDefault();
              handleLoadFiles();
            }}>Files</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${this.props.board.toLoad === 'sharing' ? 'active' : 'disabled'}`} href="" onClick={(e) => {
              e.preventDefault();
              handleLoadSharing();
            }}>Sharing</a>
          </li>
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
    handleLoadSharing: () => {
      dispatch(loadSharing());
    },
    handleGetFiles: (path) => dispatch(getFiles(path)),
    handleGetDirectories: (path) => dispatch(getDirectories(path)),
    handleChangePath: (path) => dispatch(changePath(path)),
    handleGetSharedFiles: (data) => dispatch(getSharedDirectories(data)),
    handleGetSharedDirectories: (data) => dispatch(getSharedFiles(data)),
    handleListFiles: (data) => dispatch(listSharedFiles(data)),
    handleListDirectories: (data) => dispatch(listSharedDirectories(data)),
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
    board: state.board,
    content: state.content,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
