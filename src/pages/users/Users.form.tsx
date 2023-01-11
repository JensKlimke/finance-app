import {UserType} from "./Users.context";
import {FormEvent} from "react";
import {Form} from "react-bootstrap";
import {UpdateCallbackType} from "../../hooks/entry";


// create options
const options = [
  { value: '', text: '--- Select Type ---', disabled: true},
  { value: 'user', text: 'User' },
  { value: 'admin', text: 'Admin' },
];

export default function UsersForm ({entry, handleSubmit, update} : {
  entry : UserType,
  handleSubmit : (e: FormEvent<HTMLFormElement>) => void,
  update : UpdateCallbackType<UserType>
}) {
  return (
    <Form onSubmit={(e) => handleSubmit(e)} id='entryForm' method='post'>
      <Form.Group className="mb-3">
        <Form.Label>Role</Form.Label>
        <Form.Select
          value={entry.role}
          onChange={(e) => update('role', e.currentTarget.value)}
        >
          {options.map(o =>
            <option key={o.value} value={o.value} disabled={o.disabled || false}>{o.text}</option>
          )}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          autoFocus
          value={entry.name}
          onChange={(e) => update('name', e.target.value)}
          type="text"
          placeholder="John Doe"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          value={entry.email}
          onChange={(e) => update('email', e.target.value)}
          type="email"
          placeholder="john.doe@example.com"
        />
        {/*<InputGroup>*/}
        {/*  <Form.Control*/}
        {/*    value={entry.email}*/}
        {/*    onChange={(e) => update('email', e.target.value)}*/}
        {/*    type="email"*/}
        {/*    placeholder="john.doe@example.com"*/}
        {/*  />*/}
        {/*  <InputGroup.Checkbox*/}
        {/*    label='verified'*/}
        {/*    checked={entry.isEmailVerified}*/}
        {/*    onChange={(e : ChangeEvent<HTMLInputElement>) => update('isEmailVerified', e.target.checked)}*/}
        {/*  />*/}
        {/*</InputGroup>*/}
      </Form.Group>
    </Form>
  )
}

