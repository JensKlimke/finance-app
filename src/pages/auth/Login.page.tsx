import React, {FormEvent, useMemo, useState} from "react";
import {Alert, Button, Card, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import {useAuth} from "../../components/auth/AuthContext";
import {NavLink, useNavigate} from "react-router-dom";

export default function LoginPage () {
  // states
  const [pending, setPending] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>();
  const redirect = useMemo(() => {
    return (new URLSearchParams(window.location.search)).get('redirect');
  }, [])
  // hooks
  const navigate = useNavigate();
  const {user, login, session} = useAuth();
  // callbacks
  const submit = (event: FormEvent<HTMLFormElement>) => {
    // prevent from forwarding
    event.preventDefault();
    // set pending
    setPending(true);
    // get data
    login(email, password)
      .then(() => redirect && navigate(redirect))
      .catch(e => setMessage(e))
      .then(() => setPending(false));
  }
  return (
    <Container>
      <Row className='justify-content-center mt-5'>
        <Col lg={6} sm={10}>
          <Card>
            <Card.Header>Authenticate</Card.Header>
            <Card.Body>
              {(session && user) && (
                <>
                  <Alert variant={'success'} onClose={() => navigate(redirect || '/')} dismissible>
                    <Alert.Heading>Hello {user.name}</Alert.Heading>
                    You are logged in. Have fun!
                  </Alert>
                  <span className='text-muted'>Close the message above to redirect to the start page.</span>
                </>
              )}
              {!session && (
                <Form onSubmit={submit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" onChange={e => setEmail(e.target.value)} value={email} placeholder="Enter email" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" onChange={e => setPassword(e.target.value)} value={password} placeholder="Enter password" />
                  </Form.Group>
                  { message && <Alert variant={"danger"} onClose={() => setMessage(undefined)} dismissible>{message}</Alert> }
                  <div className='d-flex justify-content-between align-items-center'>
                    <NavLink to="/auth/register" className='ms-2'>
                      Create Account
                    </NavLink>
                    <Button variant="primary" type="submit" disabled={pending}>
                      { pending ? <Spinner animation='border' size='sm' /> : 'Log In' }
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
