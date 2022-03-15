import BaseController, {ControllerMessages, ControllerMethods} from "../../data/BaseController";
import AuthControllerWrapper from "../../data/AuthControllerWrapper";
import {TransferElements} from "./transfer.list";
import Restify from "../../data/Restify";
import React from "react";

export const TransferContext = React.createContext({});
export const TransferRest = new Restify(process.env.REST_HOST + `/v1/transfers`);
export const TransferInstance = {amount: '0.0', description: ''};

export const TransferController = (token) => {
  // create controller
  const controller = new BaseController();
  // create methods
  Object.assign(controller, ControllerMethods(TransferRest, TransferInstance, undefined, token));
  // create messages
  controller.messages = ControllerMessages('transfer', 'transfers');
  // create elements
  controller.elements = TransferElements();
  // return controller
  return controller;
}

export const TransferProvider = (props) => (
  <TransferContext.Provider value={props.controller}>
    {props.children}
  </TransferContext.Provider>
);

export const Transfers = AuthControllerWrapper(TransferProvider, TransferController);

// create a base instance
export const TransferMainHash = TransferController();
