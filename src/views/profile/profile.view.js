import React from "react";
import {AuthContext} from "../../auth/Auth";
import ProfileForm from "./profile.form";


class Profile extends React.Component {

  static contextType = AuthContext;

  render() {
    // get context
    const auth = this.context;
    // render
    return <ProfileForm user={auth.user} onUpdate={auth.saveUser} />
  }

}

export default Profile;
