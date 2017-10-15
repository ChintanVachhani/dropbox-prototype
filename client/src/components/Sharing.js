import React, {Component} from 'react';
import {connect} from "react-redux";
import {getFiles, getDirectories, listSharedFiles, listSharedDirectories} from "../actions/content";
import SharedFile from "./SharedFile";
import SharedDirectory from "./SharedDirectory";

class Sharing extends Component {

  componentWillMount() {
    if (this.props.user.status !== 'authenticated' || !this.props.user.userId || this.props.user.error) {
      this.props.history.push('/login');
    } else {
      this.props.handleListFiles();
      this.props.handleListDirectories();
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.user.status !== 'authenticated' || !nextProps.user.userId || nextProps.user.error) {
      this.props.history.push('/login');
    } else if (this.props.board !== nextProps.board || this.props.content !== nextProps.content) {
      this.props.history.push('/');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.user.status !== 'authenticated' || !this.props.user.userId || this.props.user.error) {
      this.props.history.push('/login');
    } else if (this.props.board !== prevProps.board || this.props.content !== prevProps.content) {
      this.props.history.push('/');
    }
  }

  render() {
    //const {handleAccountUpdate} = this.props;

    return (
      <div className="col-9" id="main-content-left">
        <ul className="nav nav-tabs" id="account-tab" role="tablist">
          <li className="nav-item">
            <a className="nav-link active" id="folders-tab" data-toggle="tab" href="#folders" role="tab" aria-controls="folders"
               aria-expanded="true">Folders</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="files-tab" data-toggle="tab" href="#files" role="tab"
               aria-controls="files">Files</a>
          </li>
        </ul>
        <div className="tab-content" id="account-tab-content">
          <div className="tab-pane fade show active mt-3 mb-5" id="folders" role="tabpanel" aria-labelledby="folders-tab">
            {this.props.content.sharedDirectories ?
              this.props.content.sharedDirectories.map((directory, index) => {
                return (<SharedDirectory key={index} directory={directory} history={this.props.history}/>);
              }) : ''
            }
          </div>
          <div className="tab-pane fade mt-3 mb-5" id="files" role="tabpanel" aria-labelledby="files-tab">
            {this.props.content.sharedFiles ?
              this.props.content.sharedFiles.map((file, index) => {
                return (<SharedFile key={index} file={file} history={this.props.history}/>);
              }) : ''
            }
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(Sharing);
