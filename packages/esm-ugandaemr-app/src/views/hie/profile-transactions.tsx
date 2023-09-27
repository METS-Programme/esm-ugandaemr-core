import React, { useEffect, useState } from 'react';
import {
  Tile,
  DatePicker,
  DatePickerInput,
  DataTable,
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  DataTableSkeleton,
  Pagination,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
} from '@carbon/react';
import styles from './styles/hie-components.scss';

const headers = [
  // { key: 'clientNumber', header: 'Client Number' },
  { key: 'dateOfRequest', header: 'Date of Request' },
  { key: 'dateOfResponse', header: 'Date of Response' },
  { key: 'provider', header: 'Provider' },
  { key: 'source', header: 'Source' },
];

const DateFilterInput = (props) => {
  // const {setStartDate, setEndDate} = props;
  return (
    <DatePicker
      datePickerType="range"
      className={styles.datePicker}
      aria-label="Date Range Filter"
      onChange={(event) => {
        // if (event.length === 1){
        //   setStartDate(event[0])
        // } else if (event.length === 2){
        //   setStartDate(event[0])
        //   setEndDate(event[1])
        // }
      }}
    >
      <DatePickerInput
        id="date-picker-input-id-start"
        placeholder="Start date"
        labelText="Start date"
        hideLabel={true}
        size="md"
      />
      <DatePickerInput
        id="date-picker-input-id-finish"
        placeholder="End date"
        hideLabel={true}
        labelText="End date"
        size="md"
      />
    </DatePicker>
  );
};

const HIEProfileDataTable = ({ tableInfo }) => {
  // console.log(tableInfo)
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);
  // const [rowData, setRowData] = useState(tableInfo? tableInfo: [])

  // useEffect(() => {
  //   if (startDate && endDate) {
  //     console.log('here')
  //     let filtered = rowData.filter((transaction)=>{
  //       let transactionDate = new Date(transaction["dateOfRequest"]);
  //       return(transactionDate >= startDate &&
  //         transactionDate <= endDate);
  //     })
  //     setRowData(filtered)
  //   }else{
  //     if(tableInfo){
  //       setRowData(tableInfo)
  //     } else{
  //       setRowData([])
  //     }

  //   }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [endDate, startDate])

  const defineTableRows = (arr) => {
    console.info(arr);
    if (arr) {
      return arr.map((element, n) => {
        return { ...element, id: `${n}` };
      });
    }
  };

  const tableRows = React.useMemo(() => defineTableRows(tableInfo), [tableInfo]);

  if (tableInfo) {
    return (
      <>
        <DataTable rows={tableRows} headers={headers}>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps, getToolbarProps }) => (
            <TableContainer>
              <TableToolbar
                style={{ position: 'static', height: '3rem', overflow: 'visible', backgroundColor: 'color' }}
                {...getToolbarProps()}
                aria-label="data table toolbar"
              >
                <TableToolbarContent className={''}>
                  <div>
                    <DateFilterInput
                    //  setEndDate={setEndDate} setStartDate={setStartDate}
                    />
                  </div>
                </TableToolbarContent>
              </TableToolbar>

              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => {
                      // console.log(header, "header");
                      return (
                        <TableHeader
                          {...getHeaderProps({
                            header,
                          })}
                        >
                          {header.header}
                        </TableHeader>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    return (
                      <TableRow {...getRowProps({ row })}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
        <Pagination
          backwardText="Previous page"
          forwardText="Next page"
          itemsPerPageText="Items per page:"
          onChange={function noRefCheck() {}}
          page={1}
          pageSize={10}
          pageSizes={[10, 20, 30, 40, 50]}
          size="md"
          totalItems={tableInfo.length}
        />
      </>
    );
  }
};

// eslint-disable-next-line no-empty-pattern
const ProfileTransactionsSection = ({ transactions, activeProfile }) => {
  const { incoming, outgoing } = transactions;
  return (
    <Tabs>
      <TabList className={styles.transactionsSection} aria-label="List of tabs" contained>
        <Tab>Incoming</Tab>
        <Tab>Outgoing</Tab>
      </TabList>
      {activeProfile ? (
        <TabPanels>
          <TabPanel>
            {incoming.length > 0 ? (
              <HIEProfileDataTable tableInfo={incoming} />
            ) : (
              <Tile className={styles.noTransactionTile} fullWidth>
                <p>There are no incoming transactions for {activeProfile}</p>
              </Tile>
            )}
          </TabPanel>
          <TabPanel>
            {outgoing.length > 0 ? (
              <HIEProfileDataTable tableInfo={outgoing} />
            ) : (
              <Tile className={styles.noTransactionTile} fullWidth>
                <p>There are no outgoing transactions for {activeProfile}</p>
              </Tile>
            )}
          </TabPanel>
        </TabPanels>
      ) : (
        <Tile className={styles.emptyState} fullWidth>
          <p>Click a profile to view transactions</p>
        </Tile>
      )}
    </Tabs>
  );
};

export default ProfileTransactionsSection;
