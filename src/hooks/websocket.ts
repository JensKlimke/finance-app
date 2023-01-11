import {useCallback, useEffect, useState} from "react";


export default function useWebsocket(url : string) {
  // states
  const [socket, setSocket] = useState<WebSocket>();
  // callbacks
  const disconnect = useCallback((s : WebSocket) => {
    s?.close()
    setSocket(undefined);
  }, []);
  const connect = useCallback(() => {
    // create socket
    console.log('WEBSOCKET', 'connect socket');
    const s = new WebSocket(url);
    // set listeners
    s.addEventListener('open', () => {
      setSocket(s);
      s.send('');
    });
    s.addEventListener('close', () => {
      window.setTimeout(() => connect());
    });
    // return socket
    return s;
  }, [url]);
  const reconnect = useCallback(() => {
    socket && disconnect(socket);
    connect();
  }, [connect, disconnect, socket]);
  // effects
  useEffect(() => {
    console.log("WEBSOCKET", 'mount (url changed)');
    // connect
    const s = connect();
    // disconnect
    return () => disconnect(s);
  }, [connect, disconnect]);
  // return data
  return {socket, reconnect};
}
