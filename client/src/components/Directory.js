import React, {Component} from 'react';
import {connect} from "react-redux";
import {
  createShareLinkDirectory, deleteDirectory, downloadDirectory, getActivities, getDirectories, getFiles, getStarredDirectories, getStarredFiles, shareDirectory,
  starDirectory, toggleAlert,
} from "../actions/content";
import {changePath, loadFiles} from "../actions/board";


class Directory extends Component {
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
      if (this.props.board.toLoad !== 'files') {
        this.props.handleGetStarredFiles();
        this.props.handleGetStarredDirectories();
        this.props.handleGetActivities(5);
      } else {
        let path = this.props.board.currentPath;
        this.props.handleGetFiles(path);
        this.props.handleGetDirectories(path);
      }
    }
  }

  render() {
    const {key, directory, handleStarDirectory, handleDownloadDirectory, handleDeleteDirectory, handleCreateShareLinkDirectory, handleDirectoryShare, handleAlert} = this.props;
    return (
      <div>
        <div className="col text-center fixed-top alert-container">
          {this.props.content.error ? <div className="alert alert-danger alert-dismissible fade show" role="alert" id="alert-div">
            <div id="alert-text-div">
              {this.props.content.error}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div id="alert-close-btn-div">
              <button type="button" className="close" data-dismiss="alert" aria-label="Close" id="alert-close-btn" onClick={(e) => {
                e.preventDefault();
                handleAlert();
              }}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div> : ''}
        </div>
        <div className="col text-center fixed-top alert-container">
          {this.props.content.alert ? <div className="alert alert-success alert-dismissible fade show" role="alert" id="alert-div">
            <div id="alert-text-div">
              {this.props.content.alert}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div id="alert-close-btn-div">
              <button type="button" className="close" data-dismiss="alert" aria-label="Close" id="alert-close-btn" onClick={(e) => {
                e.preventDefault();
                handleAlert();
              }}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div> : ''}
        </div>
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
            <i className="material-icons folder-icon">{directory.shared ? 'folder_shared' : 'folder'}</i><span>&nbsp;&nbsp;{directory.name}&nbsp;&nbsp;</span>
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

            <a className="btn btn-light btn-sm share-btn" href="" role="button" data-toggle="modal" data-target={"#" + directory._id}>Share</a>&nbsp;&nbsp;&nbsp;&nbsp;

            <div className="modal center fade mh-75" id={directory._id} tabIndex="-1" role="dialog" aria-labelledby="share-modal-label" aria-hidden="true">
            <div className="modal-dialog" role="document">
            <div className="modal-content">
             <div className="modal-header">

             <input type="text" className="form-control" placeholder="To: comma separated emails" autoFocus onChange={(e) => {
               this.setState({
                 ...this.state,
                 sharers: e.target.value,
               });
             }
             }/>

             </div>
            <div className="modal-body">
              {directory.link ? <input type="text" className="form-control form-control-sm" value={directory.link || ''} readOnly/> : ''}
              {directory.link ?
                <span><i className="material-icons text-secondary float-left">link</i><p
                  className="lead lead-modified float-left"><strong>Anyone</strong> with this <strong>link</strong> can download this directory.</p></span> :
                <span><i className="material-icons text-secondary float-left">link</i><p className="lead lead-modified float-left"><strong>No</strong> link created yet.</p><p
                  className="lead lead-modified float-right"><a href="" data-dismiss="modal" onClick={(e) => {
                  e.preventDefault();
                  handleCreateShareLinkDirectory(directory._id);
                  if (!this.props.content.error) {
                    directory.link = this.props.content.alert;
                  }
                }}>Create</a> a shareable link.</p></span>}
            </div>

              <div className="modal-footer">
           <button type="button" className="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>
             <button type="button" className="btn btn-primary btn-sm" data-dismiss="modal" onClick={(e) => {
               let sharers = this.state.sharers.split(',');
               handleDirectoryShare({
                 _id: directory._id,
                 name: directory.name,
                 path: directory.path,
                 owner: directory.owner,
                 sharers: sharers,
               });
             }}>Share</button>
            </div>

            </div>
            </div>
          </div>
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
                              userId: directory.owner,
                            });
                          }}>Download</a>
                          <a className="dropdown-item" href="" onClick={(e) => {
                            e.preventDefault();
                            handleDeleteDirectory({
                              name: directory.name,
                              path: directory.path,
                              _id: directory._id,
                            });
                            if (!this.props.content.error) {
                              this.props.content.directories.splice(key, 1);
                            }
                          }}>Delete</a>
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
    handleAlert: () => dispatch(toggleAlert()),
    handleDownloadDirectory: (data) => dispatch(downloadDirectory(data)),
    handleStarDirectory: (data) => dispatch(starDirectory(data)),
    handleDeleteDirectory: (data) => dispatch(deleteDirectory(data)),
    handleGetFiles: (path) => dispatch(getFiles(path)),
    handleGetDirectories: (path) => dispatch(getDirectories(path)),
    handleChangePath: (path) => dispatch(changePath(path)),
    handleGetStarredFiles: () => dispatch(getStarredFiles()),
    handleGetStarredDirectories: () => dispatch(getStarredDirectories()),
    handleGetActivities: (count) => dispatch(getActivities(count)),
    handleCreateShareLinkDirectory: (data) => dispatch(createShareLinkDirectory(data)),
    handleDirectoryShare: (data) => dispatch(shareDirectory(data)),
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
