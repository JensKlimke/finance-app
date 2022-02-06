import React, {createRef, useState} from 'react'
import {Button, Container, Form, Grid, Header, Icon, Image, Message, Segment} from "semantic-ui-react";
import {getBase64} from "../../lib/base64";

function ProfileForm({user, onUpdate}) {

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const [formState, setFormState] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = () => {

    // set to loading
    setMessage(null);
    setFormState("loading");

    // create object
    const userObject = {
      name,
      email,
    };

    // set avatar
    avatar && (userObject.avatar = avatar);

    // update user
    onUpdate(userObject)
      .then(() => setFormState(""))
      .then(() => setMessage({error: false, text: "User profile saved!"}))
      .catch((e) => {
        if(e?.content?.code)
          setMessage({error: true, text: e?.content?.message});
        else
          setMessage({error: true, text: "User profile could not be saved!"})
        // reset form state
        setFormState("");
      });

  }

  const handleChange = (e, v) => {

    if(e.target.id === "name")
      setName(v.value);
    else if(e.target.id === "email")
      setEmail(v.value);

  }

  const handleImage = (e) => {
    // check file
    if(!e?.target?.files[0])
      return;
    // check size
    // get data
    getBase64(e.target.files[0])
      .then(r => {
        if(r.length >= 5242880) {
          setMessage({error: true, text: 'File size is limited to ~5 mb. Choose a smaller avatar.'});
          return Promise.reject();
        }
        return r;
      })
      .then(r => setAvatar(r))
      .catch(e => console.error(e));
  }

  // let uploadRef = React.createRef();
  const uploadRef = createRef();

  // callback to trigger the file dialog
  const showFileUpload = () => {
    uploadRef.current.click();
  }

  const imageError = (e) => {
    setAvatar(null);
    console.error(e)
  }

  return (
    <>
      <Container>
        <Grid>
          <Grid.Column mobile={16} tablet={10} computer={10}>
            <Segment>
              <Message attached='top'>
                <Header as='h2' icon textAlign='center'>
                  Profile
                  <Header.Subheader>
                    Manage your user settings.
                  </Header.Subheader>
                </Header>
              </Message>
              <Form className='attached fluid segment' loading={formState === "loading"} onSubmit={handleSubmit}>
                <Form.Group widths='equal'>
                  <Form.Input
                    id='name'
                    label='Name'
                    placeholder='Jane Doe'
                    onChange={handleChange}
                    value={name}
                  />
                </Form.Group>
                <Form.Group widths='equal'>
                  <Form.Input
                    type='email'
                    id='email'
                    label='Email address'
                    placeholder='jane.doe@example.com'
                    onChange={handleChange}
                    value={email}
                  />
                </Form.Group>
                <Button type='submit'>Submit</Button> 
                {avatar !== user.avatar && <i>The avatar has been changed. Submit to upload.</i>}
              </Form>
              {
                (message && message.error) && (
                  <Message attached='bottom' onDismiss={() => setMessage(null)} error>
                    <Icon name='exclamation'/>
                    {message.text}
                  </Message>
                )
              }
              {
                (message && !message.error) && (
                  <Message attached='bottom' onDismiss={() => setMessage(null)} positive>
                    <Icon name='checkmark'/>
                    {message.text}
                  </Message>
                )
              }
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={6} computer={6}>
            <Segment>
              {avatar && <Image src={avatar} alt='Your avatar' onClick={() => showFileUpload()} onError={imageError}/>}
              {!avatar && <Button onClick={() => showFileUpload()}>Choose avatar</Button>}
              <input style={{display: 'none'}} ref={uploadRef} type='file' onChange={(event) => handleImage(event)} />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    </>
  );

}

export default ProfileForm;
