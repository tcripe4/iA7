import React from 'react';
import NavBar from './NavBar.js';
import SideMenu from './SideMenu.js';
import ModeBar from './ModeBar.js';
import FloatingButton from './FloatingButton.js';
import LoginPage from './LoginPage.js';
import AppMode from "./../AppMode.js"
import FeedPage from './FeedPage.js';
import Rounds from './Rounds.js';
import CoursesPage from './CoursesPage.js';
import AboutBox from './AboutBox.js';
import ConstructionPage from './ConstructionPage.js'

const modeTitle = {};
modeTitle[AppMode.LOGIN] = "Welcome to SpeedScore";
modeTitle[AppMode.FEED] = "Activity Feed";
modeTitle[AppMode.ROUNDS] = "My Rounds";
modeTitle[AppMode.ROUNDS_LOGROUND] = "Log New Round";
modeTitle[AppMode.ROUNDS_EDITROUND] = "Edit Round";
modeTitle[AppMode.COURSES] = "Courses";
modeTitle[AppMode.CONSTRUCTION] = "Under Construction";

const modeToPage = {};
modeToPage[AppMode.LOGIN] = LoginPage;
modeToPage[AppMode.FEED] = FeedPage;
modeToPage[AppMode.ROUNDS] = Rounds;
modeToPage[AppMode.ROUNDS_LOGROUND] = Rounds;
modeToPage[AppMode.ROUNDS_EDITROUND] = Rounds;
modeToPage[AppMode.COURSES] = CoursesPage;
modeToPage[AppMode.CONSTRUCTION] = ConstructionPage;


class App extends React.Component {

  constructor() {
    super();
    this.state = {mode: AppMode.LOGIN,
                  menuOpen: false,
                  user: "",
                  showAbout: false,
                  setAuthenticated: false,
                  editAccount: false,
                  editAccountSuccess: false}
  }

  handleChangeMode = (newMode) => {
    this.setState({mode: newMode});
  }

  openMenu = () => {
    this.setState({menuOpen : true});
  }
  
  closeMenu = () => {
    this.setState({menuOpen : false});
  }

  toggleMenuOpen = () => {
    this.setState(prevState => ({menuOpen: !prevState.menuOpen}));
  }

  setUserId = (Id) => {
    this.setState({userId: Id});
  }

  toggleAbout = () => {
    this.setState(prevState => ({showAbout: !prevState.showAbout}))
  }

  editAccount = () => {
    this.setState({editAccount: true});
  }

  editAccountCancel = () => {
    this.setState({editAccount: false});
  }

  editAccountSuccess = () => {
    this.setState({editAccount: false, editAccountSuccess: true});
  }

  closeEditAccountSuccess = () => {
    this.setState({editAccountSuccess: false});
  }

  setUser = (userObj) => {
    this.setState({user: userObj});
  }

  setAuthenticated = (auth) => {
    this.setState({authenticated: auth});
  }

  render() {
    const ModePage = modeToPage[this.state.mode];
    return (
      <div>
        <NavBar 
          title={modeTitle[this.state.mode]} 
          mode={this.state.mode}
          changeMode={this.handleChangeMode}
          menuOpen={this.state.menuOpen}
          toggleMenuOpen={this.toggleMenuOpen}/>
        <SideMenu 
          menuOpen = {this.state.menuOpen}
          mode={this.state.mode}
          toggleMenuOpen={this.toggleMenuOpen}
          userId={this.state.userId}
          changeMode={this.handleChangeMode}
          toggleAbout={this.toggleAbout}
          logOut={() => this.handleChangeMode(AppMode.LOGIN)}/>
        <ModeBar 
          mode={this.state.mode} 
          changeMode={this.handleChangeMode}
          menuOpen={this.state.menuOpen}/>
        <ModePage 
          menuOpen={this.state.menuOpen}
          mode={this.state.mode}
          changeMode={this.handleChangeMode}
          user={this.state.user}
          // userID, setUserId
          setUser={this.setUser}/>
        {this.state.showAbout ? <AboutBox hideAbout={this.toggleAbout} /> : null}
        
      </div>
    );  
  }
}

export default App;