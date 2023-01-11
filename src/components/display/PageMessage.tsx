import React from "react";
import {Col, Container, Row} from "react-bootstrap";

export default function PageMessage ({children} : {children : React.ReactNode}) {
  return (
    <Container>
      <Row className='align-content-center'>
        <Col className='text-center mt-5'>{children}</Col>
      </Row>
    </Container>
  )
}
