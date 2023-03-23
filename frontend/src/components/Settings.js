import ListErrors from "./ListErrors";
import React, { useCallback, useEffect, useState } from "react";
import agent from "../agent";
import { connect } from "react-redux";
import {
  SETTINGS_SAVED,
  SETTINGS_PAGE_UNLOADED,
  LOGOUT,
} from "../constants/actionTypes";

const SettingsForm = ({ currentUser, onSubmitForm }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser]);

  const updateState = useCallback((field) => (ev) => {
    const newState = Object.assign({}, user, { [field]: ev.target.value });
    setUser(newState);
  }, [user]);

  const submitForm = useCallback((ev) => {
    ev.preventDefault();
    const userToSubmit = { ...user };
    if (!userToSubmit.password) {
      delete userToSubmit.password;
    }
    onSubmitForm(userToSubmit);
  }, [user, onSubmitForm]);

  return (
    <form onSubmit={submitForm}>
      <fieldset>
        <fieldset className="form-group">
          <input
            className="form-control"
            type="text"
            placeholder="URL of profile picture"
            value={user.image}
            onChange={updateState("image")}
          />
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="text"
            placeholder="Username"
            value={user.username}
            onChange={updateState("username")}
          />
        </fieldset>

        <fieldset className="form-group">
          <textarea
            className="form-control form-control-lg"
            rows="8"
            placeholder="Short bio about you"
            value={user.bio}
            onChange={updateState("bio")}
          ></textarea>
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={updateState("email")}
          />
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="password"
            placeholder="New Password"
            value={user.password}
            onChange={updateState("password")}
          />
        </fieldset>

        <button
          className="btn btn-lg btn-primary pull-xs-right"
          type="submit"
        >
          Update Settings
        </button>
      </fieldset>
    </form>
  );
}

const mapStateToProps = (state) => ({
  ...state.settings,
  currentUser: state.common.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  onClickLogout: () => dispatch({ type: LOGOUT }),
  onSubmitForm: (user) =>
    dispatch({ type: SETTINGS_SAVED, payload: agent.Auth.save(user) }),
  onUnload: () => dispatch({ type: SETTINGS_PAGE_UNLOADED }),
});

class Settings extends React.Component {
  render() {
    return (
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>

              <ListErrors errors={this.props.errors}></ListErrors>

              <SettingsForm
                currentUser={this.props.currentUser}
                onSubmitForm={this.props.onSubmitForm}
              />

              <hr />

              <button
                className="btn btn-outline-danger"
                onClick={this.props.onClickLogout}
              >
                Or click here to logout.
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
