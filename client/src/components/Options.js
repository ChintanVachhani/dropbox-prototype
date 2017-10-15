import React, {Component} from 'react';
import {connect} from "react-redux";
import {createDirectory, getDirectories, getFiles, uploadFile} from "../actions/content";
import {loadFiles} from "../actions/board";

class Options extends Component {

  state = {
    folderName: '',
  };

  componentWillMount() {
    this.setState({
      folderName: '',
    });
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
    } else if (this.props.content.alert !== prevProps.content.alert) {
      let path = this.props.board.currentPath;
      this.props.handleGetFiles(path);
      this.props.handleGetDirectories(path);
    }
  }

  render() {
    const {handleFileUpload, handleDirectoryCreate, handleLoadFiles} = this.props;
    return (
      <div className="col-3 d-none d-sm-none d-md-none d-lg-block d-xl-block text-center" id="main-content-right">
        {this.props.board.toLoad === 'account' || this.props.board.toLoad === 'sharing' ? '' :
          <div>
            <form>
              <div className="form-group">
                <label className="btn btn-primary btn-sm btn-block">Upload file<input type="file" id="upload-file-btn" onChange={
                  (e) => {
                    handleFileUpload({
                      file: e.target.files[0],
                      path: this.props.board.currentPath,
                      owner: localStorage.getItem('userId'),
                    });
                    handleLoadFiles();
                  }
                }/></label>
              </div>
            </form>
            <span className="text-primary"><a href="" data-toggle="modal" data-target="#folder-name"><i
              className="material-icons text-primary new-folder-icon">folder_open</i>&nbsp;New folder</a></span>

            <div className="modal center fade" id="folder-name" tabIndex="-1" role="dialog" aria-labelledby="folder-name-label" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="folder-name-label"><i className="material-icons folder-icon">folder</i></h5>
                    <input type="text" className="form-control mx-1" placeholder="Folder name" value={this.state.folderName} onChange={(e) => {
                      e.preventDefault();
                      this.setState({
                        folderName: e.target.value,
                      });
                    }
                    }/>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary btn-sm" data-dismiss="modal" onClick={(e) => {
                      e.preventDefault();
                      handleDirectoryCreate({
                        name: this.state.folderName,
                        path: this.props.board.currentPath,
                        owner: localStorage.getItem('userId'),
                      });
                      handleLoadFiles();
                    }}>Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleFileUpload: ({file, path, owner}) => {
      let data = new FormData();
      data.append('file', file);
      data.append('path', path);
      data.append('owner', owner);
      dispatch(uploadFile(data));
    },
    handleDirectoryCreate: (data) => dispatch(createDirectory(data)),
    handleGetFiles: (path) => dispatch(getFiles(path)),
    handleGetDirectories: (path) => dispatch(getDirectories(path)),
    handleLoadFiles: () => {
      dispatch(loadFiles())
    },
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
    board: state.board,
    content: state.content,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Options);
