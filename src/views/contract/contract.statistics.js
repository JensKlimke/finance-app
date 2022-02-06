import {Header, Table} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {monthName} from "../../lib/calendar";
import AmountCell from "../../data/AmountCell";


export function ContractsStatistics ({controller}) {

  // define states
  const [statistics, setStatistics] = useState(null);

  // on mount, unmount
  useEffect(() => {

    // refresh function
    const refresh = () => {
      // load statistics
      controller
        .getStatistics()
        .then(s => setStatistics(s))
        .catch(e => console.error(e))
    }

    // run refresh
    refresh();

    // setup callback
    controller.registerRefreshCallback('statistics', () => refresh());
    return () => controller.unregisterRefreshCallback('statistics');

  }, [controller])

  // render note, when statistic is not loaded
  if(statistics === null)
    return <span>No statistics</span>;

  // render
  return (
    <>
      <Header sub>per Month</Header>
      <DefinitionsTable
        values={statistics.perMonth}
        keyCell={({index}) => <Table.Cell>{monthName(index)}</Table.Cell>}
        valueCell={({value}) => <AmountCell value={value} />}
      />

      <Header sub>metrics</Header>
      <Table color='grey' key='grey' compact='very' definition>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Max. month</Table.Cell>
            <AmountCell value={statistics.perMonth[statistics.maxMonth]} />
          </Table.Row>
          <Table.Row>
            <Table.Cell>Average</Table.Cell>
            <AmountCell value={statistics.monthlyAverage} />
          </Table.Row>
          <Table.Row>
            <Table.Cell>Annual</Table.Cell>
            <AmountCell value={statistics.sumOfYear} />
          </Table.Row>
          <Table.Row>
            <Table.Cell>Shared amount</Table.Cell>
            <AmountCell value={statistics.sharedAmount} />
          </Table.Row>
          <Table.Row>
            <Table.Cell>Per person</Table.Cell>
            <AmountCell value={statistics.sharedAmount * 0.5} />
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );

}

function DefinitionsTable ({values, keyCell: KeyCell, valueCell: ValueCell}) {

  return (
    <Table color='grey' key='grey' compact='very' definition>
      <Table.Body>
        {
          values.map((v, i) =>
            <Table.Row key={i}>
              <KeyCell value={v} index={i} />
              <ValueCell value={v} index={i} />
            </Table.Row>
          )
        }
      </Table.Body>
    </Table>
  )

}

