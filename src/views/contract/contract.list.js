import moment from "moment";
import {Button, Form, Icon, Popup, Table} from "semantic-ui-react";
import FormModal from "../../data/FormModal";
import MonthCircle from "../../data/MonthCircle";
import MonthSelect from "../../data/MonthSelect";
import AmountInput from "../../data/AmountInput";
import {ContractContext} from "./contract.controller";
import AmountCell from "../../data/AmountCell";



export function ContractsForm({object: contract, onChange}) {

  // render
  return (
    <>
      <Form.Field>
        <label>Shared</label>
        <Form.Checkbox toggle checked={contract.shared} onChange={(e, {checked}) => onChange('shared', checked)} />
      </Form.Field>
      <Form.Field>
        <label>Name</label>
        <Form.Input placeholder='My Contract' value={contract.name} onChange={(e, {value}) => onChange('name', value)}/>
      </Form.Field>
      <Form.Field>
        <label>Creditor</label>
        <Form.Input placeholder='ACME Inc.' value={contract.creditor} onChange={(e, {value}) => onChange('creditor', value)}/>
      </Form.Field>
      <Form.Field>
        <label>Amount</label>
        <AmountInput value={contract.amount} onChange={value => onChange('amount', value)} />
      </Form.Field>
      <Form.Group grouped>
        <label>Due months</label>
        <MonthSelect value={contract.months} onChange={(value) => onChange('months', value)} />
      </Form.Group>
    </>
  );

}

export function ContractsListHeader ({sort, sorted}) {

  return (
    <Table.Row>
      <Table.HeaderCell width={1} />
      <Table.HeaderCell width={6} sorted={sorted['name']} onClick={() => sort('name')}>
        Description
      </Table.HeaderCell>
      <Table.HeaderCell width={3} sorted={sorted['amount']} onClick={() => sort('amount')}>
        Contract amount
      </Table.HeaderCell>
      <Table.HeaderCell width={3} sorted={null}>
        Annual amount
      </Table.HeaderCell>
      <Table.HeaderCell width={2} sorted={null}>
        Next
      </Table.HeaderCell>
    </Table.Row>
  );

}

export function ContractsListRow ({object: contract}) {

  // format next month
  const nextMonth = moment(Date.UTC(contract.next.year, contract.next.month, 1, 0, 0, 0)).format('MMM YY');

  return (
    <Table.Row>
      <Table.Cell textAlign='center'>
        {contract.shared && <Icon name='handshake outline'/>}
      </Table.Cell>
      <Table.Cell style={{cursor: 'pointer'}}>
        <ContractEditModal contract={contract}>
          <div>
            <span>{contract.name}</span><br />
            <i style={{color: 'gray'}}>{contract.creditor}</i>
          </div>
        </ContractEditModal>
      </Table.Cell>
      <AmountCell value={contract.amount} />
      <AmountCell value={contract.annualAmount} />
      <Table.Cell textAlign='center'>
        <Popup
          header={nextMonth}
          content='Next due date'
          trigger={<div><MonthCircle months={contract.months} next={contract.next.month} /></div>}
        />
      </Table.Cell>
    </Table.Row>
  );

}


export const ContractEditModal = ({contract, children}) =>
  <ContractContext.Consumer>
    {(controller) => (
      controller && <FormModal trigger={children} object={contract} controller={controller}/>
    )}
  </ContractContext.Consumer>


export const ContractNewModal = () =>
  <ContractContext.Consumer>
    {(controller) => (
      controller && <FormModal trigger={<Button>Add new</Button>} controller={controller} />
    )}
  </ContractContext.Consumer>


