import React from "react";
import BaseController, {ControllerMessages, ControllerMethods, copyFromBaseObject} from "../../data/BaseController";
import moment from "moment";
import Restify from "../../data/Restify";
import {Form, Grid} from "semantic-ui-react";
import AmountInput from "../../data/AmountInput";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';


export const OrderRest = new Restify(process.env.REACT_APP_REST_HOST + `/v1/orders`);
export const OrderInstance = {amount: 0.0, date: moment(new Date()).format('YYYY-MM-DD'), type: 'purchase', description: ''};

const update = (o) => {
  o = copyFromBaseObject(OrderInstance, o);
  if (o.type === 'purchase' || o.type === 'savings_plan')
    o.amount = -1.0 * Math.abs(o.amount);
  else if (o.type !== 'other')
    o.amount = Math.abs(o.amount);
  return o;
};

const edit = (o) => {
  o = copyFromBaseObject(OrderInstance, o);
  o.amount = (o.type !== 'other') ? Math.abs(o.amount) : o.amount;
  return o;
};

export const OrderController = (token) => {
  // create controller
  const controller = new BaseController();
  // create methods
  controller.setAccount = (accountId) => {
    // assign methods
    Object.assign(controller, ControllerMethods(OrderRest, OrderInstance, {account: accountId}, token));
    // update methods to avoid using sign in forms
    controller.beforeEdit = edit;
    controller.beforeUpdate = update;
    controller.beforeCreate = update;
  }
  // unset amount
  controller.setAccount(null);
  // create messages
  controller.messages = ControllerMessages('order entry', 'order entries');
  // create elements
  controller.elements = {fields: OrderForm}
  // return controller
  return controller;
}

export function OrderForm({object: order, onChange}) {

  // create options
  const options = [
    { key: 'dividend', value: 'dividend', text: 'Dividend' },
    { key: 'savings_plan', value: 'savings_plan', text: 'Savings plan' },
    { key: 'purchase', value: 'purchase', text: 'Purchase/Investment' },
    { key: 'sale', value: 'sale', text: 'Sale/Divestment' },
    { key: 'other', value: 'other', text: 'Other (with sign)' },
  ];

  // render
  return (
    <Grid>
      <Grid.Column mobile={16} tablet={6} computer={8}>
        <Form.Field>
          <label>Type</label>
          <Form.Select placeholder='Order type' options={options} value={order.type} onChange={(e, {value}) => onChange('type', value)}/>
        </Form.Field>
        <Form.Field>
          <label>Amount €</label>
          <AmountInput autoFocus value={order.amount} onChange={value => onChange('amount', value)} />
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <Form.Input placeholder='A deposit, I made or something.' value={order.description} onChange={(e, {value}) => onChange('description', value)}/>
        </Form.Field>
      </Grid.Column>
      <Grid.Column mobile={16} tablet={10} computer={8}>
        <Form.Field>
          <label>Date</label>
          <Calendar onChange={d => onChange('date', moment(d).format('YYYY-MM-DD'))} value={new Date(order.date)} />
        </Form.Field>
      </Grid.Column>
    </Grid>
  );

}
