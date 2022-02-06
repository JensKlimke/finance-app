import {useEffect, useState} from 'react'
import {Button, Form, Grid, Header, Message, Modal} from 'semantic-ui-react'

function FormModal({object, controller, trigger}) {

  // get form fields
  const {fields: FormFields} = controller.elements;

  // states we need
  const [open, setOpen] = useState(false);
  const [formObject, setFormObject] = useState(null);
  const [error, setError] = useState(null);

  // function to update object
  const updateObject = (object, controller) => {
    // create new or create editable version
    setFormObject(object
      ? controller.beforeEdit(object)
      : controller.instantiate()
    );
  }

  // when controller or object changes, reset form object
  useEffect(() => {
    updateObject(object, controller);
  }, [controller, object])

  // handle modal open
  const handleOpen = () => {
    updateObject(object, controller);
    setError(null);
    setOpen(true)
  }

  // handle modal close
  const handleClose = () => {
    setError(null);
    setOpen(false);
  }

  // handle a change of a field in the form
  const handleChange = (name, value) => {
    let o = {...formObject};
    o[name] = value;
    setFormObject(o);
  }

  // handle errors
  const handleError = (header, error) => {
    if(error?.content?.code === 400) {
      setError({header, message: error.content.message})
    } else {
      setError({header, message: controller.messages.unknownError});
      console.error(error);
    }
  }

  // handle delete
  const handleDelete = () => {
    // ask to delete ...
    if(window.confirm(controller.messages.deleteConfirmationRequest)) {
      // ... and delete
      controller.delete(object.id)
        .then(() => controller.refresh())
        .then(() => setOpen(false))
        .catch(e => handleError(controller.messages.deleteFailed, e));
    }
  }

  // handle save
  const handleSave = () => {
    // switch between edit and create
    if(object) {
      // save object
      controller.save(object.id, controller.beforeUpdate(formObject))
        .then(() => controller.refresh())
        .then(() => setOpen(false))
        .catch(e => handleError(controller.messages.saveFailed, e))
    } else {
      // create object
      controller.create(controller.beforeCreate(formObject))
        .then(() => controller.refresh())
        .then(() => setOpen(false))
        .catch(e => handleError(controller.messages.createFailed, e))
    }
  }

  return (
    <Modal
      closeIcon
      open={open}
      trigger={trigger}
      onClose={handleClose}
      onOpen={handleOpen}
    >
      <Header icon='file text' content={controller.messages.formTitle(object)} />
      <Modal.Content>
        <Form id='object_form' onSubmit={handleSave} loading={!formObject}>
          <FormFields onChange={handleChange} object={formObject} />
        </Form>
        <ErrorMessage error={error}/>
      </Modal.Content>
      <Modal.Actions>
        <Grid>
          <Grid.Column width={8} textAlign='left'>
            {object && <Button negative basic onClick={handleDelete} type='button'>Delete</Button>}
          </Grid.Column>
          <Grid.Column width={8} textAlign='right'>
            <Button type='button' onClick={handleClose}>Abort</Button>
            <Button type='submit' form='object_form'>Save</Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  )
}


const ErrorMessage = ({error}) => {
  return error && (
    <Message error
       header={error.header}
       content={error.message}
    />
  );
}

export default FormModal
