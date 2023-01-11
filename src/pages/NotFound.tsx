import {Col, Container, Row} from "react-bootstrap";
import React from "react";

export default function NotFound () {
  return (
    <Container>
      <Row className='align-content-center d-block d-lg-none'>
        <Col className='text-center mt-5'>
          <h1 className="display-2">404</h1>
          <h1 className="display-2">Page not found</h1>
        </Col>
      </Row>
      <Row className='align-content-center d-none d-lg-block'>
        <Col className='text-center mt-5'>
          <h1 className="display-2">404 - Page not found!</h1>
        </Col>
      </Row>
    </Container>
  );
}


