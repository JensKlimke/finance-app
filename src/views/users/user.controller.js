import React from "react";
import Restify from "../../data/Restify";
import AuthControllerWrapper from "../../data/AuthControllerWrapper";
import BaseController, {ControllerMessages} from "../../data/BaseController";
import {UserElements} from "./users.list";

// define rest host
const REST_HOST = process.env.REACT_APP_REST_HOST || 'http://localhost';

// instance definition
export const UserContext = React.createContext({});
export const UserRest = new Restify(REST_HOST + `/v1/users`);

export const UserController = (token) => {

  // create controller
  const controller = new BaseController();

  // access methods
  controller.create = (object) => UserRest.post(object, {path: '/', token});
  controller.getList = (params) => UserRest.get({params: params, token});
  controller.save = (id, object) => UserRest.patch(object, {path: '/' + id, token});
  controller.delete = (id) => UserRest.delete({path: '/' + id, token});

  // object methods
  controller.beforeEdit = ({id, name, email, role}) => ({id, name, email, role})
  controller.instantiate = () => ({name: '', email: '', role: 'user'});
  controller.beforeUpdate = ({name, email, role}) => ({name, email, role})
  controller.beforeCreate = ({name, email, role}) => ({name, email, role});

  controller.messages = ControllerMessages('user', 'users');
  controller.elements = UserElements();

  return controller;

}

export const UserProvider = (props) => (
  <UserContext.Provider value={props.controller}>
    {props.children}
  </UserContext.Provider>
);

export const Users = AuthControllerWrapper(UserProvider, UserController);
