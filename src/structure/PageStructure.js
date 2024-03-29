import UsersView from "../views/users/users.view";
import ContractView from "../views/contract/contract.view";
import TransferView from "../views/transfer/transfer.view";
import AccountView from "../views/account/account.view";
import StockView from "../views/stock/stock.view";

export const showPage = (page, user) => {
  // check if page is hidden
  if(page.hide !== undefined && page.hide === true)
    return false;
  // check if user has role
  if(page.roles && (user === null || page.roles.find((r) => r === user.role) !== user.role))
    return false;
  // otherwise
  return true;
}

export const PageStructure = {

  // overview: {
  //   name: 'Overview',
  //   href: '/',
  //   element: <Overview/>,
  // },
  contracts: {
    name: 'Contracts',
    href: '/contracts',
    element: <ContractView/>,
  },
  transfer: {
    name: 'Money Transfer',
    href: '/transfer',
    element: <TransferView/>,
  },
  stocks: {
    name: 'Stocks',
    href: '/stocks',
    element: <StockView/>,
  },
  assets: {
    name: 'Assets',
    href: '/assets',
    element: <AccountView/>,
  },
  users: {
    name: 'User Management',
    href: '/users',
    element: <UsersView/>,
    roles: ['admin'],
  }

}

export default PageStructure;
