import {Button, Container, Grid, GridColumn, GridRow, Message, Segment} from "semantic-ui-react";
import PasswordResetForm from "./passwordReset.form";
import {ForgotPasswordController} from "./password.controller";
import {useState} from "react";

export default function PasswordReset() {

  const [message, setMessage] = useState(null);

  const onSubmit = (email) => new Promise((resolve, reject) => {
    ForgotPasswordController
      .request({email})
      .then(e => console.error(e))
      .then(() => {
        setMessage(true);
        resolve();
      })
      .catch(e => {
        // check if password is only malformed
        if(e?.content?.message) {
          return reject(e.content.message);
        }
        console.error(e);
      });
  });

  return (
    <Container>
      <Grid>
        <GridRow/>
        <GridRow>
          <GridColumn computer={5} mobile={1} tablet={1}/>
          <GridColumn computer={6} mobile={14} tablet={14}>
            {!message && <PasswordResetForm onSubmit={onSubmit} />}
            {message && (
              <Segment>
                <Message success content="An email has been sent with a link to reset your password." />
                <Button as={'a'} href={`${process.env.REACT_APP_HOST}/auth`}>Login</Button>
              </Segment>
            )}
          </GridColumn>
          <GridColumn computer={5} mobile={1} tablet={1}/>
        </GridRow>
      </Grid>
    </Container>
  );

}
