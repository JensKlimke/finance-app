import moment from "moment";
import {ContractType} from "./Contracts.context";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {BsPeople, BsPeopleFill} from "react-icons/bs";
import MonthCircle from "../../components/display/MonthCircle";
import CurrencyCell from "../../components/display/CurrencyCell";
import {DataComponentConfigType, DataSortConfig} from "../../hooks/entry";
import React from "react";

const dateSort = (a : ContractType, b : ContractType) => {
  // check
  if (!b.next) return 1;
  if (!a.next) return -1;
  // calculate date
  const dateA = new Date(a.next.year, a.next.month, 1, 0, 0, 0, 0);
  const dateB = new Date(b.next.year, b.next.month, 1, 0, 0, 0, 0);
  // calculate days
  return dateA.getTime() - dateB.getTime();
}

export const ContractCols : DataComponentConfigType = {
  cols: [
    {
      label: 'Description',
      content: (row : ContractType) => (
        <>
          <span>{(row.shared ? <><BsPeopleFill />&nbsp;</> : '')}{row.name}</span><br />
          <i className='text-muted'>{row.creditor}</i>
        </>
      ),
      className: 'align-middle',
      width: 50,
      sort: 0
    },
    {
      label: 'Contract Amount',
      content: (row : ContractType) => <CurrencyCell amount={row.amount} />,
      className: 'align-middle text-end',
      width: 20,
      sort: 2
    },
    {
      label: 'Annual Amount',
      content: (row : ContractType) => <CurrencyCell amount={row.annualAmount || 0.0} />,
      className: 'align-middle text-end',
      width: 20,
      sort: 3
    },
    {
      label: 'Next',
      content: (row : ContractType) => {
        // check
        if (!row.next)
          return 'n/a';
        // calculate date
        const date = new Date(row.next.year, row.next.month, 1, 0, 0, 0, 0);
        // tooltip
        const tooltip = (props : any) => (
          <Tooltip {...props}>
            {`${moment(date).fromNow()} (${moment(date).format('MMMM YYYY')})`}
          </Tooltip>
        );
        // render
        return (
          <OverlayTrigger placement='left' delay={{ show: 250, hide: 400 }} overlay={tooltip}>
          <span>
            <MonthCircle months={row.months} next={row.next.month}/>
          </span>
          </OverlayTrigger>
        );
      },
      className: 'align-middle text-center',
      width: 10,
      sort: 4
    },
  ]
};


export const ContractRows : DataComponentConfigType = {
  title: (row : ContractType) => <>{(row.shared ? <><BsPeople />&nbsp;&nbsp;</> : '')}{row.name}</>,
  cols: [
    {
      label: 'Creditor',
      content: (row : ContractType) => row.creditor,
      className: 'text-end',
    },
    {
      label: 'Contract Amount',
      content: (row : ContractType) => <CurrencyCell amount={row.amount} />,
      className: 'text-end',
    },
    {
      label: 'Annual Amount',
      content: (row : ContractType) => <CurrencyCell amount={row.annualAmount || 0.0} />,
      className: 'text-end',
    },
    {
      label: 'Next due month',
      content: (row : ContractType) => {
        if (!row.next)
          return 'n/a';
        // calculate date
        const date = new Date(row.next.year, row.next.month, 1, 0, 0, 0, 0);
        return `${moment(date).format('MMMM YYYY')}`;
      },
      className: 'text-end',
    },
  ]
};

export const ContractSort : DataSortConfig = [
  {
    label: 'Name',
    callback: (a : ContractType, b : ContractType) => a.name.localeCompare(b.name),
  },
  {
    label: 'Creditor',
    callback: (a : ContractType, b : ContractType) => a.creditor.localeCompare(b.creditor),
  },
  {
    label: 'Amount',
    callback: (a : ContractType, b : ContractType) => (a.amount - b.amount),
  },
  {
    label: 'Annual Amount',
    callback: (a : ContractType, b : ContractType) => ((a.annualAmount || 0.0) - (b.annualAmount || 0.0)),
  },
  {
    label: 'Due Date',
    callback: dateSort,
  },
]
