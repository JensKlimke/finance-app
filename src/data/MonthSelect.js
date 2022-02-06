import {useEffect, useState} from "react";
import {Button, Form} from "semantic-ui-react";
import {monthName} from "../lib/calendar";


function MonthButton({active, month, onSelect}) {

  const [isActive, setActive] = useState(active);

  useEffect(() => {
    setActive(active);
  }, [active])

  const handleSelect = () => {
    let state = !isActive;
    setActive(state)
    onSelect(state);
  }

  return (
    <td>
      <Button
        style={{width: "6em"}}
        basic={!isActive}
        primary={isActive}
        type='button'
        onClick={() => handleSelect()}
      >
        {monthName(month)}
      </Button>
      <Form.Checkbox style={{display: "none"}} checked={isActive} />
    </td>
  )

}


function MonthSelect({value, onChange}) {

  const [months, setMonths] = useState(value);

  const handleSelect = (month, state) => {
    let m = [...months];
    m[month] = state;
    setMonths(m);
    onChange(m);
  }

  useEffect(() => {
    setMonths([...value]);
  }, [value])

  return (
    <table>
      <tbody>
      {
        [0,1,2,3].map(i => (
          <tr key={i}>
            {[0,1,2].map(j => {
              let m = i * 3 + j;
              return (
                <MonthButton
                  key={j}
                  active={months[m]}
                  month={m}
                  onSelect={(s) => handleSelect(m, s)}
                />
              )
            })}
          </tr>
        ))
      }
      </tbody>
    </table>
  );

}


export default MonthSelect;
