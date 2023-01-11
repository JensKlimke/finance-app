import {useCallback, useEffect, useMemo, useState} from "react";
import {useAuth} from "../components/auth/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost/';


// set error
const err = (err : any) => {
  // set error state
  if(typeof err === 'string')
    return new Error();
  else if(err instanceof Error)
    return err;
}

export function useApi<Type>(path?: string) {
  // result
  const {session} = useAuth();
  const [data, setData] = useState<Type>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  // memos
  const headers = useMemo(() => {
    if (!session) return;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.token}`
    };
  }, [session]);
  const base = useMemo(() => {
    // create url with path
    const url = new URL(API_URL);
    url.pathname += '/' + (path || '');
    // return url
    return url;
  }, [path])
  // call api
  const reload = useCallback((parameters?: { [key: string]: any }) => {
    // set loading flag
    setLoading(true);
    // create url with pathname and parameters
    const url = new URL(base);
    parameters && Object.entries(parameters).forEach(
      ([key, value]) => url.searchParams.set(key, value)
    );
    // get data
    fetch(url.toString(), {headers})
      .then(d => d.json())
      .then(d => setData(d))
      .then(() => setError(undefined))
      .catch(e => setError(err(e)))
      .then(() => setLoading(false))
  }, [base, headers]);
  // callback to save
  const save = useCallback((id : string | undefined, data : any | any[], parameters?: { [key: string]: any }) =>
    new Promise((resolve, reject) =>
  {
    // set batch mode
    const url = new URL(base);
    Array.isArray(data) && (url.pathname += '/batch');
    // set parameters
    parameters && Object.entries(parameters).forEach(
      ([key, value]) => url.searchParams.set(key, value)
    );
    // set method
    let method = 'POST';
    // check if update
    if (id) {
      url.pathname += `/${id}`;
      method = 'PATCH';
    }
    // save data
    fetch(url.toString(), {
      method,
      headers,
      body: JSON.stringify(data)
    })
      .then(r => r.json())
      .then(r => resolve(r))
      .catch(e => reject(err(e)));
  }), [base, headers]);
  // callback to delete
  const erase = useCallback((id ?: string, parameters?: { [key: string]: any }) =>
    new Promise((resolve, reject) =>
  {
    // create url with pathname and parameters
    const url = new URL(base);
    url.pathname += id ? `/${id}` : '/batch';
    // set parameters
    parameters && Object.entries(parameters).forEach(
      ([key, value]) => url.searchParams.set(key, value)
    );
    // save data
    fetch(url.toString(), {
      method: 'DELETE',
      headers,
    })
      .then(r => resolve((r.status === 204 || r.status === 200) ? {} : r.json()))
      .catch(e => reject(err(e)));
  }), [base, headers]);
  // return result
  return {data, loading, error, reload, save, erase};
}

export function useApiData<Type>(path?: string, parameters?: { [key: string]: any }) {
  // get data
  const data = useApi<Type>(path);
  // load data
  useEffect(() => {
    const reload = data.reload;
    reload(parameters || {});
  }, [data.reload, parameters]);
  // return data
  return data;
}

