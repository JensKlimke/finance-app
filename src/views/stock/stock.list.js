import {Button, Form, Table} from "semantic-ui-react";
import AmountInput from "../../data/AmountInput";
import AmountCell from "../../data/AmountCell";
import FormModal from "../../data/FormModal";
import {StockContext} from "./stock.controller";

export function StockForm({object: stock, onChange}) {

  // render
  return (
    <>
      <Form.Field>
        <label>Symbol</label>
        <Form.Input placeholder='ALV.DE' value={stock.symbol} onChange={(e, {value}) => onChange('symbol', value)}/>
      </Form.Field>
      <Form.Field>
        <label>Name</label>
        <Form.Input placeholder='Allianz SE' value={stock.name} onChange={(e, {value}) => onChange('name', value)}/>
      </Form.Field>
      <Form.Field>
        <label>Quantity</label>
        <Form.Input placeholder='12' value={stock.quantity} onChange={(e, {value}) => onChange('quantity', value)}/>
      </Form.Field>
      <Form.Field>
        <label>Purchase Value</label>
        <AmountInput value={stock.purchase} onChange={value => onChange('purchase', value)} />
      </Form.Field>
      <Form.Field>
        <label>Current Value</label>
        <AmountInput value={stock.value} onChange={value => onChange('value', value)} />
      </Form.Field>
    </>
  );

}

export function StockListHeader ({sort, sorted}) {

  return (
    <Table.Row>
      <Table.HeaderCell width={1}>ISIN</Table.HeaderCell>
      <Table.HeaderCell width={6} sorted={sorted['name']} onClick={() => sort('name')}>
        Name
      </Table.HeaderCell>
      <Table.HeaderCell width={3} sorted={sorted['quantity']} onClick={() => sort('quantity')}>
        Quantity
      </Table.HeaderCell>
      <Table.HeaderCell width={3} sorted={sorted['purchase']} onClick={() => sort('purchase')}>
        Purchase Value
      </Table.HeaderCell>
      <Table.HeaderCell width={3} sorted={sorted['value']} onClick={() => sort('value')}>
        Current Value
      </Table.HeaderCell>
    </Table.Row>
  );

}

export function StockListRow ({object: item}) {

  return (
    <Table.Row>
      <Table.Cell textAlign='center'>
        {item.symbol}
      </Table.Cell>
      <Table.Cell>
        <StockEditModal stock={item}>
          <span style={{cursor: 'pointer'}}>{item.name}</span>
        </StockEditModal>
      </Table.Cell>
      <Table.Cell textAlign='right'>
        <code>{Number(item.quantity).toFixed(2)}</code>
      </Table.Cell>
      <AmountCell value={item.purchase} />
      <AmountCell value={item.value} />
    </Table.Row>
  );

}

export const StockEditModal = ({stock, children}) =>
  <StockContext.Consumer>
    {(controller) => (
      controller && <FormModal trigger={children} object={stock} controller={controller}/>
    )}
  </StockContext.Consumer>


export const StockNewModal = () =>
  <StockContext.Consumer>
    {(controller) => (
      controller && <FormModal trigger={<Button>Add new</Button>} controller={controller} />
    )}
  </StockContext.Consumer>
