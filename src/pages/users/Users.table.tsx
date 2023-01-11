import {UserType} from "./Users.context";
import {BsCheck, BsCheckSquare} from "react-icons/bs";
import {DataComponentConfigType} from "../../hooks/entry";
import React from "react";


export const UserCols : DataComponentConfigType = {
  cols: [
    {
      label: 'Role',
      content: (row : UserType) => <strong>{row.role === 'user' ? 'U' : 'A'}</strong>,
      sort: (a : UserType, b : UserType) => a.name.localeCompare(b.name),
      className: 'align-middle text-center',
    },
    {
      label: 'Name',
      content: (row : UserType) => <span>{row.name}</span>,
      sort: (a : UserType, b : UserType) => a.name.localeCompare(b.name),
      className: 'align-middle',
    },
    {
      label: 'Email',
      content: (row : UserType) => <a href={`mailto://${row.email}`}>{row.email}</a>,
      sort: (a : UserType, b : UserType) => a.email.localeCompare(b.email),
      className: 'align-middle',
    },
    {
      label: 'Verified',
      content: (row : UserType) => row.isEmailVerified ? <BsCheck /> : <></>,
      sort: (a : UserType) => a ? -1 : 1,
      className: 'align-middle text-center',
    },
  ]
};


export const UserRows : DataComponentConfigType = {
  title: (row : UserType) => <>{row.name}</>,
  cols: [
    {
      label: 'Email',
      content: (row : UserType) => (
        <>
          <a href={`mailto://${row.email}`}>{row.email}</a>
          &nbsp;row.isEmailVerified && <BsCheckSquare />
        </>
      ),
      className: 'text-end'
    }
  ]
};
