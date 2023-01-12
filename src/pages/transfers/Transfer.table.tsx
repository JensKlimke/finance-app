import {DataComponentConfigType, DataSortConfig} from "../../hooks/entry";
import {BsArrowLeft, BsArrowLeftRight, BsArrowRight} from "react-icons/bs";
import CurrencyCell from "../../components/display/CurrencyCell";
import {TransferType} from "./Transfer.context";

export const TransferCols : DataComponentConfigType = {
  cols: [
    {
      label: <BsArrowLeftRight />,
      content: (row : any) => (
        row.amount > 0 ?
          <BsArrowRight className='text-success' /> :
          <BsArrowLeft className='text-danger' />
      ),
      sort: 0,
      className: 'align-middle text-center'
    },
    {
      label: 'Description',
      content: (row : any) => <span>{row.description}</span>,
      sort: 1,
      className: 'align-middle'
    },
    {
      label: 'Transfer Amount',
      content: (row : any) => <CurrencyCell colored amount={row.amount} />,
      sort: 2,
      className: 'align-middle text-end'
    },
  ]
}

export const TransferRows : DataComponentConfigType = {
  title: (row : any) => (
    <>
      {((row.amount > 0 ?
        <BsArrowRight className='text-success' /> :
        <BsArrowLeft className='text-danger' />
      ))}
      {row.description}
    </>
  ),
  cols: [
    {
      label: 'Transfer Amount',
      content: (row : any) => <CurrencyCell amount={row.amount} />,
      className: 'text-end'
    },
  ]
}

export const TransfersSort : DataSortConfig = [
  {
    label: 'Amount',
    callback: (a : TransferType, b : TransferType) => (a.amount - b.amount),
  },
  {
    label: 'Description',
    callback: (a : TransferType, b : TransferType) => a.description.localeCompare(b.description),
  },
  {
    label: 'Transfer Amount',
    callback: (a : TransferType, b : TransferType) => (a.amount - b.amount),
  },
];
