import React, {Component} from 'react';
import {connect} from "react-redux";
import {loadingError} from "../actions/board";
import Navigation from "./Navigation";
import Header from "./Header";
import Home from "./Home";
import Content from "./Content";
import Account from "./Account";
import Options from "./Options";
import Sharing from "./Sharing";

class Board extends Component {

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
    const {handleLoadingError} = this.props;
    return (
      <div className="container-fluid fill">
        <div className="row fill">
          <Navigation history={this.props.history}/>
          <div className="col col-md-10 col-lg-10 col-xl-10 ml-auto" id="main-body">
            <div className="row">
              <Header history={this.props.history}/>
            </div>
            <div className="row fill mt-5">
              {this.props.board.toLoad === 'home' ? <Home history={this.props.history}/> : ''}
              {this.props.board.toLoad === 'files' ? <Content history={this.props.history}/> : ''}
              {this.props.board.toLoad === 'account' ? <Account history={this.props.history}/> : ''}
              {this.props.board.toLoad === 'sharing' ? <Sharing history={this.props.history}/> : ''}
              <Options history={this.props.history}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleLoadingError: () => dispatch(loadingError()),
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
    board: state.board,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
