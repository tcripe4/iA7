import React from 'react';
import AppMode from './../AppMode.js'
import CreateAccountDialog from './CreateAccountDialog.js';

class SideMenu extends React.Component {

constructor() {
  super();
  this.state = {showCreateAccount: false, created: false};
}

//renderModeItems -- Renders correct subset of mode menu items based on
//current mode, which is stored in this.prop.mode. Uses switch statement to
//determine mode.
renderModeMenuItems = () => {
  switch (this.props.mode) {
    case AppMode.FEED:
      return(
        <div>
        <a className="sidemenu-item">
            <span className="fa fa-users"></span>&nbsp;Followed Users</a>
        <a className="sidemenu-item ">
            <span className="fa fa-search"></span>&nbsp;Search Feed</a>
        </div>
      );
    break;
    case AppMode.ROUNDS:
      return(
        <div>
          <a className="sidemenu-item">
            <span className="fa fa-plus"
            onClick={ () => this.props.changeMode(AppMode.ROUNDS_LOGROUND) }></span>&nbsp;Log New Round</a>
          <a className="sidemenu-item">
            <span className="fa fa-search"></span>&nbsp;Search Rounds</a>
        </div>
      );
    break;
    case AppMode.COURSES:
      return(
        <div>
        <a className="sidemenu-item">
            <span className="fa fa-plus"></span>&nbsp;Add a Course</a>
        <a className="sidemenu-item">
            <span className="fa fa-search"></span>&nbsp;Search Courses</a>
        </div>
      );
    break;
    case AppMode.CONSTRUCTION:
      return(
        <div>
          <a className="sidemenu-item">
            <span className="fa fa-wrench"></span>&nbsp;under construction</a>
          <a className="menuItem">
            <span className="fa fa-wrench"></span>&nbsp;under construction</a>
        </div>
      );
    default:
        return null;
    }
}

    render() {
       return (
        <div className={"sidemenu " + (this.props.menuOpen ? "sidemenu-open" : "sidemenu-closed")}
             onClick={this.props.toggleMenuOpen}>
          {/* SIDE MENU TITLE */}
          <div className="sidemenu-title">
              <img src='http://tiny.cc/chrisprofilepic' height='50' width='50' />
              <span id="userID" className="sidemenu-userID">&nbsp;{this.props.userId}</span>
          </div>
          {/* MENU CONTENT */}
          {this.renderModeMenuItems()}
          {/* The following menu items are present regardless of mode */}
          <a id="accountBtn" className="sidemenu-item" onClick={() => {this.setState({showCreateAccount: true});}}>
            <span className="fa fa-user" ></span>&nbsp;Account</a>
          <a id="aboutBtn" className="sidemenu-item" onClick={this.props.toggleAbout}>
            <span className="fa fa-info-circle" ></span>&nbsp;About</a>
          <a id="logOutBtn" className="sidemenu-item" onClick={this.props.logOut}>
            <span className="fa fa-sign-out-alt"></span>&nbsp;Log Out</a>
          {this.state.showCreateAccount ? <CreateAccountDialog 
              newAccountCreated={this.newAccountCreated}
              cancelCreateAccount={this.cancelCreateAccount}
              created={this.state.created} /> : null}
        </div>
       );
    }
}

export default SideMenu;