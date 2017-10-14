import React, {Component} from 'react';
import {connect} from "react-redux";
import {signout} from "../actions/user";

class Options extends Component {

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
    const {handleFileUpload} = this.props;
    return (
      <div className="col-3 d-none d-sm-none d-md-none d-lg-block d-xl-block" id="main-content-right">
        {this.props.board.toLoad === 'account' ? '' : <form>
          <div className="form-group">
            <label className="btn btn-primary btn-sm btn-block" role="button">Upload File<input type="file" id="upload-file-btn"/></label>
          </div>
        </form>}
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

export default connect(mapStateToProps, mapDispatchToProps)(Options);
