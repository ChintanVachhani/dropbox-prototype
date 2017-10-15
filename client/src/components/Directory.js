import React, {Component} from 'react';
import {connect} from "react-redux";
import {deleteDirectory, downloadDirectory, getActivities, getDirectories, getFiles, getStarredDirectories, getStarredFiles, starDirectory} from "../actions/content";
import {changePath, loadFiles} from "../actions/board";


class Directory extends Component {

  componentWillMount() {
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
      if(this.props.board.toLoad !== 'files'){
        this.props.handleGetStarredFiles();
        this.props.handleGetStarredDirectories();
        this.props.handleGetActivities(5);
      } else{
        let path = this.props.board.currentPath;
        this.props.handleGetFiles(path);
        this.props.handleGetDirectories(path);
      }
    }
  }

  render() {
    const {key, directory, handleStarDirectory, handleDownloadDirectory, handleDeleteDirectory} = this.props;
    return (
      <div>
        <div className="directory-div clearfix">
          <a href="" onClick={(e) => {
            e.preventDefault();
            if (this.props.board.toLoad !== 'files') {
              let path = directory.path;

              let pathArray = path.split('\\');
              let newPath = '';
              for (let i = 1; i < pathArray.length; ++i) {
                newPath += "\\" + pathArray[i];
              }
              path = newPath + "\\" + directory.name;
              console.log(path);
              this.props.handleLoadFiles(path);
            } else {
              let path = this.props.board.currentPath + "\\" + directory.name;
              this.props.handleChangePath(path);
              this.props.handleGetFiles(path);
              this.props.handleGetDirectories(path);
            }

          }}>
            <i className="material-icons folder-icon">folder</i><span>&nbsp;&nbsp;{directory.name}&nbsp;&nbsp;</span>
          </a>
          <span className="float-right"><a href=""><i className="material-icons star-icon text-primary" onClick={(e) => {
            e.preventDefault();
            handleStarDirectory({
              id: directory.id,
              starred: !directory.starred,
            });
            if (!this.props.content.error) {
              directory.starred = !directory.starred
            }
          }}>{directory.starred ? 'star' : 'star_border'}</i></a>&nbsp;&nbsp;&nbsp;&nbsp;
            <a className="btn btn-light btn-sm share-btn" href="#" role="button">Share</a>&nbsp;&nbsp;&nbsp;&nbsp;
            <span className="dropdown show">
                        <a className="btn text-center option-icon-btn" href="#" role="button"
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
                              userId: directory.owner,
                            });
                          }}>Download</a>
                          <a className="dropdown-item" href="" onClick={(e) => {
                            e.preventDefault();
                            handleDeleteDirectory({
                              name: directory.name,
                              path: directory.path,
                              id: directory.id,
                            });
                            if (!this.props.content.error) {
                              this.props.content.directories.splice(key, 1);
                            }
                          }}>Delete</a>
                        </span>
                      </span></span>
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
    handleDownloadDirectory: (data) => dispatch(downloadDirectory(data)),
    handleStarDirectory: (data) => dispatch(starDirectory(data)),
    handleDeleteDirectory: (data) => dispatch(deleteDirectory(data)),
    handleGetFiles: (path) => dispatch(getFiles(path)),
    handleGetDirectories: (path) => dispatch(getDirectories(path)),
    handleChangePath: (path) => dispatch(changePath(path)),
    handleGetStarredFiles: () => dispatch(getStarredFiles()),
    handleGetStarredDirectories: () => dispatch(getStarredDirectories()),
    handleGetActivities: (count) => dispatch(getActivities(count)),
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
    board: state.board,
    content: state.content,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Directory);
