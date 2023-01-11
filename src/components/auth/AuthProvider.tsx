import React, {useCallback, useEffect, useState} from 'react';
import {AuthContext, AuthContextType, RegisterValuesType, SessionType, UserType} from './AuthContext';
import moment from "moment";

// TODO: session with atomWithStorage

const SESSION_STORAGE_KEY = 'refresh_token';
const FINAPI_URL = process.env.REACT_APP_API_URL;

type LoginResponseType = {
  session: SessionType
  user: UserType
}

type TokenResponseType = {
  refresh: {
    token: string
    expires: string
  },
  access: {
    token: string
    expires: string
  }
}

const getSession = (tokens : TokenResponseType, uid : string) => {
  // save session
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({...tokens.refresh, uid}));
  // calculate seconds for access token to expire
  const expires = -moment().diff(tokens.access.expires, 'seconds') || undefined;
  // get token
  const token = tokens.access.token;
  // return new session
  return {token, expires, uid};
}

const loginPromise = (email: string, password: string) =>
  new Promise<LoginResponseType>((resolve, reject) => {
    // call API
    fetch(`${FINAPI_URL}/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    })
      .then(r => r.json())
      .then(r => {
        // error case
        if (r.code && r.code !== 200)
          return reject(r.message);
        else if (!r.user || !r.tokens)
          return reject('Unknown issue during log in');
        // save session
        const session = getSession(r.tokens, r.user.id);
        // return data
        return resolve({
          user: r.user,
          session,
        });
      })
      .catch(e => {
        console.error(e);
        reject('Unknown error');
      })
  });


const registerPromise = (name: string, email: string, password: string) =>
  new Promise<LoginResponseType>((resolve, reject) => {
    // call API
    fetch(`${FINAPI_URL}/auth/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, email, password})
    })
      .then(r => r.json())
      .then(r => {
        // error case
        if (r.code && r.code !== 200)
          return reject(r.message);
        else if (!r.user || !r.tokens)
          return reject('Unknown issue during registration');
        // save session
        const session = getSession(r.tokens, r.user.id);
        // return data
        return resolve({
          user: r.user,
          session,
        });
      })
      .catch(e => {
        console.error(e);
        reject('Unknown error');
      })
  });

const sessionPromise = () =>
  new Promise<SessionType>((resolve, reject) => {
    // get refresh token
    const sessionString = localStorage.getItem(SESSION_STORAGE_KEY);
    // check session
    if (!sessionString)
      return reject("no session");
    // get session
    const session = JSON.parse(sessionString);
    // call API
    fetch(`${FINAPI_URL}/auth/refresh-tokens`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({refreshToken: session.token})
    })
      .then(r => r.json())
      .then(r => {
        // error case
        if (r.code && r.code !== 200)
          return reject(r.message);
        else if (!r.access || !r.refresh)
          return reject('Unknown issue during login');
        // return new session
        return resolve(getSession(r, session.uid));
      })
      .catch(e => {
        console.error(e);
        reject('Unknown error');
      })
  });


const userPromise = (uid: string, token: string) =>
  new Promise<UserType>((resolve, reject) => {
    // call API, TODO: remove uid from request (not needed)
    fetch(`${FINAPI_URL}/users/${uid}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(r => r.json())
      .then(r => {
        // error case
        if (r.code && r.code !== 200)
          return reject(r.message);
        // return user
        resolve(r);
      })
      .catch(e => {
        console.error(e);
        reject('Unknown error');
      })
  });


const deleteSessionPromise = () =>
  new Promise<void>((resolve) => {
    // remove session
    localStorage.removeItem(SESSION_STORAGE_KEY);
    // resolve positively
    resolve();
  });


export default function AuthProvider({ children } : {children: React.ReactNode}) {
  // states
  const [pending, setPending] = useState<boolean>(true);
  const [user, setUser] = useState<UserType>();
  const [session, setSession] = useState<SessionType>();
  // define callbacks
  const login = useCallback((email: string, password: string) =>
    loginPromise(email, password)
      .then(r => {
        // set token and user
        setSession(r.session);
        setUser(r.user);
        // return user
        return r.user;
      }),
  []);
  // define callbacks
  const register = useCallback((values : RegisterValuesType) =>
      registerPromise(values.name, values.email, values.password)
        .then(r => {
          // set token and user
          setSession(r.session);
          setUser(r.user);
          // return user
          return r.user;
        }),
    []);
  const logout = useCallback(() =>
    // logout
    deleteSessionPromise()
      .then(() => {
        setSession(undefined);
        setUser(undefined);
      })
  , []);
  const renew = useCallback(() => {
    // get session
    return sessionPromise()
      .then(t => setSession(t))
      .catch(() => deleteSessionPromise())
      .then(() => {})
  }, []);
  // on mount
  useEffect(() => {
    // get information
    renew().then(() => setPending(false));
    // renew interval
    const sessionRenewInterval
      = window.setInterval(async () => await renew(), (15 * 60 * 1000));
    // unset timer on unmount
    return () => clearInterval(sessionRenewInterval);
  }, [renew]);
  // update user
  useEffect(() => {
    // check token
    if (!session || !logout) return;
    // get user
    userPromise(session.uid, session.token)
      .then(u => setUser(u))
      .catch(() => logout())
  }, [logout, session]);
  // context object
  const context : AuthContextType = {
    user,
    session,
    pending,
    login,
    logout,
    renew,
    register
  };
  // render
  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
}
