import React, {createContext, useContext} from "react";
import {defaultContext, EntryContextType, GenericEntryProvider} from "../../../hooks/entry";

export type AccountType = {
  id?: string
  name: string
}

export const defaultAccount = () => ({
  name: '',
});

export const cleanAccountCopy = (account: AccountType) => ({
  name: account.name,
})


export const AccountContext = createContext<EntryContextType<AccountType>>(defaultContext);

export const useAccounts = () => useContext(AccountContext);

const AccountProvider = GenericEntryProvider<AccountType>('accounts',
  cleanAccountCopy,
  defaultAccount,
  (context : EntryContextType<AccountType>, children : React.ReactNode) => (
    <AccountContext.Provider value={context}>
      {children}
    </AccountContext.Provider>
  ));

export default AccountProvider;
