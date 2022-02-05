import React from 'react'
import {Container, Grid, GridColumn, GridRow} from "semantic-ui-react";
import {AuthContext} from "./Auth";
import LoginForm from "./LoginForm";
import LogoutForm from "./LogoutForm";


function UserAuth() {

  return (
    <Container>
      <Grid>
        <GridRow/>
        <GridRow>
          <GridColumn computer={5} mobile={1} tablet={1}/>
          <GridColumn computer={6} mobile={14} tablet={14}>
            <AuthContext.Consumer>
              {({user}) => (
                <>
                  { (!user) && <LoginForm /> }
                  { (user)  && <LogoutForm /> }
                </>
              )}
            </AuthContext.Consumer>
          </GridColumn>
          <GridColumn computer={5} mobile={1} tablet={1}/>
        </GridRow>
      </Grid>
    </Container>
  );
}



export default UserAuth;
