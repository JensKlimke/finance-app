import DataTable from "../../components/display/DataTable";
import {ButtonGroup, Card, Col, Container, Row} from "react-bootstrap";
import StockProvider, {StockContext, useStocks} from "./Stocks.context";
import {StockCols, StockRows, StockSort} from "./Stocks.table";
import EntryFormModal from "../../components/forms/EntryFormModal";
import StocksForm from "./Stocks.form";
import ImportButton from "../../components/forms/ImportButton";
import ExportButton from "../../components/forms/ExportButton";
import DeleteButton from "../../components/forms/DeleteButton";


export default function StocksPage () {
  // render
  return (
    <StockProvider>
      <StocksContent />
    </StockProvider>
  );
}

const StocksContent = () => {
  // get data
  const {data, edit, eraseAll, saveMany} = useStocks();
  // check data
  if (!data)
    return null;
  // render table
  return (
    <Container>
      <Row>
        <Col lg={8} className='mb-4'>
          <Card>
            <Card.Header>Stocks</Card.Header>
            <Card.Body>
              <DataTable
                tableConfig={StockCols}
                cardConfig={StockRows}
                sortConfig={StockSort}
                data={data}
                onRowClick={(d) => edit(d.id)}
                onAdd={() => edit('')}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
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
      <EntryFormModal context={StockContext} name={'stock entry'}>
        {(entry, update, handleSubmit) =>
          <StocksForm entry={entry} update={update} handleSubmit={handleSubmit}/>
        }
      </EntryFormModal>
    </Container>
  );

}

