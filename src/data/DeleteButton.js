import {Button} from "semantic-ui-react";
import {useCallback} from "react";
import {Language} from "../language";

function DeleteButton({onDelete, lang}) {

  // callback, when button is clicked. Changes when object changes
  const handleDelete = useCallback(() => {

    // ask and delete if ok
    if(window.confirm(Language.base.confirmDeleteRequestText(lang?.request || 'all objects')))
      onDelete();

  }, [lang, onDelete]);

  // return the button
  return <Button icon='trash alternate' labelPosition='left' content={lang?.buttonText || 'Delete'} negative type='button' onClick={handleDelete} />;

}

export default DeleteButton;
