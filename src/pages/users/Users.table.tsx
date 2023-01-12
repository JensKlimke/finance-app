import {UserType} from "./Users.context";
import {BsCheck, BsCheckSquare} from "react-icons/bs";
import {DataComponentConfigType, DataSortConfig} from "../../hooks/entry";
import React from "react";


export const UserCols : DataComponentConfigType = {
  cols: [
    {
      label: 'Role',
      content: (row : UserType) => <strong>{row.role === 'user' ? 'U' : 'A'}</strong>,
      sort: 0,
      className: 'align-middle text-center',
    },
    {
      label: 'Name',
      content: (row : UserType) => <span>{row.name}</span>,
      sort: 1,
      className: 'align-middle',
    },
    {
      label: 'Email',
      content: (row : UserType) => <a href={`mailto://${row.email}`}>{row.email}</a>,
      sort: 2,
      className: 'align-middle',
    },
    {
      label: 'Verified',
      content: (row : UserType) => row.isEmailVerified ? <BsCheck /> : <></>,
      sort: 3,
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


export const UsersSort : DataSortConfig = {
  fields:[
    {
      label: 'Role',
      callback: (a : UserType, b : UserType) => a.role.localeCompare(b.role),
    },
    {
      label: 'Name',
      callback: (a : UserType, b : UserType) => a.name.localeCompare(b.name),
    },
    {
      label: 'Email',
      callback: (a : UserType, b : UserType) => a.email.localeCompare(b.email),
    },
    {
      label: 'Verified',
      callback: (a : UserType) => a ? -1 : 1,
    },
  ],
  filterText: (row : UserType) => `${row.name} ${row.role} ${row.email}`
}
