import {Button, Form, Grid} from "semantic-ui-react";
import {useState} from "react";

function PasswordForm ({onSubmit}) {

  const [passwords, setPasswords] = useState({password: "", repeat: ""});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    const pw = {...passwords};
    pw[key] = value;
    setPasswords(pw);
    setError({});
  }

  const submit = () => {
    // check for being
    if(passwords.password !== passwords.repeat) {
      setError({repeat: 'The passwords do not match'});
      return;
    }
    // set loading
    setLoading(true);
    // submit password
    onSubmit(passwords.password)
      .catch(error => setError({password: error}))
      .then(() => setLoading(true));
  }

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <i style={{color: 'gray'}}>Passwords must contain at least one letter and one number and must be at least 8 characters.</i>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={1}>
        <Grid.Column>
          <Form
            id='password-form'
            onSubmit={submit}
            loading={loading}
          >
            <Form.Group widths='equal'>
              <Form.Input
                fluid
                type='password'
                id="password-new"
                label='New'
                placeholder='Your Password'
                value={passwords.password}
                onChange={(e, {value}) => handleChange('password', value)}
                error={!error.password ? false : {content: error.password, pointing: 'above'}}
              />
              <Form.Input
                fluid
                type='password'
                id="password-repeat"
                label='Repeat'
                placeholder='Repeat the Password'
                value={passwords.repeat}
                onChange={(e, {value}) => handleChange('repeat', value)}
                error={!error.repeat ? false : {content: error.repeat, pointing: 'above'}}
              />
            </Form.Group>
          </Form>
        </Grid.Column>
        <Grid.Column textAlign='right'>
          <Button type='submit' form='password-form'>Save</Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )

}

export default PasswordForm;
