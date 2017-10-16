import React, {Component} from 'react';
import {connect} from "react-redux";

class Activity extends Component {

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
    }
  }

  render() {
    const {key, activity} = this.props;
    const colorClass = activity.log.split(' ')[0] === 'Toggled' ? 'text text-info' : (
      activity.log.split(' ')[0] === 'Deleted' ? 'text text-danger' : (
        activity.log.split(' ')[0] === 'Downloaded' ? 'text text-warning' : (
          activity.log.split(' ')[0] === 'Uploaded' ? 'text text-success' : (
            activity.log.split(' ')[0] === 'Created' ? 'text text-secondary' : ''
          )
        )
      ));

    return (
      <div>
        <div className="activity-div clearfix">
          <p className="lead lead-modified"><span className={colorClass}>&nbsp;&nbsp;{activity.log}&nbsp;&nbsp;</span></p>
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
    content: state.content,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
