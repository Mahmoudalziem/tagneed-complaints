import React from "react";
import MUIDataTable from "mui-datatables";

const Table = (props) => {


  const Options = {
    enableNestedDataAccess: '.',
    // search:false,
    rowsPerPage: 10,
    // selectableRows: "single",
    searchPlaceholder: "Search ...",
    ...props.options
  };

  return (
    <MUIDataTable
      title={props.title}
      data={props.dataTable}
      columns={props.Columns}
      options={Options}
    />
  );
};

export default Table;
