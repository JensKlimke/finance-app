import {Fragment} from "react";
import {Badge, Button, Card, Table} from "react-bootstrap";
import moment from "moment";
import CurrencyCell from "../../../components/display/CurrencyCell";
import {OrdersContext, OrderType, TypeMapping, useOrders} from "../hooks/Orders.context";
import EntryFormModal from "../../../components/forms/EntryFormModal";
import OrdersForm from "../forms/Orders.form";
import {PeriodType} from "../hooks/periods";
import {BsPlusCircle} from "react-icons/bs";
import {EditCallbackType} from "../../../hooks/entry";


export default function OrdersTable ({periods, orders} : {periods?: PeriodType[], orders?: OrderType[]}) {
  // get data and edit callback
  const {edit} = useOrders();
  // data not available
  if (!periods || !orders) return null;
  // render
  return (
    <>
      { orders.length > 0 && (
        <>
          <Button className='d-block d-md-none mx-auto mb-3' onClick={() => edit('')}>Add order</Button>
          <Button className='d-none d-md-block mb-3' onClick={() => edit('')}><BsPlusCircle /></Button>
          <TableContent periods={periods} edit={edit} />
          <CardContent periods={periods} edit={edit} />
          <p className='text-center text-muted'>{`${orders.length} order entries in total`}</p>
        </>
      )}
      {
        orders.length === 0 && (
          <Button className='d-block mx-auto' onClick={() => edit('')}>Add order</Button>
        )
      }
      <EntryFormModal context={OrdersContext} name='order'>
        {(entry, update, handleSubmit) =>
          <OrdersForm entry={entry} update={update} handleSubmit={handleSubmit}/>
        }
      </EntryFormModal>
    </>
  )
}

function TableContent ({periods, edit} : {periods: PeriodType[], edit: EditCallbackType<OrderType>}) {
  return (
    <div className='d-none d-md-block'>
      <Table striped bordered hover>
        <thead>
        <tr>
          <th scope='col'>Date</th>
          <th scope='col'>Type</th>
          <th scope='col'>Amount</th>
          <th scope='col'>Description</th>
        </tr>
        </thead>
        <tbody>
        {
          periods.map(p =>
            <Fragment key={p.entry?.id || ''}>
              {
                p.date.end && (
                  <tr>
                    <td colSpan={4} style={{fontSize: '1.5em'}}>
                      <Badge bg='success' style={{position: "relative", left: '-0.8em', borderRadius: '0 5px 5px 0'}}>
                        {moment(p.date.end).format('ll')}
                      </Badge>
                    </td>
                  </tr>
                )
              }
              {
                [...p.orders].reverse().map(o => (
                  <tr key={o.id} onClick={() => edit(o.id)} role='button'>
                    <td width='15%' className='text-nowrap'>{moment(o.date).format('ll')}</td>
                    <td width='15%' className='text-nowrap'>{TypeMapping[o.type] || o.type}</td>
                    <td width='15%' className='text-nowrap text-end'>
                      <CurrencyCell amount={o.amount} colored={true}/>
                    </td>
                    <td width='55%'>{o.description}</td>
                  </tr>
                ))
              }
            </Fragment>
          )
        }
        </tbody>
      </Table>
    </div>
  )
}

function CardContent ({periods, edit} : {periods: PeriodType[], edit: EditCallbackType<OrderType>}) {
  return (
    <div className='d-block d-md-none mb-3'>
      {
        periods.map(p =>
          <Fragment key={p.entry?.id || ''}>
            {
              p.date.end && (
                <div style={{fontSize: '1.5em'}} className='mb-2'>
                  <Badge bg='success' style={{position: "relative", left: '-0.8em', borderRadius: '0 5px 5px 0'}}>
                    {moment(p.date.end).format('ll')}
                  </Badge>
                </div>
              )
            }
            {
              p.orders.map(o => (
                <Card key={o.id} onClick={() => edit(o.id)} role='button' className='mb-3'>
                  <Card.Header>{moment(o.date).format('ll')}</Card.Header>
                  <Table borderless striped className='m-0'>
                    <tbody>
                    <tr>
                      <td>Type</td>
                      <td width='15%' className='text-nowrap text-end'>{TypeMapping[o.type] || o.type}</td>
                    </tr>
                    <tr>
                      <td>Amount</td>
                      <td width='15%' className='text-nowrap text-end'>
                        <CurrencyCell amount={o.amount} colored={true}/>
                      </td>
                    </tr>
                    <tr>
                      <td>Description</td>
                      <td width='55%' className='text-end'>{o.description}</td>
                    </tr>
                    </tbody>
                  </Table>
                </Card>
              ))
            }
          </Fragment>
        )
      }
    </div>
  )
}
