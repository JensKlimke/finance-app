import React from 'react'
import {Button, Form, Message, Input, Icon} from 'semantic-ui-react'
import {Link} from "react-router-dom";
import {AuthContext} from "./Auth";


class LoginForm extends React.Component {

  // get context
  static contextType = AuthContext;

  constructor(props) {
    // super
    super(props);

    // set initial state
    this.state = {
      email: '',
      password: '',
      error: null,
    }

  }

  handleError(error) {
    // show error
    if(error?.content?.code !== 200)
      this.setState({error: error.content});
    else
      this.setState({error: {message: 'An unknown error occurred.'}})
  }

  handleSubmit() {
    // submit
    this.context.login(this.state.email, this.state.password)
      .catch(e => this.handleError(e));
  }

  render() {

    // get loading flag
    const loading = this.context?.state === 'loading';

    return (
      <>
        <Message
          attached
          header='Login'
          content='Secure login via SSL'
        />
        <Form
          className='attached fluid segment'
          onSubmit={() => this.handleSubmit()}
          loading={loading}
        >
          <Form.Field>
            <Form.Field
              control={Input}
              type={"email"}
              onChange={(e, {value}) => this.setState({email: value})}
              placeholder='Email'
              value={this.state.email}
            />
          </Form.Field>
          <Form.Field>
            <Form.Field
              control={Input}
              type={"password"}
              onChange={(e, {value}) => this.setState({password: value})}
              placeholder='Password'
              value={this.state.password}
            />
          </Form.Field>
          <Button type='submit'>Login</Button>
          <Link style={{float: 'right', margin: '0.7em'}} to='/forgot-password'>Forgot Password</Link>
        </Form>
        { !this.state.error &&
          <Message
            attached='bottom'
            size='tiny'
          />
        }
        {
          this.state.error && (
            <Message
              attached='bottom'
              onDismiss={() => this.setState({error: null})}
              error
              icon
            >
              <Icon name='frown outline' />
              <Message.Content>{this.state.error.message}</Message.Content>
            </Message>
          )
        }
      </>
    );

  }

}


export default LoginForm;
