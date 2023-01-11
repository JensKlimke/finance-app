import {FormEvent} from "react";
import {Form} from "react-bootstrap";
import {AccountType} from "../hooks/Accounts.context";
import {UpdateCallbackType} from "../../../hooks/entry";

export default function AccountsForm ({entry, handleSubmit, update} : {
  entry : AccountType,
  handleSubmit : (e: FormEvent<HTMLFormElement>) => void,
  update : UpdateCallbackType<AccountType>
}) {
  return (
    <Form onSubmit={(e) => handleSubmit(e)} id='entryForm' method='post'>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          autoFocus
          value={entry.name}
          onChange={(e) => update('name', e.target.value)}
          type="text"
          placeholder="My Account"
        />
      </Form.Group>
    </Form>
  )
}

