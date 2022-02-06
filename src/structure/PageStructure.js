import UsersView from "../views/users/users.view";
import ContractView from "../views/contract/contract.view";

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
  // transfer: {
  //   name: 'Money transfer',
  //   href: '/transfer',
  //   element: <TransferView/>,
  // },
  // stocks: {
  //   hide: true,
  //   name: 'Stocks',
  //   href: '/stocks',
  //   element: <StockView/>,
  // },
  // assets: {
  //   name: 'Assets',
  //   href: '/assets',
  //   element: <AssetsView/>,
  // },
  // prediction: {
  //   name: 'Prediction',
  //   href: '/prediction',
  //   element: <PredictionView/>,
  // },
  // pension: {
  //   name: 'Pension',
  //   href: '/pension',
  //   element: <PensionView/>,
  // },
  users: {
    name: 'User Management',
    href: '/users',
    element: <UsersView/>,
    roles: ['admin'],
  }

}

export default PageStructure;
