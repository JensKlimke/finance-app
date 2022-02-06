import {Container, Grid, Header, Placeholder, Segment, Table, TableBody} from "semantic-ui-react";
import ConfigForm from "./config.form";
import {useCallback, useEffect, useState} from "react";
import moment from "moment";
import WealthPlot from "./wealth.plot";
import {AuthContext} from "../../auth/Auth";
import {ConfigurationController} from "./config.controller";
import {AccountContext, Accounts} from "../account/account.controller";
import {percent} from "../../lib/percent";
import {currency} from "../../lib/currency";

const currentYear = Number.parseInt(moment().format('YYYY'));
const controller = new ConfigurationController();

export default function PredictionView () {
  return (
    <Accounts>
      <AuthContext.Consumer>
        { ({user, token}) => user && (
          <AccountContext.Consumer>
            { (controllers) => controllers && (
              <Prediction
                configController={controller.setToken(token)}
                balanceController={controllers.balance}
              />
            )}
          </AccountContext.Consumer>
        )}
      </AuthContext.Consumer>
    </Accounts>
  );
}

function Prediction({configController, balanceController}) {

  const [current, setCurrent] = useState(0.0);
  const [config, setConfig] = useState(null);
  const [prediction, setPrediction] = useState([]);
  const [history, setHistory] = useState([]);

  // refresh data
  const refresh = useCallback(() => {
    configController
      .get()
      .then(c => setConfig(c))
      .catch(e => console.error(e));
  }, [configController]);

  // register refresh function
  useEffect(() => {
    refresh();
    configController.registerRefreshCallback('predList', () => refresh());
    return () => configController.unregisterRefreshCallback('predList');
  }, [configController, refresh])


  // update history
  useEffect(() => {

    if(!config)
      return;

    // history
    const promises = [];
    for(let year = config.startYear + 1; year <= currentYear; year++) {
      promises.push(balanceController.getAt(`${year}-01-01`));
    }

    // execute promises
    Promise.all(promises)
      .then(rs => rs.map((r, i) => ({
        sum: r.reduce((c, e) => c + (e ? e.amount : 0.0), 0.0),
        year: config.startYear + i
      })))
      .then(sums => {
        setHistory(sums);
        setCurrent(sums[sums.length - 1]?.sum || 0.0);
      })
      .catch(e => console.error(e));

  }, [balanceController, config])


  useEffect(() => {

    if(!config)
      return;

    const years = [];

    let i = 0;
    let prevSum = current;
    let inflationFactor = 1.0;
    let savingsSum = 0.0;
    let savingsSumPlot = current;
    let roiSum = 0.0;

    for(let year = currentYear; year <= config.pensionYear; year++) {

      // calculate inflation factor for this year
      inflationFactor *= (1.0 - config.inflation);

      // calculate entries
      const savings = config.savingsRate * (1 + i * config.dynamics);
      const roi = config.roi * prevSum;
      const tax = Math.max(roi * config.tax - config.taxAllowance, 0.0);
      const sum = prevSum + savings + roi - tax;
      const inflation = sum * inflationFactor;

      // cumulative sums
      savingsSum += savings;
      savingsSumPlot += savings;
      roiSum += roi;

      // add to list
      years.push({year, savings, savingsSum, savingsSumPlot, roi, roiSum, tax, inflation, sum});

      // save sum and increment counter
      prevSum = sum;
      ++i;

    }

    setPrediction(years);

  }, [config, current])

  if(!config) {
    return (
      <Container>
        <Segment loading>
          <Placeholder>
            <Placeholder.Line/>
            <Placeholder.Line/>
            <Placeholder.Line/>
            <Placeholder.Line/>
          </Placeholder>
        </Segment>
      </Container>
    );
  }

  return (
    <>
      <Container compact='very' fluid style={{padding: '1em'}}>
        <Grid reversed='computer'>
          <Grid.Column mobile={16} tablet={16} computer={5}>
            <Segment>
              <Header size='medium' dividing>Wealth development</Header>
              <WealthPlot data={{prediction, history}} />
            </Segment>
            <Segment>
              <Header size='medium' dividing>Setup</Header>
              <ConfigForm controller={configController} />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={16} computer={11} >
            <Segment>
              <Header size='medium' dividing>Prediction</Header>
              <Table definition compact='very'>
                <Table.Header fullWidth>
                  <Table.Row textAlign='center'>
                    <Table.HeaderCell width={1}>Year</Table.HeaderCell>
                    <Table.HeaderCell width={3}>Savings ({percent(config.dynamics)})</Table.HeaderCell>
                    <Table.HeaderCell width={3}>Return of invest ({percent(config.roi)})</Table.HeaderCell>
                    <Table.HeaderCell width={3}>Tax ({percent(config.tax)})</Table.HeaderCell>
                    <Table.HeaderCell width={3}>Sum (at the end of the year)</Table.HeaderCell>
                    <Table.HeaderCell width={3}>Inflation-adjusted</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <TableBody>
                  {
                    history && history.map(y => (
                      <Table.Row key={y.year}>
                        <Table.Cell textAlign='right'>{y.year}</Table.Cell>
                        <Table.Cell textAlign='right'><code>-</code></Table.Cell>
                        <Table.Cell textAlign='right'><code>-</code></Table.Cell>
                        <Table.Cell textAlign='right'><code>-</code></Table.Cell>
                        <Table.Cell textAlign='right' style={{color: 'grey'}}>
                          <code>{currency.to(y.sum)}</code>
                        </Table.Cell>
                        <Table.Cell textAlign='right'><code>-</code></Table.Cell>
                      </Table.Row>
                    ))
                  }
                  {
                    prediction && prediction.map(y => (
                      <Table.Row key={y.year}>
                        <Table.Cell textAlign='right'>{y.year}</Table.Cell>
                        <Table.Cell textAlign='right'><code>{currency.to(y.savings)}</code></Table.Cell>
                        <Table.Cell textAlign='right'><code>{currency.to(y.roi)}</code></Table.Cell>
                        <Table.Cell textAlign='right'><code>{currency.to(y.tax)}</code></Table.Cell>
                        <Table.Cell textAlign='right'><code>{currency.to(y.sum)}</code></Table.Cell>
                        <Table.Cell textAlign='right'><code>{currency.to(y.inflation)}</code></Table.Cell>
                      </Table.Row>
                    ))
                  }
                </TableBody>
              </Table>
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    </>
  );

}
