import {OrderType, useOrders} from "./Orders.context";
import {BalanceType, useBalances} from "./Balances.context";
import {useCallback, useEffect, useState} from "react";
import {useAccounts} from "./Accounts.context";

export type PeriodType = {
  date: {
    start : Date | undefined,
    end : Date | undefined
  },
  orders: OrderType[],
  sum : number,
  invest : number,
  sell: number,
  buy: number,
  amount: number,
  balance: number,
  roi: number,
  previous : PeriodType | undefined,
  entry : BalanceType | undefined,
}

const millisPerDay = 1000 * 60 * 60 * 24;

const calcPeriods = (balances : BalanceType[], orders : OrderType[]) => {
  // predefine previous element
  let previous : (PeriodType | undefined) = undefined;
  let firstOrder : Date;
  // calculate periods
  return [...balances, undefined].map(balanceEntry => {
    // calculate start and end date
    let start = previous && previous.date.end;
    let end = balanceEntry && new Date(balanceEntry.date);
    // find orders in period
    let ordersInPeriod = orders
      .filter(o => {
        let date = new Date(o.date);
        return ((!end || date < end) && (!start || date >= start));
      })
      .reverse();
    // calculate sum of orders in period
    let sum = ordersInPeriod
      .map(o => -o.amount)
      .reduce((p, s) => p + s, 0.0);
    // calculate cumulated sum of periods until and including this period
    let invest = (previous?.invest || 0.0) + sum;
    // calculate sell and buy order sums
    const sell = ordersInPeriod.map(o => o.amount > 0 ? -o.amount : 0.0).reduce((p, s) => p + s, 0.0);
    const buy  = ordersInPeriod.map(o => o.amount < 0 ? -o.amount : 0.0).reduce((p, s) => p + s, 0.0);
    // amount and return of invest
    const amount = balanceEntry ? balanceEntry.amount : 0.0;
    const balance = balanceEntry ? (balanceEntry.amount / invest - 1.0) : 0.0;
    // calculate return annual of invest
    let roi = 0.0;
    // save first order
    if (start === undefined)
      firstOrder = new Date(ordersInPeriod.at(-1)?.date || '');
    // calculate floating average annual roi
    if (end !== undefined) {
      const years = Math.floor((end.getTime() - firstOrder.getTime()) / millisPerDay) / 365;
      roi = (amount - invest) / (invest * years);
    }
    // iterate over orders
    let period : PeriodType = {
      date: {
        start,
        end
      },
      orders: ordersInPeriod.reverse(),
      sum,
      invest,
      sell,
      buy,
      amount,
      balance,
      roi,
      previous,
      entry: balanceEntry && { ...balanceEntry },
    }
    // save last date and return
    previous = {...period};
    return period;
  }).reverse()
}

export function usePeriodData() {
  // states
  const [account, setAccountLocal] = useState<string>();
  const [periods, setPeriods] = useState<PeriodType[]>();
  // const {data : balance} = useApiData<BalanceType[]>(`balances/at/${moment().format('YYYY-MM-DD')}`, {account});
  // hooks
  const {data : accounts} = useAccounts();
  const {
    data : balances,
    setReference : setBalanceRef,
    setFilter : filterBalances,
    loading : balancesLoading,
  } = useBalances();
  const {
    data : orders,
    setReference : setOrdersRef,
    setFilter : filterOrders,
    loading : ordersLoading,
  } = useOrders();
  // callbacks
  const setAccount = useCallback((account : string | undefined) => {
    // set references
    setBalanceRef(account);
    setOrdersRef(account);
    // set account
    setAccountLocal(account);
  }, [setBalanceRef, setOrdersRef]);
  // effects
  useEffect(() => {
    if (!accounts || accounts.totalResults === 0)
      setAccount(undefined); // unset account, when no accounts
    else if (account && accounts.results.find(a => a.id === account) === undefined)
      setAccount(undefined); // unset account, when not existing
    else if (accounts && accounts.totalResults > 0 && !account)
      setAccount(accounts.results[0].id);
  }, [account, accounts, setAccount]);
  useEffect(() => {
    // set filter
    filterBalances({limit: '1000000', sortBy: 'date'});
    filterOrders({limit: '1000000', sortBy: 'date'});
  }, [filterBalances, filterOrders]);
  useEffect(() => {
    // check data and return periods
    if (!orders || !balances || ordersLoading || balancesLoading)
      return undefined;
    else if (balances.results.length === 0)
      return setPeriods([]);
    else if(orders.results.length > 0)
      setPeriods(calcPeriods(balances.results, orders.results));
  }, [balances, balancesLoading, orders, ordersLoading]);
  // return
  return {
    account,
    setAccount,
    periods,
    data: {
      accounts: accounts?.results,
      orders: orders?.results,
      balances: balances?.results
    }
  };
}
