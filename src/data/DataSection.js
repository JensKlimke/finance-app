import {Button, Header} from "semantic-ui-react";
import ExportButton from "./ExportButton";
import ImportButton from "./ImportButton";
import DeleteButton from "./DeleteButton";
import {useCallback, useEffect, useState} from "react";

export default function DataSection ({controller, lang}) {

  const [objects, setObjects] = useState([]);

  useEffect(() => {
    // get balances
    controller.getAll()
      .then(o => o.map(e => controller.beforeExport(e)))
      .then(o => setObjects(o))
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

  return (
    <>
      <Header size='medium' dividing>Manage Contracts</Header>
      <Button.Group vertical labeled icon fluid>
        <ExportButton object={objects} />
        <ImportButton onImport={onImportBalances} />
        <DeleteButton onDelete={onDeleteAllBalances} lang={lang}/>
      </Button.Group>
    </>
  )

}
