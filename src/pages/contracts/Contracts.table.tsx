import moment from "moment";
import {ContractType} from "./Contracts.context";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {BsPeople, BsPeopleFill} from "react-icons/bs";
import MonthCircle from "../../components/display/MonthCircle";
import CurrencyCell from "../../components/display/CurrencyCell";
import {DataComponentConfigType} from "../../hooks/entry";
import React from "react";


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
      sort: (a : ContractType, b : ContractType) => a.name.localeCompare(b.name),
      className: 'align-middle',
      width: 40,
    },
    {
      label: 'Contract Amount',
      content: (row : ContractType) => <CurrencyCell amount={row.amount} />,
      sort: (a : ContractType, b : ContractType) => (a.amount - b.amount),
      className: 'align-middle text-end',
      width: 20,
    },
    {
      label: 'Annual Amount',
      content: (row : ContractType) => <CurrencyCell amount={row.annualAmount || 0.0} />,
      sort: (a : ContractType, b : ContractType) => ((a.annualAmount || 0.0) - (b.annualAmount || 0.0)),
      className: 'align-middle text-end',
      width: 20,
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
      sort: (a : ContractType, b : ContractType) => {
        // check
        if (!b.next) return 1;
        if (!a.next) return -1;
        // calculate date
        const dateA = new Date(a.next.year, a.next.month, 1, 0, 0, 0, 0);
        const dateB = new Date(b.next.year, b.next.month, 1, 0, 0, 0, 0);
        // calculate days
        return dateA.getTime() - dateB.getTime();
      },
      className: 'align-middle text-center',
      width: 10,
    },
  ]
};


export const ContractRows : DataComponentConfigType = {
  title: (row : ContractType) => <>{(row.shared ? <><BsPeople />&nbsp;&nbsp;</> : '')}{row.name}</>,
  cols: [
    {
      label: 'Creditor',
      content: (row : ContractType) => row.creditor,
      className: 'text-end'
    },
    {
      label: 'Contract Amount',
      content: (row : ContractType) => <CurrencyCell amount={row.amount} />,
      className: 'text-end'
    },
    {
      label: 'Annual Amount',
      content: (row : ContractType) => <CurrencyCell amount={row.annualAmount || 0.0} />,
      className: 'text-end'
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
      className: 'text-end'
    },
  ]
};
