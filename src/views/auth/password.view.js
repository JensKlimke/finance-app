import React, {useState, useEffect} from 'react'
import {Container, Grid, GridColumn, GridRow, Header, Message, Segment} from "semantic-ui-react";
import {AuthController} from "../../auth/AuthController";
import {InitializePasswordController, ResetPasswordController} from "./password.controller";
import Restify from "../../data/Restify";
import PasswordForm from "./password.form";

// define rest host
const APP_HOST = process.env.REACT_APP_HOST || 'http://localhost';

const TokenTypes = {
  none: 0,
  resetPassword: 1,
  initPassword: 2,
}

function Password() {

  // states
  const [token, setToken] = useState(null);
  const [type, setType] = useState(TokenTypes.none);
  const [message, setMessage] = useState(null);

  useEffect(() => {

    let url = new URL(window.location.href);
    if(url.searchParams.has("token")) {
      // get token and parse
      const t = url.searchParams.get("token");
      const j = Restify.parseJwt(t);
      // check if type is set
      if(j.type && TokenTypes[j.type]) {
        // set token and type
        setToken(t);
        setType(TokenTypes[j.type]);
        // logout
        AuthController.logout();
      }
    }

  }, []);

  const getController = () => {
    if(type === TokenTypes.resetPassword)
      return ResetPasswordController;
    else if(type === TokenTypes.initPassword)
      return InitializePasswordController;
  }

  const getTitle = () => {
    if(type === TokenTypes.resetPassword)
      return "Reset your password";
    else if(type === TokenTypes.initPassword)
      return "Choose your password";
  }

  const onSubmit = (password) => new Promise((resolve, reject) => {
    getController()
      .requestWithToken(token, {password})
      .then(() => {
        setMessage({success: true});
        resolve(true);
      })
      .catch(e => {
        // check if password is only malformed
        if(e?.status === 400 && e?.content?.message) {
          return reject(e.content.message);
        } else if (e?.status === 401 && e?.content?.message) {
          setMessage({auth: 'The token seems to be invalid.'})
          return resolve(false);
        } else if (e?.content?.code && e?.content?.message) {
          setMessage({error: `Error ${e.content.code}: ${e.content.message}`})
          return resolve(false);
        }
        // resolve, false
        console.error(e);
        resolve(false);
      });
  });

  let renderMsg = null;
  if(message && message.success) {
    renderMsg = {
      success: true,
      error: false,
      icon: 'check circle outline',
      onDismiss: () => window.location.href = `${APP_HOST}/auth`,
      header: type === TokenTypes.initPassword ? 'Password has been created.' : 'Password has been reset.',
      content: message.success
    }
  } else if(message && message.auth) {
    renderMsg = {
      success: false,
      error: true,
      icon: 'frown outline',
      onDismiss: () => window.location.href = APP_HOST,
      header: 'That went wrong',
      content: message.auth
    }
  } else if(message && message.error) {
    renderMsg = {
      success: false,
      error: true,
      icon: 'frown outline',
      onDismiss: () => setMessage({}),
      header: 'Something went wrong',
      content: message.error
    }
  }

  // error, when type is none
  if(type === TokenTypes.none)
    return <Container textAlign='center'>Error: No valid token.</Container>

  // return
  return (
    <Container>
      <Grid>
        <GridRow />
        <GridRow>
          <GridColumn computer={4} tablet={4} mobile={1}/>
          <GridColumn computer={8} tablet={8} mobile={14}>
            <Segment>
              <Header>{getTitle()}</Header>
              {!renderMsg && <PasswordForm onSubmit={onSubmit} />}
              {renderMsg && <Message {...renderMsg} />}
            </Segment>
          </GridColumn>
          <GridColumn computer={4} tablet={4} mobile={1}/>
        </GridRow>
      </Grid>
    </Container>
  );

}


export default Password;
