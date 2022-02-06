import BaseController, {ControllerMessages} from "../../data/BaseController";
import Restify from "../../data/Restify";


export const ConfigurationRest = new Restify(process.env.REACT_APP_REST_HOST + `/v1/configuration`);

export class ConfigurationController extends BaseController {

  constructor() {
    super();
    // create methods
    this.instantiate = () =>
      ({dynamics: 0.0, roi: 0.0, tax: 0.0, taxAllowance: 0.0, inflation: 0.0, startYear: 2018, pensionYear: 2051, savingsRate: 0.0});
    this.beforeEdit = ({dynamics, roi, tax, taxAllowance, inflation, pensionYear, startYear, savingsRate}) =>
      ({dynamics: dynamics * 100.0, roi: roi * 100.0, tax: tax * 100.0, taxAllowance, inflation: inflation * 100.0, pensionYear, startYear, savingsRate});
    this.beforeUpdate = ({dynamics, roi, tax, taxAllowance, inflation, pensionYear, startYear, savingsRate}) =>
      ({dynamics: dynamics * 0.01, roi: roi * 0.01, tax: tax * 0.01, taxAllowance, inflation: inflation * 0.01, pensionYear, startYear, savingsRate});
    // create messages
    this.messages = ControllerMessages('configuration', 'configuration');
  }

  setToken(token) {
    // save methods
    this.get = () => ConfigurationRest.get({path: '/', token: token});
    this.save = (object) => ConfigurationRest.patch(object, {path: '/', token: token});
    this.delete = () => ConfigurationRest.delete({path: '/', token: token});
    // return this
    return this;
  }

}
