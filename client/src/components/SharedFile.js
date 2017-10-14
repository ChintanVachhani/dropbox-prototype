import React, {Component} from 'react';
import {connect} from "react-redux";
import {signout} from "../actions/user";

class SharedFile extends Component {

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
    //const {handleSharedFileUpload} = this.props;
    return (
      <div>
        <div className="file-div clearfix">
          <i
            className="material-icons file-icon">insert_drive_file</i><span>&nbsp;&nbsp;New File&nbsp;&nbsp;</span><span
          className="float-right"><i className="material-icons star-icon text-primary">star_border</i>&nbsp;&nbsp;&nbsp;&nbsp;
          <a className="btn btn-light btn-sm share-btn" href="#" role="button">Share</a>&nbsp;&nbsp;&nbsp;&nbsp;
          <span className="dropdown show clearfix">
                        <a className="btn text-center option-icon-btn" href="#" role="button"
                           data-toggle="dropdown"
                           aria-haspopup="true" aria-expanded="false">
                          <i className="material-icons option-icon text-secondary">more_horiz</i>
                        </a>

                        <span className="dropdown-menu dropdown-menu-right mt-2">
                          <a className="dropdown-item" href="#">Download</a>
                          <a className="dropdown-item" href="#">Star</a>
                          <a className="dropdown-item" href="#">Delete</a>
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
  return {};
}

function mapStateToProps(state) {
  return {
    user: state.user,
    board: state.board,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SharedFile);
