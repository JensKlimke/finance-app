import {Button, Form, Icon, Table} from "semantic-ui-react";
import FormModal from "../../data/FormModal";
import AmountInput from "../../data/AmountInput";
import {TransferContext} from "./transfer.controller";
import AmountCell from "../../data/AmountCell";



export function TransfersForm({object: transfer, onChange}) {

  // render
  return (
    <>
      <Form.Field>
        <label>Description</label>
        <Form.Input placeholder='Income from ACME Inc.' value={transfer.description} onChange={(e, {value}) => onChange('description', value)}/>
      </Form.Field>
      <Form.Field>
        <label>Amount</label>
        <AmountInput value={transfer.amount} onChange={value => onChange('amount', value)} />
      </Form.Field>
    </>
  );

}

export function TransfersListHeader ({sort, sorted}) {

  return (
    <Table.Row>
      <Table.HeaderCell width={1} onClick={() => sort('amount')} />
      <Table.HeaderCell width={10} sorted={sorted['description']} onClick={() => sort('description')}>
        Description
      </Table.HeaderCell>
      <Table.HeaderCell width={5} sorted={sorted['amount']} onClick={() => sort('amount')}>
        Amount
      </Table.HeaderCell>
    </Table.Row>
  );

}

export function TransfersListRow ({object: transfer}) {

  return (
    <Table.Row positive={transfer.amount > 0} >
      <Table.Cell>
        <Icon name={transfer.amount < 0 ? 'arrow left' : 'arrow right'} color={transfer.amount > 0 ? 'green' : 'red'} />
      </Table.Cell>
      <Table.Cell style={{cursor: 'pointer'}}>
        <TransferEditModal transfer={transfer}>
          <span>{transfer.description}</span>
        </TransferEditModal>
      </Table.Cell>
      <AmountCell value={transfer.amount} />
    </Table.Row>
  );

}


export const TransferEditModal = ({transfer, children}) =>
  <TransferContext.Consumer>
    {(controller) => (
      controller && <FormModal trigger={children} object={transfer} controller={controller}/>
    )}
  </TransferContext.Consumer>


export const TransferNewModal = () =>
  <TransferContext.Consumer>
    {(controller) => (
      controller && <FormModal trigger={<Button>Add new</Button>} controller={controller} />
    )}
  </TransferContext.Consumer>



export const TransferElements = () => (
  {
    header: TransfersListHeader,
    row: TransfersListRow,
    create: TransferNewModal,
    edit: TransferEditModal,
    fields: TransfersForm,
  }
)
