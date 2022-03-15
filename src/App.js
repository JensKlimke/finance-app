import {Grid, Statistic} from "semantic-ui-react";
import {AuthContext} from "./auth/Auth";
import AuthMenu from "./structure/AuthMenu";
import {Route, Routes} from "react-router-dom";
import Profile from "./views/profile/profile.view";
import PageStructure, {showPage} from "./structure/PageStructure";
import './App.css';


function App() {

  return (
    <div id='Dashboard'>
      <div className='Navbar'>
        <Grid>
          <Grid.Column  mobile={8} tablet={8} computer={4}>
            <Statistic label='v0.1' value='FinApp' color='purple' size='small' />
          </Grid.Column>
          <Grid.Column  mobile={8} tablet={8} computer={12} verticalAlign='bottom'>
            <AuthMenu  />
          </Grid.Column>
        </Grid>
      </div>
      <AuthContext.Consumer>
        {({user}) => user && (
          <div className='Content'>
            <Routes>
              {
                Object.values(PageStructure).filter(p => showPage(p, user)).map(e =>
                  <Route key={e.href} path={e.href} element={e.element} />
                )
              }
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        )}
      </AuthContext.Consumer>
    </div>
  );
}

export default App;
