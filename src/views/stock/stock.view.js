import {Container, Grid, Header, Segment} from "semantic-ui-react";
import {StockContext, Stocks} from "./stock.controller";
import ObjectList from "../../data/ObjectList";
import DataSection from "../../data/DataSection";
import {parseNumberLocale} from "../../lib/parseNumberLocale";
import StockChart from "./stock.chart";

const defString = 'de:s;n;q;*;p;*;*;*;v;*;*;*;*;*;*;*;*';

const parseLine = (line) => {
  // parse
  const setup = defString.split(':');
  const locale = setup[0];
  const regexp = setup[1]
    .replaceAll('*', '[^;]*')
    .replaceAll('-', '.*')
    .replace('s', '([A-Za-z0-9]+)')
    .replace('n', '([^;]+)')
    .replace('q', '([0-9,.]+)')
    .replace('p', '([0-9,.]+)')
    .replace('v', '([0-9,.]+)');
  const match = line.match(`^${regexp}$`);
  // no result (ignore line)
  if(match === null)
    return null;
  // create dataset
  return {
    symbol: match[1],
    name: match[2],
    quantity: parseNumberLocale(locale, match[3]),
    purchase: parseNumberLocale(locale, match[4]),
    value: parseNumberLocale(locale, match[5]),
  };
}

export default function StockView() {

  // language definition
  const lang = {request: 'all stock items', buttonText: 'Delete all', header: 'Stock Items'};

  return (
    <Stocks>
      <Container fluid style={{padding: '1em'}}>
        <Grid reversed='computer'>
          <Grid.Column mobile={16} tablet={16} computer={6}>
            <Segment>
              <Header size='medium' dividing>Analytics</Header>
              <StockContext.Consumer>
                { (controller) => controller &&
                  <StockChart controller={controller} />
                }
              </StockContext.Consumer>
            </Segment>
            <Segment>
              <StockContext.Consumer>
                { (controller) => controller &&
                  <DataSection controller={controller} lang={lang} csv={parseLine} />
                }
              </StockContext.Consumer>
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={16} computer={10} >
            <Segment>
              <Header size='medium' dividing>Stock Item List</Header>
              <StockContext.Consumer>
                {(controller) => controller &&
                  <ObjectList controller={controller} />
                }
              </StockContext.Consumer>
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    </Stocks>
  );

}

