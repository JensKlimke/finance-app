import React from "react";
import {ButtonGroup, Card, Col, Container, Row} from "react-bootstrap";
import AccountProvider, {AccountType, useAccounts} from "./hooks/Accounts.context";
import BalanceProvider, {BalanceType, useBalances} from "./hooks/Balances.context";
import OrdersTable from "./components/OrdersTable";
import OrderProvider, {OrderType, useOrders} from "./hooks/Orders.context";
import {PeriodType, usePeriodData} from "./hooks/periods";
import BalancesTable from "./components/BalancesTable";
import BalanceChart from "./components/BalanceChart";
import OrdersChart from "./components/OrdersChart";
import ImportButton from "../../components/forms/ImportButton";
import ExportButton from "../../components/forms/ExportButton";
import DeleteButton from "../../components/forms/DeleteButton";
import AccountCard from "./components/AccountCard";

export default function AssetsPage() {
  // render
  return (
    <AccountProvider>
      <BalanceProvider>
        <OrderProvider>
          <AccountManager/>
        </OrderProvider>
      </BalanceProvider>
    </AccountProvider>
  );
}

function AccountManager() {
  // state
  const {account, setAccount, periods, data} = usePeriodData();
  // check
  if (!data.accounts) return null;
  // render
  return (
    <Container>
      <Row>
        <Col className='d-block d-lg-none'>
          <AccountCard
            account={account}
            setAccount={setAccount}
            accountData={data.accounts}
            className='mb-3'
          />
        </Col>
        <DetailedContentView
          account={account}
          periods={periods}
          balances={data.balances}
          orders={data.orders}
        />
        <Col lg={4}>
          <AccountCard
            className='d-none d-lg-block mb-3'
            account={account}
            accountData={data.accounts}
            setAccount={setAccount}
          />
          <MetricsCardView
            account={account}
            periods={periods}
          />
          <Card>
            <Card.Header>Data Management</Card.Header>
            <Card.Body>
              <ImportExportButtonGroup
                account={account}
                accounts={data?.accounts}
                balances={data?.balances}
                orders={data?.orders}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

type AccountPeriodProps = {
  account : string | undefined,
  periods ?: PeriodType[] | undefined
  accounts ?: AccountType[] | undefined
  balances ?: BalanceType[] | undefined
  orders ?: OrderType[] | undefined
}

function DetailedContentView ({account, periods, balances, orders} : AccountPeriodProps) {
  // do not render
  if (!account || !periods) {
    return (
      <Col lg={8} className='mb-3 d-none d-lg-block'>
        <p className='text-center'>There is no data to be shown!</p>
      </Col>
    );
  }
  // render
  return (
    <Col lg={8} className='mb-3'>
      <Card>
        <Card.Header>Balances</Card.Header>
        <Card.Body>
          <BalancesTable periods={periods} balances={balances} />
        </Card.Body>
      </Card>
      <Card className='mt-4'>
        <Card.Header>Orders</Card.Header>
        <Card.Body>
          <OrdersTable periods={periods} orders={orders} />
        </Card.Body>
      </Card>
    </Col>
  )
}


function MetricsCardView ({account, periods} : AccountPeriodProps) {
  // check
  if (!account || !periods || periods.length === 0) return null;
  // render
  return (
    <Card className='mb-4'>
      <Card.Header>Metrics</Card.Header>
      <Card.Body>
        <BalanceChart periods={periods}/>
        <OrdersChart periods={periods}/>
      </Card.Body>
    </Card>
  );
}


function ImportExportButtonGroup ({account, accounts, orders, balances} : AccountPeriodProps ) {
  // get data
  const {
    eraseAll : eraseAllAccounts,
    saveMany : saveManyAccounts
  } = useAccounts();
  const {
    eraseAll : eraseAllBalances,
    saveMany : saveManyBalances
  } = useBalances();
  const {
    eraseAll : eraseAllOrders,
    saveMany : saveManyOrders
  } = useOrders();
  // render
  return (
    <>
      {accounts && (
        <>
          <h5>Accounts</h5>
          <ButtonGroup vertical className='d-flex'>
            <ImportButton onImport={saveManyAccounts}/>
            <ExportButton object={accounts}/>
            <DeleteButton onDelete={eraseAllAccounts}/>
          </ButtonGroup>
        </>
      )}
      {account && balances && (
        <>
          <h5 className='mt-4'>Balances</h5>
          <ButtonGroup vertical className='d-flex'>
            <ImportButton onImport={saveManyBalances}/>
            <ExportButton object={balances}/>
            <DeleteButton onDelete={eraseAllBalances}/>
          </ButtonGroup>
        </>
      )}
      {account && orders && (
        <>
          <h5 className='mt-4'>Orders</h5>
          <ButtonGroup vertical className='d-flex'>
            <ImportButton onImport={saveManyOrders}/>
            <ExportButton object={orders}/>
            <DeleteButton onDelete={eraseAllOrders}/>
          </ButtonGroup>
        </>
      )}
    </>
  );
}
