import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {useEffect, useMemo, useState} from "react";
import Chart from "react-apexcharts";
import useWebsocket from "../../hooks/websocket";
import {ApexOptions} from "apexcharts";

// Create WebSocket connection.
const SOCKET_URL = 'wss://middleware.jens-klimke.de/ws/home';

export default function HeartbeatPage () {
  // states
  const [data, setData] = useState<any[]>();
  const {socket, reconnect} = useWebsocket(SOCKET_URL);
  // effects
  useEffect(() => {
    if (socket)
      socket.addEventListener('message', e => setData(JSON.parse(e.data)));
  }, [socket]);
  // data
  const systems = useMemo(() => {
    if (!data) return undefined;

    return data
      .filter((d, i, s) => s.findIndex(d2 => d2.system === d.system && d2.server === d.server) === i)
      .map(d => ({
        name: `${d.server}@${d.system}`,
        data: data
          .filter(d2 => d.server === d2.server && d.system === d2.system)
          .map(e => ({x: new Date(e._time), y: e._value}))
      }));
  }, [data]);
  // check
  if (!systems)
    return null;
  // render
  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              Heartbeat&nbsp;
              <Button size='sm' onClick={() => reconnect()}>Reconnect</Button>
            </Card.Header>
            <Card.Body>
              {
                systems.map(s => (
                  <Chart
                    key={s.name}
                    options={options}
                    series={[s]}
                    type="heatmap"
                    height={100}
                  />
                ))
              }
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

const options : ApexOptions = {
  chart: {
    foreColor: '#ffffff',
    animations: {
      enabled: false
    },
  },
  stroke: {
    width: 3,
  },
  xaxis: {
    type: 'datetime'
  }
};
