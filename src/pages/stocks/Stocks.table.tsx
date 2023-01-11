import {DataComponentConfigType} from "../../hooks/entry";
import CurrencyCell from "../../components/display/CurrencyCell";
import {StockType} from "./Stocks.context";

export const StockCols : DataComponentConfigType = {
  cols: [
    {
      label: 'Symbol',
      content: (row : StockType) => <code>{row.symbol}</code>,
      sort: (a : StockType, b : StockType) => (a.symbol.localeCompare(b.symbol)),
      className: 'align-middle text-center',
    },
    {
      label: 'Name',
      sort: (a : StockType, b : StockType) => (a.name.localeCompare(b.name)),
      content: (row : StockType) => <span>{row.name}</span>,
    },
    {
      label: 'Quantity',
      content: (row : StockType) => <code>{row.quantity.toFixed(2)}</code>,
      sort: (a : StockType, b : StockType) => (a.quantity - b.quantity),
      className: 'align-middle text-end'
    },
    {
      label: 'Purchase value',
      content: (row : StockType) => <CurrencyCell colored amount={row.purchase} />,
      sort: (a : StockType, b : StockType) => (a.purchase - b.purchase),
      className: 'align-middle text-end'
    },
    {
      label: 'Current value',
      content: (row : StockType) => <CurrencyCell colored amount={row.value} />,
      sort: (a : StockType, b : StockType) => (a.value - b.value),
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
