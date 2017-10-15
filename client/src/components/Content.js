import React, {Component} from 'react';
import {connect} from "react-redux";
import {getFiles, getDirectories} from "../actions/content";
import File from "./File";
import Directory from "./Directory";

class Content extends Component {

  componentWillMount() {
    if (this.props.user.status !== 'authenticated' || !this.props.user.userId || this.props.user.error) {
      this.props.history.push('/login');
    } else{
      let path = this.props.board.currentPath;
      this.props.handleGetFiles(path);
      this.props.handleGetDirectories(path);
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
    return (
      <div className="col-9" id="main-content-left">
        <div id="files-head">
          <p className="lead lead-modified">Name</p>
          <hr/>
          <div id="files-content">
            {this.props.content.directories ?
              this.props.content.directories.map((directory, index) => {
                return (<Directory key={index} directory={directory} history={this.props.history}/>);
              }) : ''
            }
            {this.props.content.files ?
              this.props.content.files.map((file, index) => {
                return (<File key={index} file={file} history={this.props.history}/>);
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
    handleGetFiles: (path) => dispatch(getFiles(path)),
    handleGetDirectories: (path) => dispatch(getDirectories(path)),
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
    board: state.board,
    content: state.content,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);
