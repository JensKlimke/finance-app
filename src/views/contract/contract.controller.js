import React from "react";
import Restify from "../../data/Restify";
import {ContractEditModal, ContractNewModal, ContractsForm, ContractsListHeader, ContractsListRow} from "./contract.list";
import AuthControllerWrapper from "../../data/AuthControllerWrapper";
import BaseController, {ControllerMessages, ControllerMethods} from "../../data/BaseController";

// define rest host
const REST_HOST = process.env.REACT_APP_REST_HOST || 'http://localhost';

// instance definition
export const ContractContext = React.createContext({});
export const ContractRest = new Restify(REST_HOST + `/v1/contracts`);
export const ContractInstance = {shared: false, name: '', creditor: '', amount: '0.0', months: Array(12).fill(true)};

// define controller
export const ContractController = (token) => {
  // create controller
  const controller = new BaseController();
  // set methods
  Object.assign(controller, ControllerMethods(ContractRest, ContractInstance, undefined, token));
  controller.getStatistics = () => ContractRest.get({path: '/statistics', token});
  // set messages
  controller.messages = ControllerMessages('contract', 'contracts');
  // set elements
  controller.elements = {
    header: ContractsListHeader,
    row: ContractsListRow,
    create: ContractNewModal,
    edit: ContractEditModal,
    fields: ContractsForm,
  }
  // return controller
  return controller;
}

export const ContractProvider = (props) => (
  <ContractContext.Provider value={props.controller}>
    {props.children}
  </ContractContext.Provider>
);

export const Contracts = AuthControllerWrapper(ContractProvider, ContractController);
