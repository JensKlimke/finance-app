import React from "react";
import BaseController, {ControllerMessages, ControllerMethods} from "../../data/BaseController";
import moment from "moment";
import Restify from "../../data/Restify";
import {Form, Grid} from "semantic-ui-react";
import AmountInput from "../../data/AmountInput";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';


export const BalanceRest = new Restify(process.env.REACT_APP_REST_HOST + `/v1/balances`);
export const BalanceInstance = {amount: 0.0, date: moment(new Date()).format('YYYY-MM-DD'), description: ''};

export const BalanceController = (token) => {
  // create controller
  const controller = new BaseController();
  // create methods
  controller.setAccount = (accountId) => {
    Object.assign(controller, ControllerMethods(BalanceRest, BalanceInstance, {account: accountId}, token));
  }
  controller.setAccount(null);
  controller.getAt = (date) => BalanceRest.get({path: '/at/' + date, token});
  // create messages
  controller.messages = ControllerMessages('balance entry', 'balance entries');
  // create elements
  controller.elements = {fields: BalanceForm}
  // return controller
  return controller;
}

export function BalanceForm ({object: balance, onChange}) {

  // render
  return (
    <Grid>
      <Grid.Column mobile={16} tablet={6} computer={8}>
        <Form.Field>
          <label>Amount €</label>
          <AmountInput autoFocus value={balance.amount} onChange={value => onChange('amount', value)} />
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <Form.Input placeholder='Balance Statement' value={balance.description} onChange={(e, {value}) => onChange('description', value)}/>
        </Form.Field>
      </Grid.Column>
      <Grid.Column mobile={16} tablet={10} computer={8}>
        <Form.Field>
          <label>Date</label>
          <Calendar onChange={d => onChange('date', moment(d).format('YYYY-MM-DD'))} value={new Date(balance.date)} />
        </Form.Field>
      </Grid.Column>
    </Grid>
  );

}
