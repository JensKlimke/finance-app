import React, {useEffect, useState} from 'react';
import {Container, Statistic} from "semantic-ui-react";
import {currency} from "../../lib/currency";


export default function StockBalance({controller}) {

  const [stocks, setStocks] = useState(null);
  const [balance, setBalance] = useState(null);
  const [color, setColor] = useState(null);

  useEffect(() => {
    // abort here if no stocks
    if(!stocks || !stocks.length) return;
    // generate data
    const b = stocks.reduce((s, e) => (s + e.quantity * e.value), 0.0);
    setBalance(b);
    setColor(b > 0 ? 'green' : (b < 0 ? 'red' : 'black'))
  }, [stocks]);

  useEffect(() => {
    controller && controller
      .getAll()
      .then(o => setStocks(o))
      .catch(e => console.error(e));
  }, [controller]);

  // no data
  if(!balance)
    return <></>;

  // return container
  return (
    <Container textAlign='center'>
      <Statistic label='Balance' value={currency.to(balance, 0)} color={color} />
    </Container>
  )

}
