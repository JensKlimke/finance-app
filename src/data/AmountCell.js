import {Table} from "semantic-ui-react";
import {currency} from "../lib/currency";

export default function AmountCell ({value}) {
  return <Table.Cell textAlign='right'><code>{currency.to(value)}</code></Table.Cell>
}
