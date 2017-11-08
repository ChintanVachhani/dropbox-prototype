import React, {Component} from 'react';
import {connect} from "react-redux";
import {getAccount, updateAccount, getActivities} from "../actions/account";
import PieChart from 'react-simple-pie-chart';

class Account extends Component {

  state = {
    user: {
      email: '',
      firstName: '',
      lastName: '',
      work: '',
      education: '',
      address: '',
      country: '',
      city: '',
      zipcode: '',
      interests: '',
    },
    isCompleted: false,
    editing: false,
    chart: {
      deleted: '',
      uploaded: '',
      downloaded: '',
      created: '',
      starred: '',
    },
  };

  componentWillMount() {
    this.setState({
      user: {
        email: '',
        firstName: '',
        lastName: '',
        work: '',
        education: '',
        address: '',
        country: '',
        city: '',
        zipcode: '',
        interests: '',
      },
      isCompleted: false,
      editing: false,
      chart: {
        deleted: '',
        uploaded: '',
        downloaded: '',
        created: '',
        starred: '',
      },
    });
    if (this.props.user.status !== 'authenticated' || !this.props.user.userId || this.props.user.error) {
      this.props.history.push('/login');
    } else {
      this.props.handleGetAccount();
      this.props.handleGetActivities();
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (this.props.account.user && !this.state.editing) {
      this.setState({
        ...this.state,
        user: {
          email: this.props.account.user.email,
          firstName: this.props.account.user.firstName,
          lastName: this.props.account.user.lastName,
          work: this.props.account.user.work,
          education: this.props.account.user.education,
          address: this.props.account.user.address,
          country: this.props.account.user.country,
          city: this.props.account.user.city,
          zipcode: this.props.account.user.zipcode,
          interests: this.props.account.user.interests,
        },
      });
    }
    if (nextProps.user.status !== 'authenticated' || !nextProps.user.userId || nextProps.user.error) {
      this.props.history.push('/login');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.account.user && !this.state.editing) {
      this.setState({
        ...this.state,
        user: {
          email: this.props.account.user.email,
          firstName: this.props.account.user.firstName,
          lastName: this.props.account.user.lastName,
          work: this.props.account.user.work,
          education: this.props.account.user.education,
          address: this.props.account.user.address,
          country: this.props.account.user.country,
          city: this.props.account.user.city,
          zipcode: this.props.account.user.zipcode,
          interests: this.props.account.user.interests,
        },
      });
    }
    if (this.props.account.activities) {
      let deleted = 0;
      let uploaded = 0;
      let downloaded = 0;
      let created = 0;
      let starred = 0;
      this.props.account.activities.map((activity) => {
        activity.log.split(' ')[0] === 'Toggled' ? starred++ : (
          activity.log.split(' ')[0] === 'Deleted' ? deleted++ : (
            activity.log.split(' ')[0] === 'Downloaded' ? downloaded++ : (
              activity.log.split(' ')[0] === 'Uploaded' ? uploaded++ : (
                activity.log.split(' ')[0] === 'Created' ? created++ : ''
              )
            )
          ));
      });

      this.setState({
        ...this.state,
        chart: {
          deleted: deleted,
          uploaded: uploaded,
          downloaded: downloaded,
          created: created,
          starred: starred,
        },
      });
    }
    if (this.state.isCompleted) {
      if (this.props.user.status !== 'authenticated' || !this.props.user.userId || this.props.user.error) {
        this.props.history.push('/login');
      } else if (this.props.account !== prevProps.account) {
        this.props.history.push('/');
      }
    }
  }

  render() {
    const {handleAccountUpdate} = this.props;

    return (
      <div className="col-9" id="main-content-left">
        <ul className="nav nav-tabs" id="account-tab" role="tablist">
          <li className="nav-item">
            <a className="nav-link active" id="about-tab" data-toggle="tab" href="#about" role="tab" aria-controls="about"
               aria-expanded="true">About</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="life-cycle-tab" data-toggle="tab" href="#life-cycle" role="tab"
               aria-controls="life-cycle">Life Cycle</a>
          </li>
        </ul>
        <div className="tab-content" id="account-tab-content">
          <div className="tab-pane fade show active mt-3 mb-5" id="about" role="tabpanel" aria-labelledby="about-tab">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAccountUpdate(this.state.user);
              this.setState({...this.state, isCompleted: true, editing: false});
            }}>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label className="col-form-label">First Name</label>
                  <input type="text" className="form-control" id="firstName" placeholder="First Name" value={this.state.user.firstName}
                         onChange={(event) => {
                           this.setState({
                             ...this.state,
                             user: {...this.state.user, firstName: event.target.value},
                           });
                         }} readOnly={!this.state.editing}/>
                </div>
                <div className="form-group col-md-6">
                  <label className="col-form-label">Last Name</label>
                  <input type="text" className="form-control" id="lastName" placeholder="Last Name" value={this.state.user.lastName}
                         onChange={(event) => {
                           this.setState({
                             ...this.state,
                             user: {...this.state.user, lastName: event.target.value},
                           });
                         }} readOnly={!this.state.editing}/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-form-label">Email</label>
                <input type="text" className="form-control" id="email" placeholder="Email" readOnly value={this.state.user.email}/>
              </div>
              <div className="form-group">
                <label className="col-form-label">Address</label>
                <input type="text" className="form-control" id="address" placeholder="Address" value={this.state.user.address}
                       onChange={(event) => {
                         this.setState({
                           ...this.state,
                           user: {...this.state.user, address: event.target.value},
                         });
                       }} readOnly={!this.state.editing}/>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label className="col-form-label">Country</label>
                  <input type="text" className="form-control" id="country" placeholder="Country" value={this.state.user.country}
                         onChange={(event) => {
                           this.setState({
                             ...this.state,
                             user: {...this.state.user, country: event.target.value},
                           });
                         }} readOnly={!this.state.editing}/>
                </div>
                <div className="form-group col-md-4">
                  <label className="col-form-label">City</label>
                  <input type="text" className="form-control" id="city" placeholder="City" value={this.state.user.city}
                         onChange={(event) => {
                           this.setState({
                             ...this.state,
                             user: {...this.state.user, city: event.target.value},
                           });
                         }} readOnly={!this.state.editing}/>
                </div>
                <div className="form-group col-md-2">
                  <label className="col-form-label">Zip Code</label>
                  <input type="text" className="form-control" id="zipcode" placeholder="Zip Code" value={this.state.user.zipcode}
                         onChange={(event) => {
                           this.setState({
                             ...this.state,
                             user: {...this.state.user, zipcode: event.target.value},
                           });
                         }} readOnly={!this.state.editing}/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-form-label">Work</label>
                <input type="text" className="form-control" id="work" placeholder="Work" value={this.state.user.work}
                       onChange={(event) => {
                         this.setState({
                           ...this.state,
                           user: {...this.state.user, work: event.target.value},
                         });
                       }} readOnly={!this.state.editing}/>
              </div>
              <div className="form-group">
                <label className="col-form-label">Education</label>
                <input type="text" className="form-control" id="education" placeholder="Education" value={this.state.user.education}
                       onChange={(event) => {
                         this.setState({
                           ...this.state,
                           user: {...this.state.user, education: event.target.value},
                         });
                       }} readOnly={!this.state.editing}/>
              </div>
              <div className="form-group">
                <label className="col-form-label">Interests</label>
                <input type="text" className="form-control" id="interests-tags"
                       placeholder="Interests ( eg: music, sports, ... )" value={this.state.user.interests}
                       onChange={(event) => {
                         this.setState({
                           ...this.state,
                           user: {...this.state.user, interests: event.target.value},
                         });
                       }} readOnly={!this.state.editing}/>
              </div>
              <button type="button" className="btn btn-secondary btn-sm" onClick={(e) => {
                e.preventDefault();
                this.setState({
                  ...this.state,
                  editing: true,
                })
              }}>Edit
              </button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <button type="submit" className="btn btn-primary btn-sm" disabled={!this.state.editing}>Update</button>
            </form>
          </div>
          <div className="tab-pane fade" id="life-cycle" role="tabpanel" aria-labelledby="life-cycle-tab">
            <div className="mt-5">
            <span className="badge badge-info">Starred</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span className="badge badge-danger">Deleted</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span className="badge badge-warning">Downloaded</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span className="badge badge-success">Uploaded</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {/*<span className="badge badge-primary">Primary</span>*/}
            <span className="badge badge-secondary">Created</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
            <PieChart
              slices={[
                {
                  color: '#dc3545',
                  value: Number(this.state.chart.deleted),
                },
                {
                  color: '#28a745',
                  value: Number(this.state.chart.uploaded),
                },
                {
                  color: '#17a2b8',
                  value: Number(this.state.chart.starred),
                },
                {
                  color: '#ffc107',
                  value: Number(this.state.chart.downloaded),
                },
                {
                  color: '#868e96',
                  value: Number(this.state.chart.created),
                },
              ]}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleGetAccount: () => dispatch(getAccount()),
    handleAccountUpdate: (data) => dispatch(updateAccount(data)),
    handleGetActivities: () => dispatch(getActivities()),
  };
}

function mapStateToProps(state) {
  return {
    user: state.user,
    account: state.account,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
