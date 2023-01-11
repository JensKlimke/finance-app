import React, {useCallback, useReducer, useState} from 'react';
import {Alert, Button, Card, Col, Container, Form, FormGroup, Row, Spinner} from 'react-bootstrap';
import {NavLink, useNavigate} from 'react-router-dom';
import {RegisterValuesType, useAuth} from '../../components/auth/AuthContext';

type StateType = {
  input: RegisterValuesType & { passwordRepeat: string };
  values: RegisterValuesType;
  passwordError?: string;
  passwordRepeatError?: string;
};

const defaultState = {
  input: {
    name: '',
    email: '',
    password: '',
    passwordRepeat: ''
  },
  values: {
    name: '',
    email: '',
    password: ''
  }
};

type ActionType =
  { name : string } |
  { email : string } |
  { password : string } |
  { passwordRepeat : string };

function reducer(state: StateType, action: ActionType): StateType {
  // copy input
  const input = {...state.input, ...action};
  const values = {
    name: input.name,
    email: input.email,
    password: input.password
  }
  // generate errors
  let passwordError, passwordRepeatError = undefined;
  (!input.password.match(/\d/) || !input.password.match(/[a-zA-Z]/))
    && (passwordError = 'Password must contain at least 1 letter and 1 number');
  (input.password.length < 8)
    && (passwordError = 'Password must be at least 8 characters');
  (input.passwordRepeat !== '' && input.password !== input.passwordRepeat)
    && (passwordRepeatError = 'Passwords do not match');
  // return state
  return {input, values, passwordError, passwordRepeatError};
}

export default function RegisterPage() {
  // state
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);
  // hooks
  const navigate = useNavigate();
  const {register} = useAuth();
  // handlers
  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    // prevent from forwarding
    event.preventDefault();
    // set pending
    setPending(true);
    // send data
    register(state.values)
      .then(() => setSuccess(true))
      .catch(e => setError(e))
      .then(() => setPending(false));
  }, [register, state.values]);
  // render
  return (
    <Container>
      <Row className='justify-content-center mt-5'>
        <Col lg={6} sm={10}>
          <Card>
            <Card.Header>Register</Card.Header>
            <Card.Body>
              { success && (
                <>
                  <Alert variant={'success'} onClose={() => navigate('/')} dismissible>
                    <Alert.Heading>Congratulations</Alert.Heading>
                    Your account was created successfully. You will receive an email to verify the email address.
                  </Alert>
                  <span className='text-muted'>Close the message above to redirect to the start page.</span>
                </>
              )}
              { !success && (
                <Form onSubmit={(e) => handleSubmit(e)}>
                  <FormGroup className='mb-3' >
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type='text'
                      id='name'
                      value={state.input.name}
                      onChange={e => dispatch({name: e.target.value})}
                      placeholder='Enter your name'
                    />
                  </FormGroup>
                  <FormGroup className='mb-3' >
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type='email'
                      id='email'
                      value={state.input.email}
                      onChange={e => dispatch({email: e.target.value})}
                      placeholder='Enter email address'
                    />
                  </FormGroup>
                  <FormGroup className='mb-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type='password'
                      id='password'
                      value={state.input.password}
                      onChange={e => dispatch({password: e.target.value})}
                      placeholder='Enter password'
                      isInvalid={state.passwordError !== undefined}
                    />
                    {state.passwordError && <Form.Control.Feedback type='invalid'>{state.passwordError}</Form.Control.Feedback>}
                  </FormGroup>
                  <FormGroup className='mb-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type='password'
                      id='password'
                      value={state.input.passwordRepeat}
                      onChange={e => dispatch({passwordRepeat: e.target.value})}
                      placeholder='Repeat password'
                      isInvalid={state.passwordRepeatError !== undefined}
                    />
                    {state.passwordRepeatError && <Form.Control.Feedback type='invalid'>{state.passwordRepeatError}</Form.Control.Feedback>}
                  </FormGroup>
                  <hr />
                  { error && <Alert variant={'danger'} onClose={() => setError(undefined)} dismissible>{error}</Alert> }
                  <div className='d-flex justify-content-between align-items-center'>
                    <Button variant='primary' type='submit' disabled={pending || !!state.passwordRepeatError || !!state.passwordError}>
                      { pending ? <Spinner animation='border' size='sm' /> : 'Create Account' }
                    </Button>
                    <NavLink to='/auth/login' className='me-2'>Login</NavLink>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
