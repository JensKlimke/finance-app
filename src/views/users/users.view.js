import React from 'react'
import {Container, Grid, Header, Segment} from "semantic-ui-react";
import {ObjectList} from "../../data/ObjectList";
import {UserContext, Users} from "./user.controller";

function UsersView() {

  return (
    <Users>
      <Container>
        <Grid>
          <Grid.Column mobile={16} tablet={16} computer={16}>
            <Segment>
              <Header size='medium' dividing>User Management</Header>
              <UserContext.Consumer>
                { (controller) => controller && <ObjectList controller={controller} /> }
              </UserContext.Consumer>
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    </Users>
  );

}

export default UsersView;
