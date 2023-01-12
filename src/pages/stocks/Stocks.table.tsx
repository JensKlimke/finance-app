import {DataComponentConfigType, DataSortConfig} from "../../hooks/entry";
import CurrencyCell from "../../components/display/CurrencyCell";
import {StockType} from "./Stocks.context";

export const StockCols : DataComponentConfigType = {
  cols: [
    {
      label: 'Symbol',
      content: (row : StockType) => <code>{row.symbol}</code>,
      sort: 0,
      className: 'align-middle text-center',
    },
    {
      label: 'Name',
      sort: 1,
      content: (row : StockType) => <span>{row.name}</span>,
    },
    {
      label: 'Quantity',
      content: (row : StockType) => <code>{row.quantity.toFixed(2)}</code>,
      sort: 2,
      className: 'align-middle text-end'
    },
    {
      label: 'Purchase value',
      content: (row : StockType) => <CurrencyCell colored amount={row.purchase} />,
      sort: 3,
      className: 'align-middle text-end'
    },
    {
      label: 'Current value',
      content: (row : StockType) => <CurrencyCell colored amount={row.value} />,
      sort: 4,
      className: 'align-middle text-end'
    },
  ]
}

export const StockRows : DataComponentConfigType = {
  title: (row : any) => <span>{row.name}</span>,
  cols: [
    {
      label: 'Symbol',
      content: (row : StockType) => <code>{row.symbol}</code>,
      className: 'text-end'
    },
    {
      label: 'Quantity',
      content: (row : StockType) => <code>{row.quantity}</code>,
      className: 'text-end'
    },
    {
      label: 'Purchase value',
      content: (row : StockType) => <CurrencyCell amount={row.purchase} colored={true} />,
      className: 'text-end'
    },
    {
      label: 'Current value',
      content: (row : StockType) => <CurrencyCell amount={row.value} colored={true} />,
      className: 'text-end'
    },
  ]
}

export const StockSort : DataSortConfig = [
  {
    label: 'Symbol',
    callback: (a : StockType, b : StockType) => (a.symbol.localeCompare(b.symbol)),
  },
  {
    label: 'Name',
    callback: (a : StockType, b : StockType) => (a.name.localeCompare(b.name)),
  },
  {
    label: 'Quantity',
    callback: (a : StockType, b : StockType) => (a.quantity - b.quantity),
  },
  {
    label: 'Purchase value',
    callback: (a : StockType, b : StockType) => (a.purchase - b.purchase),
  },
  {
    label: 'Current value',
    callback: (a : StockType, b : StockType) => (a.value - b.value),
  },
]
