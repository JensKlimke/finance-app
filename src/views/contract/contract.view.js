import {Container, Grid, Header, Segment} from "semantic-ui-react";
import {ContractsStatistics} from "./contract.statistics";
import {ContractContext, Contracts} from "./contract.controller";
import ObjectList from "../../data/ObjectList";
import DataSection from "../../data/DataSection";


export default function ContractView() {

  // language definition
  const lang = {request: 'all contracts', buttonText: 'Delete all'};

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
                { (controller) => controller && <DataSection controller={controller} lang={lang} /> }
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

