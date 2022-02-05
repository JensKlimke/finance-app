import MainMenu from "./MainMenu";
import LoginMenu from "./LoginMenu";
import React from "react";
import {AuthContext} from "../auth/Auth";


class AuthMenu extends React.Component {

  static contextType = AuthContext;

  constructor(props) {
    // super
    super(props);
    // state
    this.state = {
      authLink: new URL(process.env.REACT_APP_HOST + "/auth").toString()
    }
  }

  componentDidMount() {

    // create url object
    const authURL = new URL(process.env.REACT_APP_HOST + "/auth");
    authURL.search = new URLSearchParams({
      redirect: new URL(window.location.href),
      requester: "FinanceApp"
    }).toString();

    // return as string
    this.setState({authLink: authURL.toString()});

  }

  render() {
    // get context
    const auth = this.context;
    // when user, show main menu
    if(auth.user)
      return <MainMenu user={auth.user} onLogout={auth.logout}/>;
    // when no user, show login button
    if(!auth.user)
      return <LoginMenu loading={auth.state === 'loading'} authLink={this.state.authLink} />

  }

}

export default AuthMenu;
