import React, {createContext, useContext} from "react";
import {defaultContext, EntryContextType, GenericEntryProvider} from "../../hooks/entry";
import {useApiData} from "../../hooks/api";

export type ContractType = {
  id?: string
  name: string
  creditor: string
  amount: number
  shared: boolean
  months: boolean[]
  annualAmount?: number
  next?: {
    year: number
    month: number
  }
}

export const defaultContract = () => ({
  name: '',
  creditor: '',
  amount: 0.0,
  shared: false,
  months: Array(12).fill(true),
});

export const cleanContractCopy = (contract: ContractType) => ({
  name: contract.name,
  creditor: contract.creditor,
  amount: contract.amount,
  shared: contract.shared,
  months: contract.months
})

export const useContractStatistics = () => useApiData('contracts/statistics');

export const ContractContext = createContext<EntryContextType<ContractType>>(defaultContext);
export const useContracts = () => useContext(ContractContext);

const ContractProvider = GenericEntryProvider<ContractType>('contracts',
  cleanContractCopy,
  defaultContract,
  (context : EntryContextType<ContractType>, children : React.ReactNode) => (
    <ContractContext.Provider value={context}>
      {children}
    </ContractContext.Provider>
  ), undefined, {'limit': '100'});

export default ContractProvider;
