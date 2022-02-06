import React from "react";
import {AuthContext} from "../auth/Auth";

export default function AuthControllerWrapper (WrappedComponent, createController) {

  return class extends React.Component {

    static contextType = AuthContext;

    constructor(props) {
      super(props);
      this.state = {
        controller: null,
      }
    }

    componentDidMount() {
      this.setState({controller: createController(this.context.token)})
    }

    componentDidUpdate() {
    }

    render() {
      return <WrappedComponent controller={this.state.controller} {...this.props} />;
    }

  }

}
