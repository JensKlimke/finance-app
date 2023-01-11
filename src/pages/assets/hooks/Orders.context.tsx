import React, {createContext, useContext, useMemo} from "react";
import {
  defaultContext,
  EntryContextType,
  GenericEntryProvider,
  StringKeyStringValueObjectsType
} from "../../../hooks/entry";
import moment from "moment";

export type OrderType = {
  id?: string
  account?: string
  amount: number
  date: string
  description: string
  type: string
}

export const defaultOrder = () => ({
  amount: 0.0,
  date: moment().format('YYYY-MM-DD') + 'T00:00:00.000Z',
  description: '',
  type: ''
});

export const cleanOrderCopy = (order: OrderType) => ({
  amount: order.amount,
  date: order.date,
  description: order.description,
  type: order.type
});

export const TypeMapping : StringKeyStringValueObjectsType = {
  'savings_plan': 'Savings plan',
  'dividend': 'Dividend',
  'sale': 'Sale',
  'purchase': 'Purchase'
}


export const OrdersContext = createContext<EntryContextType<OrderType>>(defaultContext);
export const useOrders = () => useContext(OrdersContext);

function OrderProvider ({children} : {children : React.ReactNode}) {
  // create wrapper
  const Wrapper = useMemo(() => {
    return GenericEntryProvider<OrderType>('orders',
      cleanOrderCopy,
      defaultOrder,
      (context : EntryContextType<OrderType>, children : React.ReactNode) => (
        <OrdersContext.Provider value={context}>
          {children}
        </OrdersContext.Provider>
      ), 'account')
  }, []);
  // render
  return <Wrapper>{children}</Wrapper>;
}

export default OrderProvider;
