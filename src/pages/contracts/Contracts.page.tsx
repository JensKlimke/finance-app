import React, {useEffect} from "react";
import {ButtonGroup, Card, Col, Container, Row} from "react-bootstrap";
import ContentMessage from "../../components/display/ContentMessage";
import EntryFormModal from "../../components/forms/EntryFormModal";
import {MetricsTable} from "./MetricsTable";
import {MonthsTable} from "./MonthsTable";
import {ContractCols, ContractRows, ContractSort} from "./Contracts.table";
import ContractsForm from "./Contracts.form";
import ContractProvider, {ContractContext, useContracts, useContractStatistics} from "./Contracts.context";
import DataTable from "../../components/display/DataTable";
import ImportButton from "../../components/forms/ImportButton";
import ExportButton from "../../components/forms/ExportButton";
import DeleteButton from "../../components/forms/DeleteButton";

export default function ContractsPage() {
  // render
  return (
    <ContractProvider>
      <ContractContent/>
    </ContractProvider>
  );
}

const ContractContent = () => {
  // get data
  const {data : contractsData, edit, saveMany, eraseAll} = useContracts();
  const {data : statisticsData, reload : reloadStatistics} = useContractStatistics();
  // effects
  useEffect(() => reloadStatistics(), [reloadStatistics, contractsData]);
  // check data
  if (!statisticsData || !contractsData)
    return <ContentMessage text={'Loading contracts'}/>;
  // render
  return (
    <Container>
      <Row>
        <Col lg={8} className='mb-4' >
          <Card>
            <Card.Header>Contracts</Card.Header>
            <Card.Body>
              <DataTable
                tableConfig={ContractCols}
                cardConfig={ContractRows}
                sortConfig={ContractSort}
                data={contractsData}
                onRowClick={(d) => edit(d.id)}
                onAdd={() => edit('')}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          { contractsData.results.length > 0 && (
            <>
              <Card className='mb-4'>
                <Card.Header>Per Month</Card.Header>
                <Card.Body>
                  <MonthsTable data={statisticsData}/>
                </Card.Body>
              </Card>
              <Card className='mb-4'>
                <Card.Header>Metrics</Card.Header>
                <Card.Body>
                  <MetricsTable data={statisticsData}/>
                </Card.Body>
              </Card>
            </>
          )}
          <Card>
            <Card.Header>Data Management</Card.Header>
            <Card.Body>
              <ButtonGroup vertical className='d-flex'>
                <ImportButton onImport={saveMany}/>
                <ExportButton object={contractsData.results}/>
                <DeleteButton onDelete={eraseAll}/>
              </ButtonGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <EntryFormModal context={ContractContext} name='contract'>
        {(entry, update, handleSubmit) =>
          <ContractsForm entry={entry} update={update} handleSubmit={handleSubmit}/>
        }
      </EntryFormModal>
    </Container>
  );
}





