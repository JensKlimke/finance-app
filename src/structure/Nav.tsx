import {NavLink} from "react-router-dom";
import {
  BsArrowLeftRight,
  BsBank,
  BsBoxArrowLeft,
  BsCash,
  BsInfoCircle,
  BsPen,
  BsPeople,
  BsSpeedometer2
} from "react-icons/bs";
import {FaHeartbeat} from "react-icons/fa";
import React from "react";
import {useAuth} from "../components/auth/AuthContext";

export default function Nav() {
  // get callbacks
  const {logout, user} = useAuth();
  // render
  return (
    <>
      <ul className='Nav'>
        <NavLink to='/'>
          <li>
            <span className='icon'>
              <BsSpeedometer2/>
            </span>
            <span className='text'>
              Dashboard
            </span>
          </li>
        </NavLink>
      </ul>
      <hr/>
      <ul className='Nav'>
        <h1>Finance</h1>
        <NavLink to='/contracts'>
          <li>
            <span className='icon'>
              <BsPen/>
            </span>
            <span className='text'>
              Contracts
            </span>
          </li>
        </NavLink>
        <NavLink to='/transfer'>
          <li>
            <span className='icon'>
              <BsArrowLeftRight/>
            </span>
            <span className='text'>
              Money Transfer
            </span>
          </li>
        </NavLink>
        <NavLink to='/stocks'>
          <li>
            <span className='icon'>
              <BsBank/>
            </span>
            <span className='text'>
              Stocks
            </span>
          </li>
        </NavLink>
        <NavLink to='/assets'>
          <li>
            <span className='icon'>
              <BsCash/>
            </span>
            <span className='text'>
              Assets
            </span>
          </li>
        </NavLink>
        {/*<NavLink to='/goals'>*/}
        {/*  <li>*/}
        {/*    <span className='icon'>*/}
        {/*      <BsBullseye/>*/}
        {/*    </span>*/}
        {/*    <span className='text'>*/}
        {/*      Goals*/}
        {/*    </span>*/}
        {/*  </li>*/}
        {/*</NavLink>*/}
        {/*<NavLink to='/exemptions'>*/}
        {/*  <li>*/}
        {/*    <span className='icon'>*/}
        {/*      <BsHeart/>*/}
        {/*    </span>*/}
        {/*    <span className='text'>*/}
        {/*      Tax Exemption*/}
        {/*    </span>*/}
        {/*  </li>*/}
        {/*</NavLink>*/}
      </ul>
      <hr/>
      {process.env.REACT_APP_WITH_HOME_AUTOMATION && (
        <>
          <ul className='Nav'>
            <h1>Home Automation</h1>
            <NavLink to='/home/heartbeat'>
              <li>
                <span className='icon'>
                  <FaHeartbeat/>
                </span>
                <span className='text'>
                  System Status
                </span>
              </li>
            </NavLink>
          </ul>
          <hr/>
        </>
      )}
      {user?.role === 'admin' && (
        <>
          <ul className='Nav'>
            <h1>Management</h1>
            <NavLink to='/users'>
              <li>
            <span className='icon'>
              <BsPeople/>
            </span>
                <span className='text'>
              Users
            </span>
              </li>
            </NavLink>
          </ul>
          <hr/>
        </>
      )}
      <ul className='Nav'>
        <NavLink to='/about'>
          <li>
            <span className='icon'>
              <BsInfoCircle/>
            </span>
            <span className='text'>
              About
            </span>
          </li>
        </NavLink>
        <span role='button' onClick={() => (logout && logout())} className='d-block d-sm-none'>
          <li>
            <span className='icon'>
              <BsBoxArrowLeft/>
            </span>
            <span className='text'>
              Logout
            </span>
          </li>
        </span>
      </ul>
    </>
  )
}
