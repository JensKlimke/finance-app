import {Button, Header} from "semantic-ui-react";
import ExportButton from "./ExportButton";
import ImportButton from "./ImportButton";
import DeleteButton from "./DeleteButton";
import {useCallback, useEffect, useState} from "react";
import CSVImportButton from "./CSVImportButton";

export default function DataSection ({controller, lang, csv}) {

  const [objects, setObjects] = useState([]);

  useEffect(() => {
    // get objects
    controller.getAll()
      .then(o => o.map(e => controller.beforeExport(e)))
      .then(o => setObjects(o))
      .catch(e => console.error(e));
  }, [controller]);

  const onImport = useCallback((objects) => {
    // save imported objects
    controller
      .createMany(objects.map(o => controller.beforeImport(o)))
      .then(() => controller.refresh())
      .catch(e => console.error(e))
  }, [controller]);

  const onDeleteAll = useCallback(() => {
    // delete all objects
    controller
      .deleteAll()
      .then(() => controller.refresh())
      .catch(e => console.error(e))
  }, [controller])

  return (
    <>
      <Header size='medium' dividing>Manage {lang.header || 'Objects'}</Header>
      <Button.Group vertical labeled icon fluid>
        <ExportButton object={objects} />
        <ImportButton onImport={onImport} />
        { csv && <CSVImportButton onImport={onImport} parseLine={csv} /> }
        <DeleteButton onDelete={onDeleteAll} lang={lang}/>
      </Button.Group>
    </>
  )

}
