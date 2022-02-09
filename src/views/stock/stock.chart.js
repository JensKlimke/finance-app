import React, {useEffect, useState} from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import randomColor from 'randomcolor';
import {Container, Header, Menu} from "semantic-ui-react";


ChartJS.register(ArcElement, Tooltip, Legend);

const groups = {
  purchase: {
    name: 'Purchase Value',
    data: e => (e.quantity * e.purchase),
  },
  value: {
    name: 'Current Value',
    data: e => (e.quantity * e.value),
  },
  ratio: {
    name: 'Value Purchase Ratio',
    data: e => (e.value / e.purchase),
  },
  quantity: {
    name: 'Quantity',
    data: e => e.quantity,
  }
};

const options = {
  plugins: {
    title: { display: false },
    legend: { display: false },
    tooltips: { enabled: false },
  },
};


export default function StockChart({controller}) {

  const [stocks, setStocks] = useState(null);
  const [data, setData] = useState(null);
  const [dataRoi, setDataRoi] = useState(null);
  const [active, setActive] = useState("value");

  useEffect(() => {
    // abort here if no stocks
    if(!stocks || !stocks.length) return;
    // generate data
    setData({
      labels: stocks.map(e => e.name),
      datasets: [{
        label: 'Portfolio by Value',
        data: stocks.map(e => groups[active].data(e).toFixed(2)),
        backgroundColor: randomColor({count: stocks.length, luminosity: 'light', seed: 10}),
        borderColor: randomColor({count: stocks.length, luminosity: 'dark', seed: 10}),
        borderWidth: 1,
      }]
    });
    // set data
    setDataRoi({
      labels: stocks.map(e => e.name),
      datasets: [{
        data: stocks.map(e => 100 * ((e.value - e.purchase) / e.purchase)),
        backgroundColor: randomColor({count: stocks.length, luminosity: 'light', seed: 10}),
        borderColor: randomColor({count: stocks.length, luminosity: 'dark', seed: 10}),
        borderWidth: 1,
      }]
    });
  }, [active, stocks]);

  useEffect(() => {
    controller && controller
      .getAll()
      .then(o => setStocks(o))
      .catch(e => console.error(e));
  }, [controller]);

  // no data
  if(!data)
    return <></>;

  // return container
  return (
    <Container textAlign='center'>
      <Doughnut data={data} type='doughnut' />
      <Menu secondary pointing>
        {
          Object.entries(groups).map(([k, e]) => (
            <Menu.Menu key={k}>
              <Menu.Item
                name={e.name}
                active={active === k}
                onClick={() => setActive(k)}
              />
            </Menu.Menu>
          ))
        }
      </Menu>
      <Header size='small'>Return on Invest</Header>
      <Bar data={dataRoi} options={options} type='bar' />
    </Container>
  )

}
