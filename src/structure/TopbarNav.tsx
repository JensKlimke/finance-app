import {Button} from "react-bootstrap";
import {BsList} from "react-icons/bs";
import React, {useState} from "react";

export default function TopbarNav({children} : React.PropsWithChildren) {
  // states
  const [open, setOpen] = useState(false);
  // render
  return (
    <div className='d-inline-block d-sm-none float-right'>
      <Button
        className='toggle-button'
        variant='outline-secondary'
        onClick={ () => setOpen(!open) }
      >
        <BsList />
      </Button>
      <div className={'TopNav ' + (open ? '' : 'd-none')}>
        <hr />
        {children}
      </div>
    </div>
  )
}
