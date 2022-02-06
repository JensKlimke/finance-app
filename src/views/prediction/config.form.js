import {Button, Container, Form, Message} from "semantic-ui-react";
import 'react-calendar/dist/Calendar.css';
import {useCallback, useEffect, useState} from "react";
import AmountInput from "../../data/AmountInput";
import ExportButton from "../../data/ExportButton";
import ImportButton from "../../data/ImportButton";


export function ConfigForm({controller}) {

  const [config, setConfig] = useState(null);
  const [message, setMessage] = useState(null);

  const refresh = useCallback(() => {
    controller
      .get()
      .then(c => {
        if(c !== true)
          setConfig(controller.beforeEdit(c));
        else
          setConfig(controller.instantiate())
      })
      .catch(e => console.log(e));
  }, [controller])

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = () => {
    controller
      .save(controller.beforeUpdate(config))
      .then(() => controller.refresh())
      .then(() => refresh())
      .then(() => setMessage({error: false, title: 'Success', text: 'The configuration has been saved.'}))
      .catch(handleError)
  }

  // handle errors
  const handleError = (error) => {
    if(error?.content?.code === 400) {
      setMessage({error: true, title: "Failed saving", text: error.content.message})
    } else {
      setMessage({error: true, title: "Something went wrong", text: controller.messages.unknownError});
      console.error(error);
    }
  }

  const handleImport = (object) => {
    setConfig(controller.beforeEdit(object));
  }

  const onChange = (key, value) => {
    const obj = {...config};
    obj[key] = value;
    setConfig(obj);
    setMessage(null);
  }

  if(!config)
    return <></>;

  // render
  return (
    <Container>
      <Message
        attached
        header='Configuration'
        content='Setup the expected data to calculate the prediction.'
      />
      <Form
        onSubmit={save} id='config-form'
        className='attached fluid segment'
      >
        <Form.Field>
          <label>Return of invest rate (in %)</label>
          <Form.Input placeholder='6' value={config.roi} onChange={(e, {value}) => onChange('roi', value)}/>
        </Form.Field>
        <Form.Group widths='equal'>
          <Form.Input fluid label='Tax rate (in %)' placeholder='25' value={config.tax} onChange={(e, {value}) => onChange('tax', value)}/>
          <AmountInput fluid label='Tax allowance ' value={config.taxAllowance} onChange={value => onChange('taxAllowance', value)}/>
        </Form.Group>
        <Form.Field>
          <label>Inflation rate (in %)</label>
          <Form.Input placeholder='2' value={config.inflation} onChange={(e, {value}) => onChange('inflation', value)}/>
        </Form.Field>
        <Form.Group widths='equal'>
          <AmountInput fluid label='Savings rate' value={config.savingsRate} onChange={value => onChange('savingsRate', value)}/>
          <Form.Input fluid label='Dynamics rate' autoFocus placeholder='0.01' value={config.dynamics} onChange={(e, {value}) => onChange('dynamics', value)}/>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Input fluid label='Start year' placeholder='2018' value={config.startYear} onChange={(e, {value}) => onChange('startYear', value)}/>
          <Form.Input fluid label='Year of pension' placeholder='2041' value={config.pensionYear} onChange={(e, {value}) => onChange('pensionYear', value)}/>
        </Form.Group>
        <Button type='submit' form='config-form' primary>Save</Button>
        <ExportButton object={controller.beforeUpdate(config)} />
        <ImportButton onImport={handleImport}/>
      </Form>
      <FormMessage message={message} dismiss={() => setMessage(null)} />
    </Container>
  );

}


const FormMessage = ({message, dismiss}) => {

  if(!message)
    return <></>;

  return (
    <Message
      attached='bottom'
      positive={!message.error} error={message.error}
      onDismiss={dismiss}
      icon={message.error ? 'frown outline' : 'check'}
      header={message.title}
      content={message.text}
    />
  );

}

export default ConfigForm;
