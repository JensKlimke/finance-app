import React, {useMemo} from "react";
import DataTable from "../../components/display/DataTable";
import {ButtonGroup, Card, Col, Container, Row, Table} from "react-bootstrap";
import TransferProvider, {TransferContext, useTransfers} from "./Transfer.context";
import {TransferCols, TransferRows} from "./Transfer.table";
import {BsArrowLeft, BsArrowRight, BsCash} from "react-icons/bs";
import CurrencyCell from "../../components/display/CurrencyCell";
import ImportButton from "../../components/forms/ImportButton";
import ExportButton from "../../components/forms/ExportButton";
import DeleteButton from "../../components/forms/DeleteButton";
import EntryFormModal from "../../components/forms/EntryFormModal";
import TransferForm from "./Transfer.form";

export default function TransferPage () {
  // render
  return (
    <TransferProvider>
      <TransferContent />
    </TransferProvider>
  );
}

const TransferContent = () => {
  // get data
  const {data, edit, eraseAll, saveMany} = useTransfers();
  // check data
  if (!data)
    return null;
  // render
  return (
    <Container>
      <Row>
        <Col lg={8} className='mb-4'>
          <Card>
            <Card.Header>Transfers</Card.Header>
            <Card.Body>
              <DataTable
                tableConfig={TransferCols}
                cardConfig={TransferRows}
                data={data}
                onRowClick={(d) => edit(d.id)}
                onAdd={() => edit('')}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          {data.totalResults > 0 && (
            <Card className='mb-4'>
              <Card.Header>Balance</Card.Header>
              <Card.Body>
                <BalanceTable />
              </Card.Body>
            </Card>
          )}
          <Card>
            <Card.Header>Data Management</Card.Header>
            <Card.Body>
              <ButtonGroup vertical className='d-flex'>
                <ImportButton onImport={saveMany}/>
                <ExportButton object={data.results}/>
                <DeleteButton onDelete={eraseAll}/>
              </ButtonGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <EntryFormModal context={TransferContext} name={'transfer entry'}>
        {(entry, update, handleSubmit) =>
          <TransferForm entry={entry} update={update} handleSubmit={handleSubmit}/>
        }
      </EntryFormModal>
    </Container>
  );
}


const BalanceTable = () => {
  // get data
  const {data} = useTransfers();
  // calculate
  const amounts = useMemo(() => {
    if (!data) return undefined;
    return {
      in:  data.results.reduce((s, c) => s + (c.amount > 0.0 ? c.amount : 0.0), 0.0),
      out: data.results.reduce((s, c) => s + (c.amount < 0.0 ? c.amount : 0.0), 0.0),
    }
  }, [data]);
  // check data
  if (!amounts)
    return null;
  // render table
  return (
    <Table>
      <tbody>
      <tr>
        <td className='text-end'>
          <CurrencyCell colored amount={amounts.in} />&nbsp;&nbsp;
          <BsArrowRight className='text-success'/>
        </td>
      </tr>
      <tr>
        <td className='text-end'>
          <CurrencyCell colored amount={amounts.out} />&nbsp;&nbsp;
          <BsArrowLeft className='text-danger'/>
        </td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <td className='text-end' style={{'borderTop': '2px solid black'}}>
          <CurrencyCell colored amount={amounts.in + amounts.out} />&nbsp;&nbsp;
          <BsCash />
        </td>
      </tr>
      </tfoot>
    </Table>
  );
}
