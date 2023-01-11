import React from "react";
import "../assets/styles/App.scss"
import Nav from "./Nav";
import {useAuth} from "../components/auth/AuthContext";
import {Button} from "react-bootstrap";
import TopbarNav from "./TopbarNav";
import LoadingScreen from "../components/auth/LoadingScreen";
import {BsPiggyBank} from "react-icons/bs";
import {Navigate, NavLink} from "react-router-dom";

export default function App({children}: { children: React.ReactNode }) {
  // hooks
  const {logout, pending, session} = useAuth();
  // don't render if not logged in
  if (pending && !session)
    return (
      <LoadingScreen>
        Loading session&hellip;
      </LoadingScreen>
    );
  else if (!pending && !session)
    return (
      <LoadingScreen>
        <span>Unauthorized. </span>
        <NavLink to={`/auth/login?redirect=${window.location.pathname}`}>Log in</NavLink>
        <Navigate to={`/auth/login?redirect=${window.location.pathname}`} />
      </LoadingScreen>
    );
  // render side
  return (
    <div className='App'>
      <div className='Main'>
        <div className='Content'>
          {children}
        </div>
        <div className='Footer text-muted'>
          <span>&copy; 2022 Jens Klimke</span>
        </div>
      </div>
      <div className='Topbar d-flex justify-content-between'>
        <h3 className='Title'>FinApp</h3>
        {logout && <Button variant='link' onClick={() => logout()} className='d-none d-sm-block'>Logout</Button>}
        <TopbarNav>
          <Nav/>
        </TopbarNav>
      </div>
      <div className='Sidebar'>
        <div className='Logo'>
          <h1 className='display-6'><BsPiggyBank /></h1>
        </div>
        <div className='Logo small'>
          $$$
        </div>
        <Nav/>
      </div>
    </div>
  );
}

