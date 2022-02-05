import {Dropdown, Grid, Header, Image, Menu} from "semantic-ui-react";
import {NavLink} from "react-router-dom";
import PageStructure, {showPage} from "./PageStructure";


function MainMenu({user, onLogout}) {

  // get nav items
  const nav = Object.values(PageStructure).filter(p => showPage(p, user));

  return (
    <Grid>
      <Grid.Column width={16} only='computer'>
        <Menu secondary>
          {
            nav.map(e =>
              <Menu.Item key={e.href} as={NavLink} to={e.href}>{e.name}</Menu.Item>
            )
          }
          <Menu.Menu position='right'>
            <Header>
              <Header.Content>
                <Image src={user.avatar} avatar/>
                <Dropdown inline text={user.name}>
                  <Dropdown.Menu>
                    <Dropdown.Item text='Profile' description='Your settings' as={NavLink} to="/profile" />
                    <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Header.Content>
            </Header>
          </Menu.Menu>
        </Menu>
      </Grid.Column>
      <Grid.Column width={16} only='mobile tablet' textAlign='right'>
        <Menu secondary>
          <Menu.Menu position='right'>
            <Dropdown item icon='bars'>
              <Dropdown.Menu>
                {
                  nav.map(e =>
                    <Dropdown.Item as={NavLink} key={e.href} to={e.href} text={e.name} />
                  )
                }
                <Dropdown.Divider/>
                <Dropdown.Item text='Profile' as={NavLink} to="/profile" />
                <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
      </Grid.Column>
    </Grid>
  );

}

export default MainMenu;

