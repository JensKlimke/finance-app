import {Card, Col, Container, Row} from "react-bootstrap";
import {NavLink} from "react-router-dom";

export default function Dashboard () {
  return (
    <Container>
      <Row className='justify-content-center'>
        <Col md={6} sm={12} className='mb-4'>
          <Card>
            <Card.Header>
              Navigation
            </Card.Header>
            <Card.Body className='text-center'>
              <NavLink to='/contracts'>
                <h4 className='display-4'>Contracts</h4>
              </NavLink>
              <NavLink to='/transfer'>
                <h4 className='display-4'>Transfers</h4>
              </NavLink>
              <NavLink to='/stocks'>
                <h4 className='display-4'>Stocks</h4>
              </NavLink>
              <NavLink to='/assets'>
                <h4 className='display-4'>Assets</h4>
              </NavLink>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
