import React, {Component} from 'react';
import {connect} from "react-redux";
import {
  starFile, downloadFile, deleteFile, getDirectories, getFiles, getStarredFiles, getStarredDirectories, getActivities, createShareLink,
  shareFile, downloadSharedFile,
} from "../actions/content";
import {changePath} from "../actions/board";

class File extends Component {

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
    const {key, file, handleStarFile, handleDownloadFile, handleDeleteFile, handleCreateShareLink, handleFileShare} = this.props;
    console.log(this.state.id);
    return (
      <div>
        <div className="file-div clearfix">
          <i
            className="material-icons file-icon">insert_drive_file</i><span>&nbsp;&nbsp;{file.name}&nbsp;&nbsp;</span><span
          className="float-right"><a href=""><i className="material-icons star-icon text-primary" onClick={(e) => {
          e.preventDefault();
          handleStarFile({
            id: file.id,
            starred: !file.starred,
          });
          if (!this.props.content.error) {
            file.starred = !file.starred
          }
        }}>{file.starred ? 'star' : 'star_border'}</i></a>&nbsp;&nbsp;&nbsp;&nbsp;
          <span className="dropdown show clearfix">
                        <a className="btn text-center option-icon-btn" href="" role="button"
                           data-toggle="dropdown"
                           aria-haspopup="true" aria-expanded="false">
                          <i className="material-icons option-icon text-secondary">more_horiz</i>
                        </a>

                        <span className="dropdown-menu dropdown-menu-right mt-2">
                          <a className="dropdown-item" href="" onClick={(e) => {
                            e.preventDefault();
                            handleDownloadFile({
                              name: file.name,
                              path: file.path,
                              userId: file.owner,
                            });
                          }}>Download</a>
                          {/*<a className="dropdown-item" href="" onClick={(e) => {
                            e.preventDefault();
                            handleDeleteFile({
                              name: file.name,
                              path: file.path,
                              id: file.id,
                            });
                            if (!this.props.content.error) {
                              this.props.content.files.splice(key, 1);
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
    handleDownloadFile: (data) => dispatch(downloadSharedFile(data)),
    handleStarFile: (data) => dispatch(starFile(data)),
    handleDeleteFile: (data) => dispatch(deleteFile(data)),
    handleGetFiles: (path) => dispatch(getFiles(path)),
    handleGetDirectories: (path) => dispatch(getDirectories(path)),
    handleChangePath: (path) => dispatch(changePath(path)),
    handleGetStarredFiles: () => dispatch(getStarredFiles()),
    handleGetStarredDirectories: () => dispatch(getStarredDirectories()),
    handleGetActivities: (count) => dispatch(getActivities(count)),
    handleCreateShareLink: (data) => dispatch(createShareLink(data)),
    handleFileShare: (data) => dispatch(shareFile(data)),
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
    board: state.board,
    content: state.content,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(File);
