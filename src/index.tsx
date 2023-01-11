import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootswatch/dist/slate/bootstrap.min.css";
import "./assets/styles/index.scss"
import App from './structure/App';
import AuthProvider from "./components/auth/AuthProvider";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ContractsPage from "./pages/contracts/Contracts.page";
import TransferPage from "./pages/transfers/Transfer.page";
import StocksPage from "./pages/stocks/Stocks.page";
import AssetsPage from "./pages/assets/Assets.page";
import HeartbeatPage from "./pages/heartbeat/Heartbeat.page";
import LoginPage from "./pages/auth/Login.page";
import RegisterPage from "./pages/auth/Register.page";
import NotFound from "./pages/NotFound";
import UsersPage from "./pages/users/Users.page";
import AboutPage from "./pages/about/About.page";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const withAuth = (element : React.ReactNode) => {
  return <App>{element}</App>;
}

root.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route index element={withAuth(<Dashboard />)} />
        <Route path="contracts" element={withAuth(<ContractsPage />)} />
        <Route path="transfer" element={withAuth(<TransferPage />)} />
        <Route path="stocks" element={withAuth(<StocksPage />)} />
        <Route path="assets" element={withAuth(<AssetsPage />)} />
        {process.env.REACT_APP_WITH_HOME_AUTOMATION && (
          <>
            <Route path="home/heartbeat" element={withAuth(<HeartbeatPage />)} />
          </>
        )}
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/register" element={<RegisterPage />} />
        <Route path="users" element={withAuth(<UsersPage />)} />
        <Route path="about" element={withAuth(<AboutPage />)} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

