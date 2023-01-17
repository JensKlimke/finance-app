import {PeriodType} from "../hooks/periods";
import {BalanceContext, BalanceType, useBalances} from "../hooks/Balances.context";
import {Button, Card, Carousel, OverlayTrigger, Table, Tooltip} from "react-bootstrap";
import moment from "moment";
import CurrencyCell from "../../../components/display/CurrencyCell";
import {BsPlusCircle} from "react-icons/bs";
import EntryFormModal from "../../../components/forms/EntryFormModal";
import BalancesForm from "../forms/Balances.form";
import {EditCallbackType} from "../../../hooks/entry";
import {useEffect, useMemo, useState} from "react";


export default function BalancesTable ({periods, balances} : {periods?: PeriodType[], balances?: BalanceType[]}) {
  // get data and edit callback
  const {edit} = useBalances();
  // data not available
  if (!periods || !balances) return null;
  // render
  return (
    <>
      { balances.length > 0 && (
        <>
          <Button className='d-block d-md-none mx-auto mb-3' onClick={() => edit('')}>Add balance</Button>
          <Button className='d-none d-md-block mb-3' onClick={() => edit('')}><BsPlusCircle /></Button>
          <TableContent periods={[...periods].reverse()} edit={edit} />
          <CarouselContent periods={[...periods].reverse()} edit={edit} />
          <p className='text-center text-muted'>{`${balances.length} balance entries in total`}</p>
        </>
      )}
      {
        balances.length === 0 && (
          <Button className='d-block mx-auto' onClick={() => edit('')}>Add balance</Button>
        )
      }
      <EntryFormModal context={BalanceContext} name='balance entry'>
        {(entry, update, handleSubmit) =>
          <BalancesForm entry={entry} update={update} handleSubmit={handleSubmit}/>
        }
      </EntryFormModal>
    </>
  )
}

function TableContent ({periods, edit} : {periods: PeriodType[], edit: EditCallbackType<BalanceType>}) {
  return (
    <div className='d-none d-md-block mb-3' style={{overflowX: 'scroll'}}>
      <Table className='mb-0' striped hover bordered>
        <thead>
        <tr>
          <th scope='row'></th>
          { periods.map(p => p.entry?.id && (
            <th scope='col' key={p.entry?.id} className='text-nowrap'>{moment(p.date.end).format('ll')}</th>
          )) }
        </tr>
        </thead>
        <tbody>
        <tr>
          <th scope='row'>Bought</th>
          { periods.map(p => p.entry?.id && (
            <td key={p.entry?.id} className='text-nowrap text-end'>
              <CurrencyCell amount={p.buy} />
            </td>
          )) }
        </tr>
        <tr>
          <th scope='row'>Sold</th>
          { periods.map(p => p.entry?.id && (
            <td key={p.entry?.id} className='text-nowrap text-end'>
              <CurrencyCell amount={p.sell} />
            </td>
          )) }
        </tr>
        <tr>
          <th scope='row'>Sum</th>
          { periods.map(p => p.entry?.id && (
            <td key={p.entry?.id} className='text-nowrap text-end'>
              <CurrencyCell amount={p.sum} />
            </td>
          )) }
        </tr>
        <tr>
          <th scope='row'>Invest</th>
          { periods.map(p => p.entry?.id && (
            <td key={p.entry?.id} className='text-nowrap text-end'>
              <CurrencyCell amount={p.invest} />
            </td>
          )) }
        </tr>
        <tr>
          <th scope='row'>Amount</th>
          { periods.map(p => p.entry?.id && (
            <td key={p.entry?.id} className='text-nowrap text-end' role='button' onClick={() => edit(p.entry?.id)}>
              <OverlayTrigger placement="top" overlay={<Tooltip>{p.entry?.description || ''}</Tooltip>}>
                <strong>
                  <CurrencyCell amount={p.amount} />
                </strong>
              </OverlayTrigger>
            </td>
          )) }
        </tr>
        <tr>
          <th scope='row'>Balance</th>
          { periods.map(p => p.entry?.id && (
            <td key={p.entry?.id} className='text-nowrap text-end'>
              <CurrencyCell amount={p.amount - p.invest} colored /><br />
              <span>{(p.balance * 100).toFixed(2)}&nbsp;%</span>
            </td>
          )) }
        </tr>
        <tr>
          <th scope='row'>ARoI</th>
          { periods.map(p => p.entry?.id && (
            <td key={p.entry?.id} className='text-nowrap text-end'>
              <span>{(p.roi * 100).toFixed(2)}&nbsp;%</span><br />
            </td>
          )) }
        </tr>
        </tbody>
      </Table>
    </div>
  )
}


function CarouselContent({periods, edit} : {periods: PeriodType[], edit: EditCallbackType<BalanceType>}) {
  // states and data
  const [index, setIndex] = useState<number>();
  const pts = useMemo(() => {
    return [...periods].slice(1).reverse();
  }, [periods]);
  // effects
  useEffect(() => {
    setIndex(pts.length - 1);
  }, [pts])
  // render
  return (
    <Carousel className='d-md-none d-block mt-3' activeIndex={index} onSelect={(i, e) => {e !== undefined && setIndex(i)}}>
      {
        pts.map(p => (
          <Carousel.Item key={p.entry?.id || 0}>
            <Card style={{margin: '0 15% 3em'}} role='button' onClick={() => edit(p.entry?.id)}>
              <Card.Header>
                <strong>
                  {moment(p.date.end).format('ll')}
                </strong>
              </Card.Header>
              <Table hover borderless striped className='mb-0'>
                <tbody>
                <tr>
                  <th scope='row'>Bought</th>
                  <td key={p.entry?.id} className='text-nowrap text-end'>
                    <CurrencyCell amount={p.buy} />
                  </td>
                </tr>
                <tr>
                  <th scope='row'>Sold</th>
                  <td key={p.entry?.id} className='text-nowrap text-end'>
                    <CurrencyCell amount={p.sell} />
                  </td>
                </tr>
                <tr>
                  <th scope='row'>Sum</th>
                  <td key={p.entry?.id} className='text-nowrap text-end'>
                    <CurrencyCell amount={p.sum} />
                  </td>
                </tr>
                <tr>
                  <th scope='row'>Invest</th>
                  <td key={p.entry?.id} className='text-nowrap text-end'>
                    <CurrencyCell amount={p.invest} />
                  </td>
                </tr>
                <tr>
                  <th scope='row'>Amount</th>
                  <td key={p.entry?.id} className='text-nowrap text-end'>
                    <OverlayTrigger placement="top" overlay={<Tooltip>{p.entry?.description || ''}</Tooltip>}>
                      <strong>
                        <CurrencyCell amount={p.amount} />
                      </strong>
                    </OverlayTrigger>
                  </td>
                </tr>
                <tr>
                  <th scope='row'>Balance</th>
                  <td key={p.entry?.id} className='text-nowrap text-end'>
                    <CurrencyCell amount={p.amount - p.invest} colored /><br />
                    <span>{(p.balance * 100).toFixed(2)}&nbsp;%</span>
                  </td>
                </tr>
                <tr>
                  <th scope='row'>ARoI</th>
                  <td key={p.entry?.id} className='text-nowrap text-end'>
                    <span>{(p.roi * 100).toFixed(2)}&nbsp;%</span><br />
                  </td>
                </tr>
                </tbody>
              </Table>
            </Card>
          </Carousel.Item>
        ))
      }
    </Carousel>
  );
}

