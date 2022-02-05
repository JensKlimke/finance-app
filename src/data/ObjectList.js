import {Container, Dimmer, Grid, GridColumn, Loader, Pagination, Placeholder, Table} from "semantic-ui-react";
import {useCallback, useEffect, useState} from "react";

export function ObjectList ({controller}) {

  // get elements
  const {header: ObjectListHeader, row: ObjectListRow, create: CreateObjectTrigger} = controller.elements;

  // states
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(['', 'asc']);
  const [objects, setObjects] = useState(null);

  const setSort = (s) => {
    // get current sort
    const current = [...sortBy];
    // check if current is same field
    if(current[0] === s) {
      // change order direction
      current[1] = current[1] === 'asc' ? 'desc' : 'asc';
    } else {
      // set new and direction to asc
      current[0] = s;
      current[1] = 'asc';
    }
    // create string
    setSortBy(current);
  }

  // register refresh
  const refresh = useCallback(() => {

    // create object
    const params = {
      limit: 25,
      page: page || 1,
    }

    // set sort
    sortBy[0] !== '' && (params.sortBy = sortBy.join(':'));

    // get list
    controller.getList(params)
      .then(l => setObjects(l))
      .catch(e => console.error(e));

  }, [page, sortBy, controller]);

  // register refresh
  useEffect(() => {
    // register refresh function and execute
    controller.registerRefreshCallback('list', refresh);
    refresh();
    // unregister refresh function
    return () => controller.unregisterRefreshCallback('list');
  }, [controller, refresh])

  // show loading page
  if(!objects)
    return <LoadingPage />

  // show empty message
  if(objects.totalResults === 0) {
    return (
      <div style={{textAlign: 'center'}}>
        <i>{controller.messages.emptyList}</i>
      </div>
    );
  }

  // define sorted object
  let sorted = {};
  sortBy[0] !== '' && (sorted[sortBy[0]] = sortBy[1] === 'asc' ? 'ascending' : 'descending');

  // return a list of rows
  return (
    <>
      <Grid>
        <GridColumn width={4}>
          <CreateObjectTrigger />
        </GridColumn>
        <GridColumn width={8} textAlign='center'>
          <ConditionalPagination objects={objects} onChange={setPage} />
        </GridColumn>
        <GridColumn width={4} />
      </Grid>
      <Table color='grey' key='grey' compact='very' definition sortable>
        <Table.Header fullWidth>
          <ObjectListHeader sort={(s) => setSort(s)} sorted={sorted} />
        </Table.Header>
        <Table.Body>
          {objects.results.map(c =>
            <ObjectListRow key={c.id} object={c} handleChange={controller.refresh} />
          )}
        </Table.Body>
      </Table>
      <Container textAlign='center'>
        <i style={{color: 'gray'}}>{controller.messages.noOfElements(objects.totalResults)}</i>
      </Container>
    </>
  );

}

const ConditionalPagination = ({objects, onChange}) => {

  if(objects.totalPages > 1) {
    return <Pagination
      activePage={objects.page}
      totalPages={objects.totalPages}
      onPageChange={(e, {activePage}) => onChange(activePage)}
      boundaryRange={null}
      ellipsisItem={null}
      firstItem={null}
      lastItem={null}
      siblingRange={1}
    />
  }

  // return nothing
  return <></>;

}

const LoadingPage = () => (
  <>
    <Dimmer active inverted>
      <Loader active inverted>Loading</Loader>
    </Dimmer>
    <Placeholder>
      <Placeholder.Line length='full' />
      <Placeholder.Line length='full' />
      <Placeholder.Line length='full' />
      <Placeholder.Line length='full' />
      <Placeholder.Line length='full' />
    </Placeholder>
  </>
);
