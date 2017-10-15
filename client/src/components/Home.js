import React, {Component} from 'react';
import {connect} from "react-redux";
import {getActivities, getStarredDirectories, getStarredFiles} from "../actions/content";
import Directory from "./Directory";
import File from "./File";
import Activity from "./Activity";

class Home extends Component {

  componentWillMount() {
    if (this.props.user.status !== 'authenticated' || !this.props.user.userId || this.props.user.error) {
      this.props.history.push('/login');
    } else {
      this.props.handleGetStarredFiles();
      this.props.handleGetStarredDirectories();
      this.props.handleGetActivities(5);
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
    } else if (this.props.board !== prevProps.board) {
      this.props.history.push('/');
    } else if (this.props.content.alert !== prevProps.content.alert) {
      this.props.handleGetStarredFiles();
      this.props.handleGetStarredDirectories();
      this.props.handleGetActivities(5);
    }
  }

  render() {
    return (
      <div className="col-9" id="main-content-left">
        <div id="starred-head">
          <p className="lead lead-modified"><strong>Starred</strong></p>
          <hr/>
          <div id="starred-content">
              <div className="alert alert-light border rounded text-center" role="alert">
                When you star files & directories, they will appear here.
              </div>

            {this.props.content.starredDirectories ?
              this.props.content.starredDirectories.map((directory, index) => {
                return (<Directory key={index} directory={directory} history={this.props.history}/>);
              }) : ''
            }
            {this.props.content.starredFiles ?
              this.props.content.starredFiles.map((file, index) => {
                return (<File key={index} file={file} history={this.props.history}/>);
              }) : ''
            }

          </div>
        </div>
        <div id="recent-head" className="mt-5">
          <p className="lead lead-modified"><strong>Recent Activity</strong></p>
          <hr/>
          <div id="recent-content">
            <div className="alert alert-light border rounded text-center" role="alert">
              Your recent activities will appear here.
            </div>
            {this.props.content.activities ?
              this.props.content.activities.map((activity, index) => {
                return (<Activity key={index} activity={activity} history={this.props.history}/>);
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
