import {AccountContext, AccountType, useAccounts} from "../hooks/Accounts.context";
import {Button, ButtonGroup, Card} from "react-bootstrap";
import AccountBalance from "./AccountBalance";
import AccountSelector from "./AccountSelector";
import {BsGear, BsPlusCircle} from "react-icons/bs";
import EntryFormModal from "../../../components/forms/EntryFormModal";
import AccountsForm from "../forms/Accounts.form";

type Props = {
  account: string | undefined
  setAccount: (id?: string) => void
  accountData: AccountType[]
  className?: string
}

export default function AccountCard ({account, setAccount, accountData, className} : Props) {
  // get edit
  const {edit} = useAccounts();
  // render
  return (
    <Card className={className}>
      <Card.Header>Accounts</Card.Header>
      <Card.Body>
        {(accountData && accountData.length > 0) && (
          <>
            {account ?
              <AccountBalance account={account}/> :
              <h1 className="text-nowrap display-4 text-center text-muted">Select Account</h1>
            }
            <AccountSelector
              accounts={accountData}
              selected={account}
              onSelect={(id: string) => setAccount(id)}
            />
          </>
        )}
        {account && (
          <ButtonGroup className='mt-3 d-flex'>
            <Button onClick={() => edit(account)}>
              <BsGear />
              <span className='ms-2 d-lg-none d-xl-inline'>Edit Account</span>
            </Button>
            <Button onClick={() => edit('')}>
              <BsPlusCircle />
              <span className='ms-2 d-lg-none d-xl-inline'>Add Account</span>
            </Button>
          </ButtonGroup>
        )}
        {(!account && accountData) && (
          <>
            { accountData.length === 0 && <p className='text-center text-muted'>No accounts.</p> }
            <ButtonGroup className='d-flex mt-3'>
              <Button onClick={() => edit('')}>
                <BsPlusCircle />
                <span className='ms-2'>Add Account</span>
              </Button>
            </ButtonGroup>
          </>
        )}
        <EntryFormModal context={AccountContext} name='account'>
          {(entry, update, handleSubmit) =>
            <AccountsForm entry={entry} update={update} handleSubmit={handleSubmit}/>
          }
        </EntryFormModal>
      </Card.Body>
    </Card>
  )
}
