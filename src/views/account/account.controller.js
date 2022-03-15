import BaseController, {ControllerMessages, ControllerMethods} from "../../data/BaseController";
import Restify from "../../data/Restify";
import React from "react";
import AuthControllerWrapper from "../../data/AuthControllerWrapper";
import {Form} from "semantic-ui-react";
import {BalanceController} from "./balance.controller";
import {OrderController} from "./order.controller";

// define rest host
const REST_HOST = process.env.REACT_APP_REST_HOST || 'http://localhost';

export const AccountContext = React.createContext({});
export const AccountRest = new Restify(REST_HOST + `/v1/accounts`);
export const AccountInstance = {name: ''};

export const AccountController = (token) => {
  // create controller
  const controller = new BaseController();
  // create methods
  Object.assign(controller, ControllerMethods(AccountRest, AccountInstance, undefined, token));
  // create messages
  controller.messages = ControllerMessages('account', 'accounts');
  // create elements
  controller.elements = {fields: AccountForm}
  // return controller
  return controller;
}

export function AccountForm({object: account, onChange}) {

  // render
  return (
    <Form.Field>
      <label>Name</label>
      <Form.Input autoFocus placeholder='My account' value={account.name} onChange={(e, {value}) => onChange('name', value)}/>
    </Form.Field>
  );

}

export const AccountProvider = (props) => (
  <AccountContext.Provider value={props.controller}>
    {props.children}
  </AccountContext.Provider>
);

export const Accounts = AuthControllerWrapper(AccountProvider, (token) => ({
  account: AccountController(token),
  balance: BalanceController(token),
  order: OrderController(token),
}));

