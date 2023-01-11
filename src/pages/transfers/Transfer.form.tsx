import {FormEvent} from "react";
import {Form} from "react-bootstrap";
import {UpdateCallbackType} from "../../hooks/entry";
import AmountInput from "../../components/forms/AmountInput";
import {TransferType} from "./Transfer.context";

export default function TransferForm ({entry, handleSubmit, update} : {
  entry : TransferType,
  handleSubmit : (e: FormEvent<HTMLFormElement>) => void,
  update : UpdateCallbackType<TransferType>
}) {
  return (
    <Form onSubmit={(e) => handleSubmit(e)} id='transferForm' method='post'>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          autoFocus
          value={entry.description}
          onChange={(e ) => update('description', e.target.value)}
          type="text"
          placeholder="My Transfer"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Amount</Form.Label>
        <AmountInput
          value={entry.amount}
          onChange={(v : number) => update('amount', v)}
        />
      </Form.Group>
    </Form>
  )
}

