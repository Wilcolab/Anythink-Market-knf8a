import React from "react";
import { Link } from "react-router-dom";
import logo from "../imgs/topbar_logo.png";

const LoggedOutView = () => {
  return (
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <Link to="/login" className="nav-link">
          Sign in
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/register" className="nav-link">
          Sign up
        </Link>
      </li>
    </ul>
  );
};

const LoggedInView = (props) => {
  return (
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <Link to="/editor" className="nav-link">
          <i className="ion-compose"></i>&nbsp;New Item
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/settings" className="nav-link">
          <i className="ion-gear-a"></i>&nbsp;Settings
        </Link>
      </li>

      <li className="nav-item">
        <Link to={`/@${props.currentUser.username}`} className="nav-link">
          <img
            src={props.currentUser.image}
            className="user-pic pr-1"
            alt={props.currentUser.username}
          />
          {props.currentUser.username}
        </Link>
      </li>
    </ul>
  );
};

class Header extends React.Component {
  render() {
    return (
      <nav
        className="navbar navbar-expand-md navbar-dark"
        style={{ padding: "0.5rem 2rem" }}
      >
        <Link to="/" className="navbar-brand">
          <img alt="logo" src={logo} />
        </Link>

        {this.props.currentUser ? (
          <LoggedInView currentUser={this.props.currentUser} />
        ) : (
          <LoggedOutView currentUser={this.props.currentUser} />
        )}
      </nav>
    );
  }
}

export default Header;
