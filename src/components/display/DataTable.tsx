import {Button, Card, Dropdown, Pagination, Table} from 'react-bootstrap';
import {DataComponentConfigType, DataSortConfig, DataType, OnRowClickType} from "../../hooks/entry";
import {useEffect, useReducer} from "react";
import {BsArrowDown, BsArrowUp, BsDot, BsPlusCircle, BsSortAlphaDown} from "react-icons/bs";

const NUMBER_ELEMENTS_PER_PAGE = Number.parseInt(process.env.REACT_APP_TABLE_NUMBER_ELEMENTS_PER_PAGE || '') || 15;


type StateType = {
  sort: {
    field: number
    asc: boolean
  } | undefined;
  page: number
  totalPages: number
  display: any[]
  results: any[]
  totalResults : number
  sortConfig: DataSortConfig | undefined
}

const stateDefault : StateType = {
  sort: undefined,
  page: 0,
  totalPages: 0,
  display: [],
  results: [],
  totalResults: 0,
  sortConfig: undefined
}

type ActionType = {
  action: string,
  payload: any
};

function dataReducer(data: StateType, p: ActionType) : StateType {
  const state = {...data};
  switch (p.action) {
    case 'SET_RESULTS':
      state.results = [...p.payload];
      state.totalPages = Math.ceil(p.payload.length / NUMBER_ELEMENTS_PER_PAGE);
      state.totalResults = p.payload.length;
      break;
    case 'SET_PAGE':
      // set page
      if (state.totalPages <= 1)
        state.page = 0;
      else if (state.totalPages - 1 < state.page)
        state.page = state.totalPages - 1;
      else
        state.page = p.payload;
      break;
    case 'SET_SORT_CONFIG':
      state.sortConfig = [...(p.payload as DataSortConfig)];
      break;
    case 'SORT':
      // save sort
      if (!state.sort)
        state.sort = {field: p.payload, asc: true};
      else if (state.sort.field === p.payload && state.sort.asc)
        state.sort = {field: state.sort.field, asc: false};
      else if (state.sort.field === p.payload && !state.sort.asc)
        state.sort = undefined;
      else
        state.sort = {field: p.payload, asc: true};
      break;
  }
  // sort data
  state.display = [...state.results];
  if (state.sort && state.sortConfig) {
    const sort = state.sortConfig[state.sort.field].callback;
    state.display.sort((a, b) => state?.sort?.asc ? sort(a, b) : sort(b, a));
  }
  // calculate slice indexes
  const from = state.page * NUMBER_ELEMENTS_PER_PAGE;
  const to = (state.page + 1) * NUMBER_ELEMENTS_PER_PAGE;
  // apply page slice
  state.display = state.display.slice(from, to);
  // return state
  return state;
}

export type DataTableProps = {
  tableConfig?: DataComponentConfigType
  cardConfig?: DataComponentConfigType
  sortConfig?: DataSortConfig
  data: DataType
  onRowClick: OnRowClickType
  onAdd?: () => void
}

export default function DataTable({tableConfig, cardConfig, sortConfig, data, onRowClick, onAdd}: DataTableProps) {
  // states
  const [state, dispatch] = useReducer(dataReducer, stateDefault);
  // effects
  useEffect(() => {
    dispatch({action: 'SET_SORT_CONFIG', payload: sortConfig});
  }, [sortConfig]);
  useEffect(() => {
    dispatch({action: 'SET_RESULTS', payload: data.results});
  }, [data.results]);
  // render table
  return (
    <>
      {(onAdd || state.totalPages > 1) && (
        <div className="d-flex justify-content-between align-items-center">
          {onAdd ?
            <Button onClick={onAdd}><BsPlusCircle/></Button> :
            <span>&nbsp;</span>
          }
          {
            (state.totalResults > 0 && state.totalPages > 1) && (
              <Pagination className='mb-0'>
                {
                  Array(state.totalPages).fill(0).map((_, p) => (
                    <Pagination.Item key={p} active={p === state.page} onClick={() => dispatch({action: 'SET_PAGE', payload: p})}>
                      {p + 1}
                    </Pagination.Item>
                  ))
                }
              </Pagination>
            )
          }
          {
            (state.totalResults === 0) && <p className='text-center text-muted mt-3'>Nothing to be shown!</p>
          }
          {sortConfig &&
            <Dropdown>
              <Dropdown.Toggle>
                <BsSortAlphaDown />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {
                  sortConfig.map((c, i) => (
                    <Dropdown.Item key={i} onClick={() => dispatch({action: 'SORT', payload: i})}>
                      {state.sort && state.sort.field === i ? (state.sort.asc ? <BsArrowDown/> : <BsArrowUp/>) : <BsDot />}&nbsp;{c.label}
                    </Dropdown.Item>
                  ))
                }
              </Dropdown.Menu>
            </Dropdown>
          }
        </div>
      )}
      { (state.totalResults > 0) && (
        <>
          <div className='overflow-auto mt-3'>
            <div className='d-none d-md-block'>
              {tableConfig &&
                <TableComponent
                  config={tableConfig}
                  state={state}
                  updateSort={(i) => dispatch({action: 'SORT', payload: i})}
                  onRowClick={onRowClick}
                />
              }
            </div>
            <div className='d-block d-md-none'>
              {cardConfig &&
                <CardsComponent
                  config={cardConfig}
                  state={state}
                  updateSort={(i) => dispatch({action: 'SORT', payload: i})}
                  onRowClick={onRowClick}
                />
              }
            </div>
          </div>
          <p className='text-center text-muted'>
            {`page ${state.page + 1} of ${state.totalPages} - ${data.totalResults} results in total`}
          </p>
        </>
      )}
    </>
  )
}

interface DataComponentProps {
  config: DataComponentConfigType
  sortConfig?: DataSortConfig
  state: StateType
  updateSort: (i: number) => void
  onRowClick: OnRowClickType
}

function TableComponent({config, state, updateSort, onRowClick} : DataComponentProps) {
  return (
    <Table striped bordered hover style={{width: '100%'}}>
      <thead>
      <tr>
        {config.cols.map((c, i) => {
          // create props
          const props = {
            style: c.width ?  {width: `${c.width}%`} : undefined,
            key: i,
            className: 'text-center text-nowrap user-select-none',
            scope: 'col',
          };
          // switch
          if (c.sort !== undefined) {
            return (
              <th
                {...props}
                onClick={() => updateSort(c.sort || 0)}
                role='button'
              >
                {c.label}&nbsp;{state.sort && state.sort.field === c.sort ? (state.sort.asc ? <BsArrowDown/> : <BsArrowUp/>) : <BsDot />}
              </th>
            );
          } else {
            return (
              <th {...props}>
                {c.label}
              </th>
            );
          }
        })}
      </tr>
      </thead>
      <tbody>
      {
        state.display.map((d, i) => (
          <tr key={i} onClick={() => onRowClick(d, state.results, i, state.page, state.totalPages)} role='button'>
            {config.cols.map((c, j) => (
              <td key={j} className={c.className || ''}>
                {c.content(d, state.results, i, state.page, state.totalPages)}
              </td>
            ))}
          </tr>
        ))
      }
      </tbody>
    </Table>
  )
}

function CardsComponent ({config, state, onRowClick} : DataComponentProps) {
  return (
    <>
      {
        state.display.map((d, i) => (
          <Card key={i} onClick={() => onRowClick(d, state.results, i, state.page, state.totalPages)} role='button' className='mb-3'>
            { config.title && <Card.Header>{config.title(d, state.results, i)}</Card.Header> }
            <Table borderless striped className='m-0'>
              <tbody>
              { config.cols.map((c, j) => (
                <tr key={j}>
                  <td key={i}>{c.label}</td>
                  <td className={c.className || ''}>{c.content(d, state.results, i, state.page, state.totalPages)}</td>
                </tr>
              )) }
              </tbody>
            </Table>
            { config.footer && <Card.Footer>{config.footer(d, state.results, i, state.page, state.totalPages)}</Card.Footer> }
          </Card>
        ))
      }
    </>
  )
}
