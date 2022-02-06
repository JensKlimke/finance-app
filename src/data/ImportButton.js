import {Button} from "semantic-ui-react";
import {useCallback} from "react";
import {Language} from "../language";

function ImportButton({onImport, validator}) {

  const handleImport = useCallback(() => {

    // request message
    const req = (o) => Language.base.confirmImportRequestText(o);

    // read text from clipboard
    navigator.clipboard.readText()
      .then(t => parseAndCheck(t, validator || (v => v)))
      .then(o => window.confirm(req(o)) ? o : Promise.reject())
      .then(o => onImport(o))
      .catch(e => {
        e || console.log(Language.base.importAbortedLog);
        e && console.error(e);
      });

  }, [onImport, validator])

  // render button
  return <Button labelPosition='left' icon='arrow alternate circle right outline' content='Import' type='button' onClick={handleImport} />

}


const parseAndCheck = (text, validator) => new Promise((resolve, reject) => {

  // parse text
  try {
    resolve(validator(JSON.parse(text)));
  } catch(e) {
    window.alert(Language.base.importFailedAlert(e));
    reject(e);
  }

});


export default ImportButton;
