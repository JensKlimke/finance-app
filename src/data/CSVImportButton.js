import {Button} from "semantic-ui-react";
import {useCallback} from "react";
import {Language} from "../language";

export default function CSVImportButton({onImport, parseLine}) {

  const handleImport = useCallback(() => {

    // request message
    const req = (o) => Language.base.confirmImportRequestText(o);

    // read text from clipboard
    navigator.clipboard.readText()
      .then(csv => {
        const lines = csv.split("\n");
        return lines.map(l => parseLine(l)).filter(e => !!e);
      })
      .then(o => window.confirm(req(o)) ? o : Promise.reject())
      .then(o => onImport(o))
      .catch(e => {
        e || console.log(Language.base.importAbortedLog);
        e && console.error(e);
      });

  }, [onImport, parseLine])

  // render button
  return <Button labelPosition='left' icon='arrow alternate circle right outline' content='Import CSV' type='button' onClick={handleImport} />

}
