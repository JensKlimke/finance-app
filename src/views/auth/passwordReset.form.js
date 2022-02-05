import {Button, Form, Input, Message} from "semantic-ui-react";
import {useState} from "react";

function PasswordResetForm ({onSubmit}) {

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    // set loading
    setLoading(true);
    // unset error
    setError(null);
    // submit password
    onSubmit(email)
      .catch(error => {
        setError(error)
        setLoading(false);
      })
  }


  return (
    <>
      <Message
        attached
        header='Reset password'
        content='Type in your email address to receive a reset link.'
      />
      <Form
        className='attached fluid segment'
        onSubmit={submit}
        loading={loading}
      >
        <Form.Field>
          <Form.Field
            control={Input}
            type={"email"}
            onChange={(e, {value}) => setEmail(value)}
            placeholder='Email'
            value={email}
          />
        </Form.Field>
        <Button type='submit'>Reset</Button>
      </Form>
      {error && <Message attached={'bottom'} error content={error ? error : ''} /> }
    </>
  )

}

export default PasswordResetForm;
