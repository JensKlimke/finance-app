import React from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import PageMessage from "./PageMessage";
import {useApi} from "../../hooks/api";

export default function DataPage ({path, children} : { path : string, children : (data: any) => JSX.Element }) {
  const {data, loading, reload} = useApi(path);
  // return nothing when data not set
  if (!data) {
    return (
      <PageMessage>
        <Container>
          <Row>
            <Col>{ loading ? <span>Loading data &hellip;</span> : <span>No data available.</span> }</Col>
          </Row>
          <Row className='mt-4'>
            <Col>{ reload && !loading && <>&nbsp;<Button size='sm' variant='outline-secondary' onClick={() => reload()} disabled={loading}>Reload</Button></> }</Col>
          </Row>
        </Container>
      </PageMessage>
    )
  }
  // else return children
  return children(data);
}
