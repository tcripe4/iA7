import React from 'react';
import CreateAccountDialog from './CreateAccountDialog.js';
import AppMode from "./../AppMode.js";

class LoginPage extends React.Component {

constructor() {
    super();
    //Create a ref for the email input DOM element
    this.emailInputRef = React.createRef();
    this.passwordInputRef = React.createRef();
    this.state = {newAccountCreated: false,
                  loginBtnIcon: "fa fa-sign-in",
                  loginBtnLabel: "Log In",
                  showCreateAccount: false,
                  showResetPassword: false,
                  showLookupAccount: false,
                  showSecurityQuestion: false,
                  showPasswordReset: false,
                  created: true
                  };
    // Reset Password
    this.accountEmailRef = React.createRef();
    this.securityAnswerRef = React.createRef();
    // Edit Account
    
} 
    
//Focus cursor in email input field when mounted
componentDidMount() {
    this.emailInputRef.current.focus();
}  

//handleLogin -- Callback function that sets up initial app state upon login.
handleLogin = () => {
    //Stop spinner
    this.setState({loginBtnIcon: "fa fa-sign-in",
                loginBtnLabel: "Log In"});
    //Set current user
    this.props.setUser({id: this.emailInputRef.current.value,
        username:  this.emailInputRef.current.value,
        provider: "local",
        profileImageUrl: `https://www.gravatar.com/avatar/${md5(this.emailInputRef.current.value)}`});
    this.props.setAuthenticated(true);
    //this.props.setUserId(this.emailInputRef.current.value);
    //Trigger switch to FEED mode (default app landing page)
    this.props.changeMode(AppMode.FEED);
}


//handleLoginSubmit -- Called when user clicks on login button. Initiate spinner
//for 1 second and call handleLogin to do the work.
handleLoginSubmit = (event) => {
        event.preventDefault();
        //this.setState({loginBtnIcon: "fa fa-spin fa-spinner",
                     //   loginBtnLabel: "Logging In..."});
        this.setState({loginBtnIcon: "fa fa-spin fa-spinner",
    loginBtnLabel: "Logging In..."});
      const url = "/auth/login?username=" + this.emailInputRef.current.value +
                  "&password=" + this.passwordInputRef.current.value;
      const res = await fetch(url, {method: 'POST'}); 
      if (res.status == 200) { //successful login!
          //Force componentDidMount to execute.
          //authenticated state will be updated and 
          //Session will be deserialized.
          window.open("/","_self");
      } else { //Unsuccessful login
        //Grab textual error message
        const resText = await res.text();
        //Display error message for 3 seconds and invite another login attempt
        this.setState({loginBtnIcon: "fa fa-sign-in",
                       loginBtnLabel: "Log In",
                       loginMsg: resText}, () => setTimeout(this.handleLogin,1000));
      }
        //Initiate spinner for 1 second
        //setTimeout(this.handleLogin,1000);
}

handleOAuthLogin = (provider) => {
    window.open(`/auth/${provider}`,"_self");
}

handleOAuthLoginClick = (provider) => {
    this.setState({[provider + "Icon"] : "fa fa-spin fa-spinner",
                   [provider + "Label"] : "Connecting..."});
    setTimeout(() => this.handleOAuthLogin(provider),1000);
 }

//handleLoginChange -- Check the validity of the username (email address)
//password entered into the login page, setting the customValidity message 
//appropriately. 
handleLoginChange = () => {
    let thisUser = this.emailInputRef.current.value;
    let data = JSON.parse(localStorage.getItem(thisUser));
    //Check username and password:
    if (data == null) { 
        this.emailInputRef.current.setCustomValidity("No account with this email address exists. Choose 'Create an account'.");
        return; //Exit the function; no need to check pw validity
    } else {
        this.emailInputRef.current.setCustomValidity("");
    }
    if (data.password != this.passwordInputRef.current.value) {
        this.passwordInputRef.current.setCustomValidity("The password you entered is incorrect. Please try again or choose 'Reset your password'.");
    } else {
        this.passwordInputRef.current.setCustomValidity("");
    }
}

//newAccountCreated -- Called by child CreateAccountDialog component when new user account
//successfully created. Hide the dialog and display a message inviting user to log in
//with new credentials.
newAccountCreated = () => {
    this.setState({newAccountCreated: true,
                    showCreateAccount: false});
}

//cancelCreateAccount -- Called by child CreateAccountDialog componenet when user decides
//to cancel creation of new account by clicking the "X" in top-right of dialog.
cancelCreateAccount = () => {
    this.setState({showCreateAccount: false});
}

// renderLookupAccount-- Present a dialog box for user to enter the email address associated with
// their account in case where they want to reset password
renderLookupAccount = () => {
    return (
        <div id="lookupModal" className="modal" role="dialog">
        <div className="modal-dialog modal-lg">
        <div className="modal-content">
        <div className="modal-header">
        <h3 className="modal-title"><b>Lookup Account</b>
            <button id="modalClose" className="close" onClick={() => {this.setState({showLookupAccount: false})}}>&times;</button>
        </h3>
        </div>
        <div className="modal-body">
        <form onSubmit={this.handleLookupAccount}>
        <label>
            Account Email Address:
            <input 
            className="form-control form-text"
            type="email"
            size="35"
            placeholder="Enter Email Address"
            pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
            ref={this.accountEmailRef}
            required={true}
            />
        </label>
        <button type="submit" className="btn btn-primary btn-color-theme form-submit-btn">
            <span className="fa fa-search" onClick={this.handleLookupAccount}></span>&nbsp;Look Up Account</button>
        </form>
        </div></div></div></div>
    );
}

handleLookupAccount = async (event) => {
    event.preventDefault();
    let thisUser = "/users/" + this.accountEmailRef.current.value;
    let res = await fetch(url, {method: 'GET'});
    let data = JSON.parse(localStorage.getItem(this.props.userId));
    // if (data == null || !data.hasOwnProperty(thisUser)) { 
    //     alert("Whoops! No account found.");
    //     this.accountEmailRef.current.focus();
    // } 
    if (res.status != 200) {
        alert("Sorry, there is no account associated with that email address.");
        this.accountEmailRef.current.focus();
        return;
    } 
    else {
        this.setState({resetEmail: thisUser, 
                       resetQuestion: data[thisUser].accountInfo.securityQuestion,
                       resetAnswer: data[thisUser].accountInfo.securityAnswer,
                       showLookUpAccount: false, 
                       showSecurityQuestion: true});
        this.emailInputRef.current.value = "";
    }
}

renderSecurityQuestion = () => {
    return (
        <div id="securityQuestionModal" className="modal" role="dialog">
        <div className="modal-dialog modal-lg">
        <div className="modal-content">
        <div className="modal-header">
        <h3 className="modal-title"><b>Answer Security Question</b>
        <button className="close-modal-button" 
            onClick={() => {this.setState({resetEmail: "", 
                            resetQuestion: "",
                            resetAnswer: "",
                            showSecurityQuestion: false})}}>&times;</button>
        </h3>
        </div>
        <div className="modal-body">
        <form onSubmit={this.handleSecurityQuestion}>
        <label>
            Security Question: 
            <textarea
            readOnly={true}
            value={this.state.resetQuestion}
            className="form-control form-text"
            rows="3"
            cols="35"
            />
        </label>
        <label>
            Security Answer: 
            <textarea
            className="form-control form-text"
            placeholder="Enter Security Question Answer"
            ref={this.securityAnswerRef}
            rows="3"
            cols="35"
            />
        </label>
        <button role="submit" className="btn btn-primary btn-color-theme form-submit-btn">
            <span className="fa fa-check"></span>&nbsp;Verify Answer
        </button>
        </form>
        </div></div></div></div>
    );
}

handleSecurityQuestion = () => {
    let response = this.securityAnswerRef.current.value;
    if (response != this.state.resetAnswer) { 
        alert("Incorrect answer, please try again.");
        this.securityAnswerRef.current.select();
    } 
    else {
        this.setState({showSecurityQuestion: false, 
                       showPasswordReset: true});
    }
}

handlePasswordReset = (event) => {
    event.preventDefault();
    if (this.resetPasswordRef.current.value != this.resetPasswordRepeatRef.current.value) { 
        alert("Sorry, The passwords you entered do not match. Please try again.");
        this.resetPasswordRepeatRef.current.select();
    } 
    else {
        let data = JSON.parse(localStorage.getItem(this.props.userId));
        data[this.state.resetEmail].accountInfo.password = this.resetPasswordRef.current.value;
        localStorage.setItem(this.props.userId,JSON.stringify(data));
        this.props.setUserId(this.state.resetEmail);
        this.props.changeMode(AppMode.DATA);
        this.setState({resetEmail: "", 
                       resetQuestion: "",
                       resetAnswer: "",
                       showPasswordReset: false});
    }
}

renderPasswordReset = () => {
    return (
        <div className="modal" role="dialog">
        <div className="modal-dialog modal-lg">
        <div className="modal-content">
        <div className="modal-header">
        <h3 className="modal-title"><b>Reset Password</b>
        <button className="close-modal-button" 
            onClick={() => {this.setState({resetEmail: "", 
                            resetQuestion: "",
                            resetAnswer: "",
                            showResetPassword: false})}}>&times;</button>
        </h3></div>
        <div className="modal-body">
        <form onSubmit={this.handlePasswordReset}>
        <label>
            New Password: 
            <input
            type="password"
            placeholder="Enter new password"
            pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
            className="form-control form-text"
            ref={this.resetPasswordRef}
            />
        </label>
        <label>
            Repeat New Password: 
            <input
            type="password"
            placeholder="Repeat new password"
            className="form-control form-text"
            ref={this.resetPasswordRepeatRef}
            />
        </label>
        <button role="submit" className="btn btn-primary btn-color-theme form-submit-btn">
            <span className="fa fa-key"></span>&nbsp;Reset Password
        </button>
        </form>
        </div></div></div></div>
    );
}



render() {
    return(
        <div id="login-mode-div" className="padded-page">
        <center>
            <h1 />
            {this.state.newAccountCreated ? <p className="emphasis">New account created! Enter credentials to log in.</p> : null}
            <form id="loginInterface" onSubmit={this.handleLoginSubmit} onChange={this.handleLoginChange}>
            <label htmlFor="emailInput" style={{ padding: 0, fontSize: 24 }}>
                Email:
                <input
                ref={this.emailInputRef}
                className="form-control login-text"
                type="email"
                placeholder="Enter Email Address"
                id="emailInput"
                pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
                required={true}
                />
            </label>
            <p />
            <label htmlFor="passwordInput" style={{ padding: 0, fontSize: 24 }}>
                Password:
                <input
                ref={this.passwordInputRef}
                className="form-control login-text"
                type="password"
                placeholder="Enter Password"
                pattern="[A-Za-z0-9!@#$%^&*()_+\-]+"
                required={true}
                />
            </label>
            <p className="bg-danger" id="feedback" style={{ fontSize: 16 }} />
            <button
                type="submit"
                className="btn-color-theme btn btn-primary btn-block login-btn">
                <span id="login-btn-icon" className={this.state.loginBtnIcon}/>
                &nbsp;{this.state.loginBtnLabel}
            </button>
            <p>
            <button type="button" className="btn btn-link login-link" 
                    onClick={() => {this.setState({showCreateAccount: true});}}>Create an account
            </button> | 
            <button type="button" className="btn btn-link login-link"
                    onClick={() => {this.setState({showLookupAccount: true});}}>Reset your password
            </button>
            </p>  
            <p></p>
            <button type="button" className="btn btn-github"
               onClick={() => this.handleOAuthLoginClick("github")}>
              <span className={this.state.githubIcon}></span>&nbsp;{this.state.githubLabel}
            </button>
        <p></p>
            <p>
                <i>Version CptS 489</i>
            </p>
            </form>
            {this.state.showCreateAccount ? <CreateAccountDialog 
                newAccountCreated={this.newAccountCreated}
                cancelCreateAccount={this.cancelCreateAccount}
                created={this.state.created} /> : null}
            {this.state.showLookupAccount ? this.renderLookupAccount() : null}
            {this.state.showSecurityQuestion ? this.renderSecurityQuestion() : null}
            {this.state.showPasswordReset ? this.renderPasswordReset() : null}
        </center>
        </div>
    )
}
}


export default LoginPage;
