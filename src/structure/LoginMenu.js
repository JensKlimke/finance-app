import {Loader, Menu} from "semantic-ui-react";

function LoginMenu({loading, authLink}) {

  return (
    <Menu secondary>
      <Menu.Menu position='right'>
        {
          loading
            ? <Loader active inline='centered' />
            : <Menu.Item name='login' href={authLink} position='right' target='_self' />
        }
      </Menu.Menu>
    </Menu>
  );

}

export default LoginMenu;
