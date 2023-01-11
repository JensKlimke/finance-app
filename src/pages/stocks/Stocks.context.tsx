import React, {createContext, useContext} from "react";
import {defaultContext, EntryContextType, GenericEntryProvider} from "../../hooks/entry";

export type StockType = {
  id?: string
  symbol: string
  name: string
  purchase: number
  quantity: number
  value: number
}

export const defaultStock = () => ({
  symbol: '',
  name: '',
  purchase: 0.0,
  quantity: 0.0,
  value: 0.0
});

export const cleanStockCopy = (stock: StockType) => ({
  symbol: stock.symbol,
  name: stock.name,
  purchase: stock.purchase,
  quantity: stock.quantity,
  value: stock.value
})


export const StockContext = createContext<EntryContextType<StockType>>(defaultContext);

export const useStocks = () => useContext(StockContext);

const StockProvider = GenericEntryProvider<StockType>('stocks',
  cleanStockCopy,
  defaultStock,
  (context : EntryContextType<StockType>, children : React.ReactNode) => (
    <StockContext.Provider value={context}>
      {children}
    </StockContext.Provider>
  ));

export default StockProvider;
