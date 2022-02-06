import {Button, Container, Grid, Header, Segment} from "semantic-ui-react";
import {ContractsStatistics} from "./contract.statistics";
import {ContractContext, Contracts} from "./contract.controller";
import {ObjectList} from "../../data/ObjectList";
import ExportButton from "../../data/ExportButton";
import ImportButton from "../../data/ImportButton";
import DeleteButton from "../../data/DeleteButton";
import {useCallback, useEffect, useState} from "react";



export default function ContractView() {

  return (
    <Contracts>
      <Container>
        <Grid reversed='computer'>
          <Grid.Column mobile={16} tablet={16} computer={5}>
            <Segment>
              <Header size='medium' dividing>Overview</Header>
              <ContractContext.Consumer>
                { (controller) => controller && <ContractsStatistics controller={controller} /> }
              </ContractContext.Consumer>
            </Segment>
            <Segment>
              <ContractContext.Consumer>
                { (controller) => controller && <DataSection controller={controller} /> }
              </ContractContext.Consumer>
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={16} computer={11} >
            <Segment>
              <Header size='medium' dividing>Contract List</Header>
              <ContractContext.Consumer>
                {(controller) => controller && <ObjectList controller={controller} />}
              </ContractContext.Consumer>
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    </Contracts>
  );

}

function DataSection ({controller}) {

  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    // get balances
    controller.getAll()
      .then(o => o.map(e => controller.beforeExport(e)))
      .then(o => setContracts(o))
      .catch(e => console.error(e));
  }, [controller]);

  const onImportBalances = useCallback((objects) => {
    // save imported balances
    controller
      .createMany(objects.map(o => controller.beforeImport(o)))
      .then(() => controller.refresh())
      .catch(e => console.error(e))
  }, [controller]);

  const onDeleteAllBalances = useCallback(() => {
    // delete all balances
    controller
      .deleteAll()
      .then(() => controller.refresh())
      .catch(e => console.error(e))
  }, [controller])

  // language definition
  const lang = {request: 'all contracts', buttonText: 'Delete all'};

  return (
    <>
      <Header size='medium' dividing>Manage Contracts</Header>
      <Button.Group vertical labeled icon fluid>
        <ExportButton object={contracts} />
        <ImportButton onImport={onImportBalances} />
        <DeleteButton onDelete={onDeleteAllBalances} lang={lang}/>
      </Button.Group>
    </>
  )

}
