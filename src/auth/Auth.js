import React from "react";
import Restify from "../data/Restify";
import Sessify from "../data/Sessify";

// the context definition for authentication
export const AuthContext = React.createContext({
  state: null,
  user: null,
  login: () => {},
  logout: () => {},
  saveUser: () => {},
});


// rest paths
export const AuthRest = new Restify(process.env.REACT_APP_REST_HOST + "/v1/auth");
export const UsersRest = new Restify(process.env.REACT_APP_REST_HOST + "/v1/users");

// config
const REFRESH_INTERVAL_MIN = 10;

// the wrapper element to provide authentication
class Auth extends React.Component {

  refreshHandlerID = null;

  constructor(props) {
    super(props);

    // bindings
    this.refresh.bind(this);
    this.refreshToken.bind(this);
    this.startRefreshInterval.bind(this);
    this.stopRefreshInterval.bind(this);
    this.saveUser.bind(this);
    this.login.bind(this);
    this.logout.bind(this);

    // the state containing user object, login and logout callback
    this.state = {
      state: null,
      user: null,
      token: null,
      login: this.login.bind(this),
      logout: this.logout.bind(this),
      saveUser: this.saveUser.bind(this),
    };

  }

  /**
   * Save the user information. The user object must contain at least on editable field. Allowed fields are
   * email, name, avatar.
   * @param user - User object to be saved
   */
  saveUser(user) {
    // return promise
    return new Promise((resolve, reject) => {
      // reject when not logged in
      if(!this.state.user) {
        reject('User is not logged in');
        return;
      }
      // save user
      UsersRest
        .patch(user, {path: `/${this.state.user.id}`, token: this.state.token})
        .then(user => {
          // update user
          this.setState({user});
          // resolve
          resolve();
        })
        .catch(e => reject(e))
    });
  }


  /**
   * Login of the user (by email) with password
   * @param email - Email to identify user
   * @param password - Password to authenticate user
   * @return Promise
   */
  login(email, password) {
    // return promis
    return new Promise((resolve, reject) => {
      // unset state
      this.setState({state: 'loading'});
      // check, establish session and set user
      AuthRest.post({email: email, password: password}, {path: '/login'})
        .then(response => {
          // save token
          Sessify.createToken('refresh', response.tokens.refresh);
          // set user, token and state
          this.setState({
            user: response.user,
            token: response.tokens.access,
            state: null,
          });
          // set refresh interval
          this.startRefreshInterval();
          // resolve
          resolve();
        })
        .catch(e => {
          // logout user (delete user state and session)
          this.logout();
          // handle error
          reject(e);
        })
    })
  }


  /**
   * Logout of the user
   */
  logout() {
    // unset user
    Sessify.removeCookie('refresh');
    // unset interval
    this.stopRefreshInterval();
    // reset state
    this.setState({user: null, state: null});
  }

  /**
   * Refreshes the user based on the current access token
   * Resolves when the user is set.
   * @returns {Promise<>}
   */
  refreshUser() {
    return new Promise((resolve, reject) => {
      // set loading
      this.setState({state: 'loading'});
      // set refresh interval
      this.startRefreshInterval();
      // parse user ID and get user data
      const uid = Restify.parseJwt(this.state.token).sub;
      UsersRest.get({path: `/${uid}`, token: this.state.token})
        .then(user => this.setState({
          user: user,
          state: null,
        }, () => resolve()))
        .catch((e) => {
          this.setState({state: null});
          reject(e);
        });
    });
  }

  /**
   * Refreshes the session token and sets the access token if sucessfull
   * Resolves
   * - with token, when session is refreshed and tokens are set
   * - with null, when no session token is available
   * @returns {Promise<String|null>}
   */
  refreshToken() {
    return new Promise ((resolve, reject) => {
      // check cookie for refresh token
      Sessify.getCookie('refresh')
        .then(token => AuthRest.post({refreshToken: token}, {path: '/refresh-tokens'}))
        .then(u => {
          // save token
          Sessify.createToken('refresh', u.refresh);
          // set token
          this.setState(
            {token: u.access.token},
            () => resolve(u.access.token)
          );
        })
        .catch((e) => {
          // logout when session is not set (not an error case)
          if(e === "session_not_found")
            resolve(null);
          else
            reject(e);
        });
    });
  }

  refresh() {
    // refresh token and logout is invalid
    this.refreshToken()
      .then(token => (!token && this.logout()));
  }

  startRefreshInterval() {
    // set refresh interval
    this.refreshHandlerID && window.clearInterval(this.refreshHandlerID);
    this.refreshHandlerID = window.setInterval(() => this.refresh(), 1000 * 60 * REFRESH_INTERVAL_MIN);
  }

  stopRefreshInterval() {
    // clear refresh interval and unset handler
    this.refreshHandlerID && window.clearInterval(this.refreshHandlerID);
    this.refreshHandlerID = null;
  }

  componentDidMount() {
    this.refreshToken()
      .then(token => (token ? token : Promise.reject()))
      .then(() => this.refreshUser())
      .catch(e => e && console.error(e));
  }

  componentWillUnmount() {
    this.stopRefreshInterval();
  }

  render() {
    // The entire state is passed to the provider
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }

}

export default Auth;
