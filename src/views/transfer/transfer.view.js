import React, {useCallback, useEffect, useState} from "react";
import {Button, Container, Grid, Header, Icon, Segment} from "semantic-ui-react";
import {TransferContext, Transfers} from "./transfer.controller";
import {ObjectList} from "../../data/ObjectList";
import {DoubleLine} from "../../data/HorizontalDoubleLine";
import ExportButton from "../../data/ExportButton";
import ImportButton from "../../data/ImportButton";
import DeleteButton from "../../data/DeleteButton";
import {Language} from "../../language";
import {currency} from "../../lib/currency";


export default function TransferView() {
  return (
    <Transfers>
      <TransferContext.Consumer>
        {(controller) => controller && <Transfer controller={controller} />}
      </TransferContext.Consumer>
    </Transfers>
  )
}

function Transfer ({controller}) {

  const [statistics, setStatistics] = useState({});

  const calculateStatistics = useCallback(() => {

    controller
      .getAll()
      .then(c => setStatistics(
        {
          receipts: c.reduce((s, v) => s + (v.amount > 0 ? v.amount : 0.0), 0.0),
          disposals: c.reduce((s, v) => s + (v.amount < 0 ? v.amount : 0.0), 0.0),
        }
      ))
      .catch(e => console.log(e));

  }, [controller]);


  useEffect(() => {
    // calculate statistics
    calculateStatistics();
    // register and unregister on unmount
    controller.registerRefreshCallback('transferList', calculateStatistics);
    return () => controller.unregisterRefreshCallback('transferList');
  }, [calculateStatistics, controller])

  return (
    <>
      <Container>
        <Grid reversed='computer'>
          <Grid.Column mobile={16} tablet={16} computer={5}>
            <Segment>
              <Header size='medium' dividing>Balance</Header>
              <Container textAlign='right'>
                <code>{currency.to(statistics.receipts)}</code>  
                <Icon name='arrow right' color='green' />
                <br />
                <code>{currency.to(statistics.disposals)}</code>  
                <Icon name='arrow left' color='red' />
                <br />
                <DoubleLine color='#999'/>
                <code>{currency.to(statistics.disposals + statistics.receipts)}</code>  
                <Icon name='money bill alternate outline' />
                <br />
              </Container>
            </Segment>
            <Segment>
              <Header size='medium' dividing>Manage Data</Header>
              <DataManagement controller={controller} />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={16} computer={11} >
            <Segment>
              <Header size='medium' dividing>Transfer List</Header>
              <ObjectList controller={controller} />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    </>
  );

}

const DataManagement = ({controller}) => {

  // const
  const [objects, setObjects] = useState([]);

  const refresh = useCallback(() => {
    // update all
    controller
      .getAll()
      .then(t => t.map(e => controller.beforeExport(e)))
      .then(t => setObjects(t))
      .catch(e => console.error(e));
  }, [controller])

  const onImport = useCallback((objects) => {
    // save all
    controller
      .createMany(objects.map(e => controller.beforeImport(e)))
      .then(() => console.log(Language.base.importedLogMessage(objects)))
      .then(() => controller.refresh())
      .catch(e => console.error(e))
  }, [controller]);

  const onDeleteAll = useCallback(() => {
    // delete all
    controller
      .deleteAll()
      .then(() => console.log(Language.base.deletedAllLogMessage(objects)))
      .then(() => controller.refresh())
      .catch(e => console.error(e))
  }, [controller, objects]);

  useEffect(() => {
    refresh();
  }, [refresh])

  useEffect(() => {
    // register and unregister on unmount
    controller.registerRefreshCallback('transferListImportExport', refresh);
    return () => controller.unregisterRefreshCallback('transferListImportExport');
  }, [controller, refresh])

  // language
  const lang = {request: 'all transfer entries', buttonText: 'Delete all'};

  return (
    <Button.Group vertical labeled icon fluid>
      {objects && <ExportButton object={objects}/>}
      <ImportButton onImport={onImport} />
      <DeleteButton onDelete={onDeleteAll} lang={lang}/>
    </Button.Group>
  );

}
