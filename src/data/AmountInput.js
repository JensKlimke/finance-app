import {evaluate} from "mathjs";
import {Form, Label} from "semantic-ui-react";
import {useCallback, useState} from "react";

export default function AmountInput ({value, onChange, autoFocus, label, fluid}) {

  const [val, setVal] = useState(value);
  const [error, setError] = useState(false);

  // react on val
  const changeValue = useCallback(value => {

    // set pure value
    setVal(value);

    try {
      // try to evaluate
      const v = value.trim() === '' ? 0 : Math.round(evaluate(value) * 100) / 100;
      onChange(v);

    } catch(e) {
      // on error return
      setError(true);
      return;
    }

    // no error
    setError(false);

  }, [onChange])

  return (
    <Form.Input
      label={label}
      fluid={fluid}
      onChange={(e, {value}) => changeValue(value)}
      onBlur={() => setVal(value)}
      value={val}
      autoFocus={autoFocus}
      labelPosition='right'
      type='text'
      placeholder='49.59'
    >
      <Label basic>€</Label>
      <input />
      <Label color={error ? 'red' : undefined}>= {value}</Label>
    </Form.Input>
  )

}
