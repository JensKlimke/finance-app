import {BalanceType} from "../hooks/Balances.context";
import {FormEvent} from "react";
import {Form} from "react-bootstrap";
import AmountInput from "../../../components/forms/AmountInput";
import {UpdateCallbackType} from "../../../hooks/entry";
import moment from "moment";
import Calendar from "react-calendar";
import '../../../assets/styles/react-calendar.scss'


export default function BalancesForm({entry, handleSubmit, update}: {
  entry: BalanceType,
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void,
  update: UpdateCallbackType<BalanceType>
}) {
  return (
    <Form onSubmit={(e) => handleSubmit(e)} id='entryForm' method='post'>
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
          placeholder="My Balance"
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

