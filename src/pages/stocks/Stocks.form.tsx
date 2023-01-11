import {FormEvent} from "react";
import {Form} from "react-bootstrap";
import {StockType} from "./Stocks.context";
import {UpdateCallbackType} from "../../hooks/entry";
import AmountInput from "../../components/forms/AmountInput";

export default function StocksForm ({entry, handleSubmit, update} : {
  entry : StockType,
  handleSubmit : (e: FormEvent<HTMLFormElement>) => void,
  update : UpdateCallbackType<StockType>
}) {
  return (
    <Form onSubmit={(e) => handleSubmit(e)} id='entryForm' method='post'>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          autoFocus value={entry.name}
          onChange={(e) => update('name', e.target.value)}
          type="text"
          placeholder="US0378331005"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Symbol</Form.Label>
        <Form.Control
          value={entry.symbol}
          onChange={(e) => update('symbol', e.target.value)}
          type="text"
          placeholder="Apple Inc."
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          value={entry.name}
          onChange={(e) => update('name', e.target.value)}
          type="text"
          placeholder="The Creditor Inc."
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Quantity</Form.Label>
        <Form.Control
          value={entry.quantity}
          onChange={(e) => update('quantity', e.target.value)}
          type="text"
          placeholder="25"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Purchase value</Form.Label>
        <AmountInput value={entry.purchase} onChange={(v: number) => update('purchase', v)}/>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Current value</Form.Label>
        <AmountInput value={entry.value} onChange={(v: number) => update('value', v)}/>
      </Form.Group>
    </Form>
  )
}

