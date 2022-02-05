import Restify from "../data/Restify";
import Sessify from "../data/Sessify";


export let AuthController = {

  userRest: new Restify(process.env.REACT_APP_REST_HOST + "/v1/users/%this_user_id%"),
  refreshRest: new Restify(process.env.REACT_APP_REST_HOST + "/v1/auth/refresh-tokens"),
  loginRest: new Restify(process.env.REACT_APP_REST_HOST + "/v1/auth/login"),
  session: Sessify,
  user: null,
  accessToken: null,
  onUserUpdate: {},
  onTokenUpdate: {},
  onCheck: {},
  intervalHandler: null,


  /** PUBLIC METHODS **/

  check: () => {

    // define function
    const checked = (e) => Object.values(AuthController.onCheck).forEach((c) => c(e));

    // check session and trigger callbacks
    AuthController
      ._checkSession()
      .then(() => checked())
      .catch(e => checked(e));

  },


  login: (user, tokens) => {

    // login and check
    AuthController._login(user, tokens);
    AuthController.check();

    // return user
    return user;

  },


  logout: () => {

    // logout and check
    AuthController._logout();
    AuthController.check();

  },


  /** MANAGEMENT METHODS **/

  init: () => {

    console.log("Starting Auth Controller")

    // check session periodically
    AuthController.intervalHandler =
      window.setInterval(AuthController.check, 5000);

    // check session initially
    AuthController.check();

  },


  exit: () => {
    delete AuthController.intervalHandler
  },


  /** INTERNAL METHODS **/

  _refresh: () => new Promise((resolve, reject) => {

    AuthController.session
      .getSingle("refresh")
      .then((t) => {
        AuthController.refreshRest
          .post({refreshToken: t})
          .then((tokens) => resolve(tokens))
          .catch((e) => (e && e.status && e.status === 401)
              ? reject()
              : reject(e)
            );
      })
      .catch((e) => reject(e))

  }),


  _checkSession: () => new Promise((resolve, reject) => {

    let handleError = (e) => {
      e || AuthController._logout();
      e || reject("logout");
      e && console.error(e);
    }

    AuthController.session
      .getSingle("access")
      .then((token) => AuthController._setAccessToken(token))
      .then((token) => AuthController.userRest.get({token: token}))
      .then(u => AuthController._setUser(u))
      .then(u => resolve(u))
      .catch(() => {
        AuthController
          ._refresh()
          .then(tokens => {
            AuthController.userRest.get({token: tokens.access.token})
              .then(u => AuthController._login(u, tokens))
              .then(u => resolve(u))
              .catch(handleError)
          })
          .catch(handleError)
      })

  }),


  _setUser: (user) => {

    // store user
    let hasChanged = !AuthController._compareObjects(user, AuthController.user);
    AuthController.user = user;

    // callback
    hasChanged &&
      Object.values(AuthController.onUserUpdate).forEach((c) => c(user));

    // return user
    return user;

  },


  _setAccessToken: (token) => {

    // store token
    let hasChanged = (AuthController.accessToken !== token);
    AuthController.accessToken = token;

    // callback
    hasChanged &&
      Object.values(AuthController.onTokenUpdate).forEach((c) => c(token));

    // user rest: set access token
    AuthController.userRest.setAccessToken(token);

    // return token
    return token;

  },


  _login: (user, tokens) => {

    // save content
    AuthController.session.createTokens(tokens)

    // update user and token
    AuthController._setUser(user);
    AuthController._setAccessToken(tokens.access.token);

    return user;

  },


  _logout: () => {

    // save content
    AuthController.session.remove(["access", "refresh"]);

    // update token and user
    AuthController._setAccessToken(null);
    AuthController._setUser(null);

  },


  _compareObjects: (o1, o2) => {

    // special cases
    if(o1 === null && o2 === null)
      return true;
    else if(o1 === null || o2 === null)
      return false;

    // check number or entries
    if(Object.keys(o1).length !== Object.keys(o2).length)
      return false;

    // check entries and value
    return Object.keys(o1).reduce((equal, key) => {
      return equal && (o2[key] && o2[key] === o1[key]);
    }, true);

  },

}
