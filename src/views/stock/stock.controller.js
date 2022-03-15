import React from "react";
import Restify from "../../data/Restify";
import {StockEditModal, StockForm, StockListHeader, StockListRow, StockNewModal} from "./stock.list";
import AuthControllerWrapper from "../../data/AuthControllerWrapper";
import BaseController, {ControllerMessages, ControllerMethods} from "../../data/BaseController";

// define rest host
const REST_HOST = process.env.REACT_APP_REST_HOST || 'http://localhost';

// instance definition
export const StockContext = React.createContext({});
export const StockRest = new Restify(REST_HOST + `/v1/stocks`);
export const StockInstance = {symbol: '', name: '', quantity: 0, purchase: 0, value: 0};

// define controller
export const StockController = (token) => {
  // create controller
  const controller = new BaseController();
  // set methods
  Object.assign(controller, ControllerMethods(StockRest, StockInstance, undefined, token));
  // set messages
  controller.messages = ControllerMessages('asset', 'assets');
  // set elements
  controller.elements = {
    header: StockListHeader,
    row: StockListRow,
    create: StockNewModal,
    edit: StockEditModal,
    fields: StockForm,
  }
  // return controller
  return controller;
}

export const StockProvider = (props) => (
  <StockContext.Provider value={props.controller}>
    {props.children}
  </StockContext.Provider>
);

export const Stocks = AuthControllerWrapper(StockProvider, StockController);

