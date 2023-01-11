import {DataComponentConfigType} from "../../hooks/entry";
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
      sort: (a : TransferType, b : TransferType) => (a.amount - b.amount),
      className: 'align-middle text-center'
    },
    {
      label: 'Description',
      content: (row : any) => <span>{row.description}</span>,
      sort: (a : TransferType, b : TransferType) => a.description.localeCompare(b.description),
      className: 'align-middle'
    },
    {
      label: 'Transfer Amount',
      content: (row : any) => <CurrencyCell colored amount={row.amount} />,
      sort: (a : TransferType, b : TransferType) => (a.amount - b.amount),
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
