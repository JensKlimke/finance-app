import Restify from "../../data/Restify";
import BaseController from "../../data/BaseController";

// function to create contract controller
export const Controller = (type) => {

  // create controller
  const controller = new BaseController();

  // create rest and factories
  const rest = new Restify(process.env.REACT_APP_REST_HOST + `/v1/auth`);

  // methods
  controller.requestWithToken = (token, object) => rest.post(object, {params: {token}, path: `/${type}`});
  controller.request = (object) => rest.post(object, {path: `/${type}`});

  return controller;

}

export const InitializePasswordController = Controller('init-password');
export const ResetPasswordController = Controller('reset-password');
export const ForgotPasswordController = Controller('forgot-password');
