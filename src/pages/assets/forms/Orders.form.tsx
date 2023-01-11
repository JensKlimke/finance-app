import {OrderType} from "../hooks/Orders.context";
import {FormEvent} from "react";
import {Form} from "react-bootstrap";
import AmountInput from "../../../components/forms/AmountInput";
import {UpdateCallbackType} from "../../../hooks/entry";
import moment from "moment";
import Calendar from "react-calendar";
import '../../../assets/styles/react-calendar.scss'

// create options
const options = [
  { value: '', text: '--- Select Type ---', disabled: true},
  { value: 'dividend', text: 'Dividend' },
  { value: 'savings_plan', text: 'Savings plan' },
  { value: 'purchase', text: 'Purchase/Investment' },
  { value: 'sale', text: 'Sale/Divestment' },
  { value: 'other', text: 'Other (with sign)' },
];

export default function OrdersForm({entry, handleSubmit, update}: {
  entry: OrderType,
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void,
  update: UpdateCallbackType<OrderType>
}) {
  return (
    <Form onSubmit={(e) => handleSubmit(e)} id='entryForm' method='post'>
      <Form.Group className="mb-3">
        <Form.Label>Type</Form.Label>
        <Form.Select
          value={entry.type}
          onChange={(e) => update('type', e.currentTarget.value)}
        >
          {options.map(o => <option key={o.value} value={o.value} disabled={o.disabled || false}>{o.text}</option>)}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Amount</Form.Label>
        <AmountInput
          value={entry.amount}
          onChange={(v: number) => update('amount', v)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          autoFocus
          value={entry.description}
          onChange={(e) => update('description', e.target.value)}
          type="text"
          placeholder="My Order"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <div className='text-center'>
          <Calendar className='m-auto' onChange={(d : Date) => update('date', moment(d).format('YYYY-MM-DD'))} value={new Date(entry.date)} />
        </div>
      </Form.Group>
    </Form>
  )
}

