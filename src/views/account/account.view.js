import React, {useCallback, useEffect, useState} from "react";
import moment from "moment";
import {Button, Container, Dimmer, Grid, Header, Label, Loader, Menu, Segment, Statistic, Table} from "semantic-ui-react";
import BalancePlot from "./balance.plot";
import FormModal from "../../data/FormModal";
import {AccountContext, Accounts} from "./account.controller";
import ExportButton from "../../data/ExportButton";
import ImportButton from "../../data/ImportButton";
import DeleteButton from "../../data/DeleteButton";
import {currency} from "../../lib/currency";
import {percent} from "../../lib/percent";


const OrderTypes = {
  'purchase': {name: 'Purchase', classification: () => 'positive'},
  'sale': {name: 'Sale', classification: () => 'negative'},
  'savings_plan': {name: 'Savings plan', classification: () => 'positive'},
  'dividend': {name: 'Dividend', classification: () => 'neutral'},
  'other': {name: 'Other', classification: (v) => v < 0 ? 'positive' : 'negative'},
}

let accountController = null;
let balanceController = null;
let orderController = null;


export default function AccountView () {

  return (
    <Accounts>
      <AccountContext.Consumer>
        { (controllers) => controllers
          && <Assets
                accountController={controllers.account}
                balanceController={controllers.balance}
                orderController={controllers.order}
          />}
      </AccountContext.Consumer>
    </Accounts>
  )

}


// define view
function Assets({accountController: ac, balanceController: bc, orderController: oc}) {

  if(!ac || !bc || !oc)
    throw new Error('Controllers are not defined.');

  // set global controller elements
  accountController = ac;
  balanceController = bc;
  orderController = oc;

  // states
  const [accounts, setAccounts] = useState(null);
  const [account, setAccount] = useState(null);
  const [orders, setOrders] = useState(null);
  const [balances, setBalances] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(true);

  const updateAccountList = () => {
    // query all as a simple list
    accountController
      .getList()
      .then(ac => setAccounts(ac))
      .catch(e => console.error(e))
  }

  // register callbacks on controllers
  useEffect(() => {
    // update account list
    updateAccountList();
    // register refresh
    accountController.registerRefreshCallback('asset.view', () => updateAccountList());
    return () => accountController.unregisterRefreshCallback('asset.view');
  }, [])


  // reset account
  useEffect(() => {
    // only check when accounts set
    if(accounts === null)
      return;
    // set account when is null
    if(account === null && accounts.totalResults > 0)
      return changeAccount(accounts.results[0]);
    // find the entry with same id
    const actual = accounts.results.find(a => a.id === account.id);
    // check
    if (actual && actual !== account)
      changeAccount(actual);
    else if (!actual && accounts.totalResults > 0)
      changeAccount(accounts[0]);
    else if (!actual)
      changeAccount(null);
  }, [account, accounts])


  // define callback to reload order and balance data
  const updateAccount = useCallback(() => {
    // only execute, when account is set
    if(!account)
      return;
    // set loading
    setLoadingAccount(true);
    // get all orders
    const pOrder = orderController.getList({sortBy: 'date:asc', limit: 10000});
    const pBalance = balanceController.getList({sortBy: 'date:asc', limit: 10000});
    // call promise
    Promise.all([pOrder, pBalance])
      .then(l => {
        setOrders(l[0].results);
        setBalances(l[1].results);
        setLoadingAccount(false);
      })
      .catch(e => {
        console.error(e);
        setLoadingAccount(false);
      });

  }, [account])


  // get orders from account
  useEffect(() => {
    // register callbacks
    orderController.registerRefreshCallback('asset.view', () => updateAccount());
    balanceController.registerRefreshCallback('asset.view', () => updateAccount());
    updateAccount();
    // remove when unmounted
    return () => {
      orderController.unregisterRefreshCallback('asset.view');
      balanceController.unregisterRefreshCallback('asset.view');
    }
  }, [updateAccount]);

  const changeAccount = (account) => {
    // set state
    setAccount(account);
    // update controllers
    if(account) {
      orderController.setAccount(account.id);
      balanceController.setAccount(account.id);
    }
  }

  // prepare periods
  const {periods, periodsOrders} = preparePeriods(balances, orders);

  return (
    <Container fluid style={{padding: '1em'}}>
      <Grid reversed='computer'>
        <Grid.Column mobile={16} tablet={16} computer={5} widescreen={4}>
          <Segment padded>
            <Header size='medium' dividing>Accounts</Header>
            <AccountMenu
              accounts={accounts}
              account={account}
              balances={balances}
              loading={loadingAccount}
              handleAccountChange={changeAccount}
            />
          </Segment>
          <Segment padded>
            <Header size='medium' dividing>Balance Plot</Header>
            <Container style={{height: "20em"}}>
              <BalancePlot periods={periods} />
            </Container>
          </Segment>
          <Segment padded>
            <Header size='medium' dividing>Annual Return of Invest</Header>
            <RoiTable periods={periods} />
          </Segment>
          <Segment padded>
            <DataSectionSub account={account} />
          </Segment>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={16} computer={11} widescreen={12}>
          <Segment padded>
            <Header size='medium' dividing>Assets</Header>
            <FormModal controller={balanceController} trigger={
              <Button>Add balance</Button>
            }/>
            <div style={{overflow: 'auto'}}>
              <PeriodsTable periods={periods} showOrders={orders && orders.length > 0} />
            </div>
          </Segment>
              <Segment padded>
                <Header size='medium' dividing>Orders</Header>
                <FormModal controller={orderController} trigger={
                  <Button>Add order</Button>}
                />
                <OrdersTable orders={periodsOrders} />
              </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );

}


function preparePeriods (balances, orders) {

  let periods = [];
  let periodsOrders = [];

  if(balances && orders && (balances.length > 0 || orders.length > 0)) {

    // copy balances and add empty
    const bs = [...balances];

    // create previous
    let previous = {};

    // iterate over periods
    bs.push({});
    periodsOrders = bs.map(b => {

      // calculate date
      const start = previous.date?.end;
      const end = b.date ? new Date(b.date) : undefined;

      // get orders
      let os = orders.filter(o => {
        let date = new Date(o.date);
        return ((!end || date < end) && (!start || date >= start));
      }).reverse();

      // calculate order sums
      let sum = os.map(o => -o.amount).reduce((p, s) => p + s, 0.0);
      let cumSum = (previous.cumSum || 0.0) + sum;

      // copy db entry
      const entry = {...b};

      // iterate over orders
      let obj = {
        date: {start, end},
        orders: os,
        sum,
        cumSum,
        sell: os.map(o => o.amount > 0 ? -o.amount : 0.0).reduce((p, s) => p + s, 0.0),
        buy: os.map(o => o.amount < 0 ? -o.amount : 0.0).reduce((p, s) => p + s, 0.0),
        amount: b.amount,
        roi: b.amount / cumSum - 1.0,
        previous,
        entry,
        year: (end ? moment(end) : moment()).format('YYYY')
      }

      // save last date and return
      previous = {...obj};
      return obj;

    });

    // periods
    periods = periodsOrders.slice(0, periodsOrders.length - 1);
    periodsOrders.reverse();

  }

  return {periods, periodsOrders};

}


function RoiTable ({periods}) {

  // TODO: calculate average amount more accurate (on daily basis)
  const years = {};
  periods.forEach(p => {
    years[p.year] = p;
  });

  const previous = {amount: 0.0, orders: 0.0};
  const roiArray = [];

  return (
    <Table definition compact='very'>
      <Table.Header fullWidth>
        <Table.Row>
          <Table.HeaderCell>Year</Table.HeaderCell>
          <Table.HeaderCell>Rel. RoI</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          Object.values(years).map(y => {

            const diffAmount = y.amount - previous.amount;
            const orders = y.cumSum - previous.orders;
            const roi = diffAmount - orders;
            const refAmount = (y.amount + previous.amount) * 0.5;
            const roiPercent = roi / refAmount;
            roiArray.push(roiPercent);

            previous.amount = y.amount;
            previous.orders = y.cumSum;

            return (
              <Table.Row key={y.year}>
                <Table.Cell>{y.year}</Table.Cell>
                <Table.Cell textAlign='right'>
                  <code>{percent(roiPercent, 1)}</code>
                </Table.Cell>
              </Table.Row>
            )

          })
        }
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell>Average</Table.Cell>
          <Table.Cell textAlign='right'>
            <code>
              {percent(roiArray.reduce((p, v) => (p + v), 0.0) / roiArray.length, 1)}
            </code>
          </Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  )

}


function DataSectionSub ({account}) {

  const [balanceObjects, setBalanceObjects] = useState([]);
  const [orderObjects, setOrderObjects] = useState([]);

  useEffect(() => {
    // only load data when account is set
    if(!account)
      return;
    // get balances
    balanceController.getAll()
      .then(o => o.map(e => balanceController.beforeExport(e)))
      .then(o => setBalanceObjects(o))
      .catch(e => console.error(e));
    // get orders
    orderController.getAll()
      .then(o => o.map(e => orderController.beforeExport(e)))
      .then(o => setOrderObjects(o))
      .catch(e => console.error(e));
  }, [account]);

  const onImportBalances = useCallback((objects) => {
    // save imported balances
    balanceController
      .createMany(objects.map(o => balanceController.beforeImport(o)))
      .then(() => balanceController.refresh())
      .catch(e => console.error(e))
  }, [])

  const onImportOrders = useCallback((objects) => {
    // save imported orders
    orderController
      .createMany(objects.map(o => orderController.beforeImport(o)))
      .then(() => orderController.refresh())
      .catch(e => console.error(e))
  }, [])

  const onDeleteAllBalances = useCallback(() => {
    // delete all balances
    balanceController
      .deleteAll()
      .then(() => balanceController.refresh())
      .catch(e => console.error(e))
  }, [])

  const onDeleteAllOrders = useCallback(() => {
    // delete all order
    orderController
      .deleteAll()
      .then(() => orderController.refresh())
      .catch(e => console.error(e))
  }, [])

  // don't show anything, when account is not set
  if(!account)
    return <></>;

  // language definition
  const lang = {
    order: {request: 'all balance entries', buttonText: 'Delete all'},
    balance: {request: 'all balance entries', buttonText: 'Delete all'},
  }

  // return exporter and importer
  return (
    <>
      <Header sub>{account.name} Balance</Header>
      <Button.Group vertical labeled icon fluid>
        <ExportButton object={balanceObjects} />
        <ImportButton onImport={onImportBalances} />
        <DeleteButton onDelete={onDeleteAllBalances} lang={lang.balance}/>
      </Button.Group>

      <Header sub>{account.name} Order</Header>
      <Button.Group vertical labeled icon fluid>
        <ExportButton object={orderObjects} />
        <ImportButton onImport={onImportOrders}/>
        <DeleteButton onDelete={onDeleteAllOrders} lang={lang.order}/>
      </Button.Group>
    </>
  )

}


function AccountMenu({accounts, account, balances, loading, handleAccountChange}) {

  // set last balance value
  const lastBalance = balances && balances.length > 0 && balances[balances.length - 1].amount;
  const balanceColor = lastBalance > 0 ? 'green' : (lastBalance < 0 ? 'red' : 'black');

  return (
    <Grid>
      {
        (accounts && accounts.totalResults > 0) && (
          <Grid.Row columns='two'>
            <Grid.Column>
              <Menu pointing vertical>
                {
                  accounts && accounts.results.map(a =>
                    <Menu.Item
                      key={a.id}
                      name={a.name}
                      active={account?.id === a.id}
                      onClick={() => handleAccountChange(a)}
                    />
                  )
                }
              </Menu>
            </Grid.Column>
            <Grid.Column textAlign='center' verticalAlign='middle'>
              {
                (account && !loading) &&
                <Statistic label='Balance' value={currency.to(lastBalance, 0)} color={balanceColor} />
              }
              {
                loading && (
                  <Dimmer active inverted>
                    <Loader active inverted>Loading</Loader>
                  </Dimmer>
                )
              }
            </Grid.Column>
          </Grid.Row>
        )
      }
      <Grid.Row columns='one'>
        <Grid.Column>
          <FormModal
            controller={accountController}
            trigger={<Button>Create account</Button>}
          />
          {
            account &&
            <FormModal
              object={account}
              controller={accountController}
              trigger={<Button>Rename account</Button>}
            />
          }
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );

}


function PeriodsTable({periods, showOrders}) {

  // don't show table
  if(periods.length === 0)
    return <></>;

  return (
    <Table singleLine basic='very' definition striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          {
            periods.map((m, i) =>
              <Table.HeaderCell key={"h" + i} textAlign='center'>
                {moment(m.date.end).format('ll')}
              </Table.HeaderCell>
            )
          }
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          showOrders && (
            <>
              <Table.Row>
                <Table.Cell>Bought</Table.Cell>
                {
                  periods.map((m, i) =>
                    <Table.Cell key={"b" + i} textAlign='right'>
                      <code>{currency.to(m.buy)}</code>
                    </Table.Cell>
                  )
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>Sold/Dividend</Table.Cell>
                {
                  periods.map((m, i) =>
                    <Table.Cell key={"s" + i} textAlign='right'>
                      <code>{currency.to(m.sell)}</code>
                    </Table.Cell>
                  )
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>Sum of Orders</Table.Cell>
                {
                  periods.map((m, i) =>
                    <Table.Cell key={"s0" + i} textAlign='right'>
                      <code>{currency.to(m.sum)}</code>
                    </Table.Cell>
                  )
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>Cumulative Sum</Table.Cell>
                {
                  periods.map((m, i) =>
                    <Table.Cell key={"s1" + i} textAlign='right'>
                      <code>{currency.to(m.cumSum)}</code>
                    </Table.Cell>
                  )
                }
              </Table.Row>
            </>
          )
        }
        <Table.Row>
          <Table.Cell>Balance</Table.Cell>
          {
            periods.map((m, i) =>
              <Table.Cell key={"a" + i} textAlign='right'>
                <FormModal
                  object={m.entry}
                  controller={balanceController}
                  trigger={
                    <code style={{fontWeight: 'bold', cursor: 'pointer'}}>{currency.to(m.amount)}</code>
                  }
                />
              </Table.Cell>
            )
          }
        </Table.Row>
        <Table.Row>
          <Table.Cell>Return of invest</Table.Cell>
          {
            periods.map((m, i) =>
              <Table.Cell key={"r" + i} textAlign='right'>
                <code>{currency.to(m.amount - m.cumSum)}</code><br />
                { Number.isFinite(m.roi) && <span>({(100.0 * m.roi).toFixed(1) + " %"})</span> }
              </Table.Cell>
            )
          }
        </Table.Row>
      </Table.Body>
    </Table>
  )

}


function OrdersTable ({orders}) {

  // don't show table
  if(orders.length === 0)
    return <></>;

  return (
    <Table color='grey' key='grey' compact='very'>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Date</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Amount €</Table.HeaderCell>
          <Table.HeaderCell>Description</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          orders.map((p, i) => (
            <React.Fragment key={"o" + i}>
              {
                p.date.end && (
                  <Table.Row>
                    <Table.Cell colSpan={4}>
                      <Label ribbon color='blue'>
                        {moment(p.date.end).format('ll')}
                      </Label>
                    </Table.Cell>
                  </Table.Row>
                )
              }
              {
                p.orders.map((order, j) =>
                  <Table.Row
                    key={'po-' + i + '-' + j}
                    warning={OrderTypes[order.type]?.classification(order.amount) === "neutral"}
                    negative={OrderTypes[order.type]?.classification(order.amount) === "negative"}
                    positive={OrderTypes[order.type]?.classification(order.amount) === "positive"}
                  >
                    <Table.Cell>{moment(new Date(order.date)).format('ll')}</Table.Cell>
                    <Table.Cell>{OrderTypes[order.type]?.name || order.type}</Table.Cell>
                    <Table.Cell textAlign='right'>
                      <FormModal
                        object={{...order}}
                        controller={orderController}
                        trigger={<code style={{cursor: 'pointer'}}>{currency.to(Math.abs(order.amount))}</code>}
                      />
                    </Table.Cell>
                    <Table.Cell>{order.description}</Table.Cell>
                  </Table.Row>
                )
              }
            </React.Fragment>
          ))
        }
      </Table.Body>
    </Table>
  )

}

