import {Button} from "semantic-ui-react";
import {useCallback, useState} from "react";
import {Language} from "../language";

function ExportButton({object}) {

  // state (to render the button text)
  const [copied, setCopied] = useState(false);

  // callback, when button is clicked. Changes when object changes
  const handleExport = useCallback(() => {

    // copy text
    navigator.clipboard
      .writeText(JSON.stringify(object))
      .then(() => setCopied(true))
      .then(() => window.setTimeout(() => setCopied(false), 2000))
      .then(() => console.log(Language.base.exportedLogMessage(object)))
      .catch(e => console.error(e));

  }, [object]);

  // don't show, when object is null
  if(object === null)
    return <></>;

  // get button text
  const btnText = copied ? Language.base.copiedButtonMessage : Language.base.exportButtonText;

  // return the button
  return <Button labelPosition='left' icon='arrow alternate circle left outline' content={btnText} type='button' onClick={handleExport} />

}

export default ExportButton;
