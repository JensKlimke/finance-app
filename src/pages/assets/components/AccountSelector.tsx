import {Button, ButtonGroup} from "react-bootstrap";
import {AccountType} from "../hooks/Accounts.context";

export default function AccountSelector ({accounts, selected, onSelect} : {accounts : AccountType[], selected : string | undefined, onSelect : (id : string) => void }) {
  // if only one account, show as header
  if (accounts.length === 1)
    return <h4 className='text-center mb-4'>{accounts[0].name}</h4>;
  // render selector list
  return (
    <ButtonGroup vertical className='d-flex'>
      {
        accounts.map(a =>
          <Button
            key={a.id}
            onClick={() => onSelect(a.id || '')}
            variant={selected === a.id ? 'outline-primary' : 'primary'}
          >
            {a.name}
          </Button>
        )
      }
    </ButtonGroup>
  );
}
