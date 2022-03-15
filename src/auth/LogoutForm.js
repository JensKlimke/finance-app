import React from 'react'
import {Button, Segment} from 'semantic-ui-react'
import {AuthContext} from "./Auth";

// define rest host
const APP_HOST = process.env.REACT_APP_HOST || 'http://localhost';

class LogoutForm extends React.Component {

  // get context
  static contextType = AuthContext;

  constructor(props) {
    // super
    super(props);

    // set initial state
    this.state = {
      client: null,
    };

  }

  componentDidMount() {

    // check request parameters
    let url = new URL(window.location.href);
    if(url.searchParams.has("redirect") && url.searchParams.has("requester")) {
      this.setState({
        client: {
          redirect: new URL(url.searchParams.get("redirect")),
          requester: url.searchParams.get("requester")
        }
      });
    }

  }

  render() {

    // get loading flag
    const loading = this.context?.state === 'loading';

    return (
      <Segment loading={loading}>
        { this.state.client && <Button as='a' primary href={this.state.client.redirect}>{this.state.client.requester}</Button> }
        { !this.state.client && <Button as='a' primary href={APP_HOST}>Start</Button> }
        <Button onClick={this.context.logout}>Logout</Button>
      </Segment>
    );

  }

}


export default LogoutForm;
