import React, {createContext, useContext} from "react";
import {defaultContext, EntryContextType, GenericEntryProvider} from "../../hooks/entry";

export type TransferType = {
  id?: string
  amount: number
  description: string
}

export const defaultTransfer = () => ({
  amount: 0.0,
  description: '',
});

export const cleanTransferCopy = (transfer: TransferType) => ({
  amount: transfer.amount,
  description: transfer.description,
})


export const TransferContext = createContext<EntryContextType<TransferType>>(defaultContext);

export const useTransfers = () => useContext(TransferContext);

const TransferProvider = GenericEntryProvider<TransferType>('transfers',
  cleanTransferCopy,
  defaultTransfer,
  (context : EntryContextType<TransferType>, children : React.ReactNode) => (
    <TransferContext.Provider value={context}>
      {children}
    </TransferContext.Provider>
  ));

export default TransferProvider;
