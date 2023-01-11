import React, {createContext, useContext, useMemo} from "react";
import {defaultContext, EntryContextType, GenericEntryProvider} from "../../../hooks/entry";
import moment from "moment";

export type BalanceType = {
  id?: string
  account?: string
  amount: number
  date: string
  description: string
}

export const defaultBalance = () => ({
  amount: 0.0,
  date: moment().format('YYYY-MM-DD') + 'T00:00:00.000Z',
  description: '',
});

export const cleanBalanceCopy = (balance: BalanceType) => ({
  amount: balance.amount,
  date: balance.date,
  description: balance.description
})


export const BalanceContext = createContext<EntryContextType<BalanceType>>(defaultContext);
export const useBalances = () => useContext(BalanceContext);

function BalanceProvider ({children} : {children : React.ReactNode}) {
  // create wrapper
  const Wrapper = useMemo(() => {
    return GenericEntryProvider<BalanceType>('balances',
      cleanBalanceCopy,
      defaultBalance,
      (context : EntryContextType<BalanceType>, children : React.ReactNode) => (
        <BalanceContext.Provider value={context}>
          {children}
        </BalanceContext.Provider>
      ),
      'account'
    );
  }, []);
  // render
  return <Wrapper>{children}</Wrapper>
}

export default BalanceProvider;
