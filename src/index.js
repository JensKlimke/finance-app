import ReactDOM from 'react-dom';
import App from "./App";
import Auth from "./auth/Auth";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import UserAuth from "./auth/UserAuth";
import PasswordReset from "./views/auth/passwordReset.view";
import Password from "./views/auth/password.view";
import './patched/fomantic-ui-css/semantic.min.css'
import './index.css';

ReactDOM.render(
  <Auth>
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<UserAuth />} />
        <Route path="/forgot-password" element={<PasswordReset />} />
        <Route path="/reset-password" element={<Password />} />
        <Route path="/init-password" element={<Password />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </Auth>,
  document.getElementById('root')
);
