import React, {Component} from 'react';
import {connect} from "react-redux";
import {} from "../actions/content";
import {changePath, loadFiles} from "../actions/board";
import {listSharedFiles} from "../actions/content";
import {listSharedDirectories} from "../actions/content";
import {downloadSharedDirectory} from "../actions/content";
import {starSharedDirectory} from "../actions/content";
import {getSharedFiles} from "../actions/content";
import {getSharedDirectories} from "../actions/content";

class SharedDirectory extends Component {
  state = {
    sharers: '',
  };

  componentWillMount() {
    this.setState({
      sharers: '',
    });
    if (this.props.user.status !== 'authenticated' || !this.props.user.userId || this.props.user.error) {
      this.props.history.push('/login');
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.user.status !== 'authenticated' || !nextProps.user.userId || nextProps.user.error) {
      this.props.history.push('/login');
    } else if (this.props.board !== nextProps.board) {
      this.props.history.push('/');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.user.status !== 'authenticated' || !this.props.user.userId || this.props.user.error) {
      this.props.history.push('/login');
    } else if (this.props.board !== prevProps.board) {
      this.props.history.push('/');
    } else if (this.props.content.alert !== prevProps.content.alert) {

    }
  }

  render() {
    const {key, directory, handleStarDirectory, handleDownloadDirectory, handleDeleteDirectory, handleCreateShareLinkDirectory, handleDirectoryShare} = this.props;
    return (
      <div>
        <div className="directory-div clearfix">
          <a href="" onClick={(e) => {
            e.preventDefault();
            this.props.handleGetFiles({
              path: directory.path,
              name: directory.name,
            });
            this.props.handleGetDirectories({
              path: directory.path,
              name: directory.name,
            });
          }

          }>
            <i className="material-icons folder-icon">folder_shared</i><span>&nbsp;&nbsp;{directory.name}&nbsp;&nbsp;</span>
          </a>
          <span className="float-right"><a href=""><i className="material-icons star-icon text-primary" onClick={(e) => {
            e.preventDefault();
            handleStarDirectory({
              _id: directory._id,
              starred: !directory.starred,
            });
            if (!this.props.content.error) {
              directory.starred = !directory.starred
            }
          }}>{directory.starred ? 'star' : 'star_border'}</i></a>&nbsp;&nbsp;&nbsp;&nbsp;

            <span className="dropdown show clearfix">
                        <a className="btn text-center option-icon-btn" href="" role="button"
                           data-toggle="dropdown"
                           aria-haspopup="true" aria-expanded="false">
                          <i className="material-icons option-icon text-secondary">more_horiz</i>
                        </a>
                        <span className="dropdown-menu dropdown-menu-right mt-2">
                          <a className="dropdown-item" href="" onClick={(e) => {
                            e.preventDefault();
                            handleDownloadDirectory({
                              name: directory.name,
                              path: directory.path,
                              owner: directory.owner,
                            });
                          }}>Download</a>
                          {/*<a className="dropdown-item" href="" onClick={(e) => {
                            e.preventDefault();
                            handleDeleteDirectory({
                              name: directory.name,
                              path: directory.path,
                              _id: directory._id,
                            });
                            if (!this.props.content.error) {
                              this.props.content.directories.splice(key, 1);
                            }
                          }}>Delete</a>*/}
                        </span>
                      </span>
          </span>
        </div>
        <hr/>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleLoadFiles: (path) => {
      dispatch(loadFiles(path))
    },
    handleDownloadDirectory: (data) => dispatch(downloadSharedDirectory(data)),
    handleStarDirectory: (data) => dispatch(starSharedDirectory(data)),
    /*handleDeleteDirectory: (data) => dispatch(deleteSharedDirectory(data)),*/
    handleListFile: (data) => dispatch(listSharedFiles(data)),
    handleListDirectories: (data) => dispatch(listSharedDirectories(data)),
    handleGetFiles: (path) => dispatch(getSharedFiles(path)),
    handleGetDirectories: (path) => dispatch(getSharedDirectories(path)),
    handleChangePath: (path) => dispatch(changePath(path)),
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
    board: state.board,
    content: state.content,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SharedDirectory);
